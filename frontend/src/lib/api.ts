import { getAccessToken } from "@/lib/supabase";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

export type CompletedJob = {
  jobId: number;
  jobName: string | null;
  stickmanifiedS3ObjectKey: string | null;
};

export type InProgressJob = {
  jobId: number;
  jobName: string | null;
  percentageCompleted: number;
};

export type JobsUpdateEvent = {
  jobUpdates: InProgressJob[];
};

async function authHeaders(extra?: HeadersInit) {
  const token = await getAccessToken();
  const headers = new Headers(extra);
  headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

async function readError(response: Response) {
  const text = await response.text();
  if (!text) return `Request failed with ${response.status}`;

  try {
    const json = JSON.parse(text) as { error?: string; message?: string };
    return json.error || json.message || text;
  } catch {
    return text;
  }
}

function encodePathValue(value: string | number) {
  return encodeURIComponent(String(value));
}

export function getObjectKeyFromUploadUrl(uploadUrl: string) {
  const url = new URL(uploadUrl);
  const marker = "/videos/";
  const markerIndex = url.pathname.indexOf(marker);
  if (markerIndex === -1) throw new Error("Upload URL did not contain a videos object key.");
  return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
}

async function apiFetch(path: string, init?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: await authHeaders(init?.headers),
  });

  if (!response.ok) throw new Error(await readError(response));
  return response;
}

export async function getUploadUrl() {
  const response = await apiFetch("/videos/upload");
  return response.text();
}

export async function uploadVideoToSignedUrl(uploadUrl: string, file: File) {
  const body = new FormData();
  body.append("file", file);

  const response = await fetch(uploadUrl, {
    method: "POST",
    body,
  });

  if (!response.ok) throw new Error(await readError(response));
}

export async function createProcessingJob(objectKey: string) {
  await apiFetch(`/jobs/create/${encodePathValue(objectKey)}`, {
    method: "POST",
  });
}

export async function uploadAndCreateJob(file: File) {
  const uploadUrl = await getUploadUrl();
  await uploadVideoToSignedUrl(uploadUrl, file);
  const objectKey = getObjectKeyFromUploadUrl(uploadUrl);
  await createProcessingJob(objectKey);
  return objectKey;
}

export async function listCompletedJobs() {
  const response = await apiFetch("/jobs/completed");
  return response.json() as Promise<CompletedJob[]>;
}

export async function getJobCount() {
  const response = await apiFetch("/jobs/count");
  return response.json() as Promise<number>;
}

export async function deleteJob(jobId: number) {
  await apiFetch(`/jobs/${encodePathValue(jobId)}`, {
    method: "DELETE",
  });
}

export async function getDownloadUrl(objectKey: string) {
  const response = await fetch(`${API_BASE_URL}/videos/download/${encodePathValue(objectKey)}`, {
    headers: await authHeaders(),
    redirect: "follow",
  });

  if (!response.ok) throw new Error(await readError(response));
  return response.url;
}

export async function updateUserMaxJobs(userId: string, maxJobs: number) {
  await apiFetch(`/users/${encodePathValue(userId)}/max-jobs/${encodePathValue(maxJobs)}`, {
    method: "PUT",
  });
}

export async function streamInProgressJobs(
  onUpdate: (jobs: InProgressJob[]) => void,
  signal?: AbortSignal,
) {
  const response = await fetch(`${API_BASE_URL}/jobs/in-progress`, {
    headers: await authHeaders({ Accept: "text/event-stream" }),
    signal,
  });

  if (!response.ok) throw new Error(await readError(response));
  if (!response.body) throw new Error("Streaming is not supported by this browser.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const messages = buffer.split(/\r?\n\r?\n/);
    buffer = messages.pop() ?? "";

    for (const message of messages) {
      const data = message
        .split(/\r?\n/)
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim())
        .join("\n");

      if (!data) continue;
      const parsed = JSON.parse(data) as JobsUpdateEvent;
      onUpdate(parsed.jobUpdates ?? []);
    }
  }
}
