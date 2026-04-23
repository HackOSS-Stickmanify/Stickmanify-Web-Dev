import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExternalLink, Trash2 } from "lucide-react";
import CreateDialog from "@/pages/CreateDialogue";
import {
  deleteJob,
  getDownloadUrl,
  getJobCount,
  listCompletedJobs,
  type CompletedJob,
} from "@/lib/api";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>([]);
  const [jobCount, setJobCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const recentJobs = useMemo(() => completedJobs.slice(0, 6), [completedJobs]);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [jobs, count] = await Promise.all([
        listCompletedJobs(),
        getJobCount(),
      ]);
      setCompletedJobs(jobs);
      setJobCount(count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  async function handleOpen(job: CompletedJob) {
    if (!job.stickmanifiedS3ObjectKey) return;

    setActionError("");
    setDownloadingId(job.jobId);

    try {
      const url = await getDownloadUrl(job.stickmanifiedS3ObjectKey);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not open the download.");
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDelete(job: CompletedJob) {
    setActionError("");
    setDeletingId(job.jobId);

    try {
      await deleteJob(job.jobId);
      await loadJobs();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not delete the job.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-10">
      <div className="relative text-center pt-2">
        <div className="pointer-events-none absolute -left-2 top-0 opacity-[0.09] anim-sway hidden lg:block">
          <StickmanIcon width={52} strokeWidth={2.5} />
        </div>
        <div className="pointer-events-none absolute -right-2 top-0 opacity-[0.07] anim-bounce hidden lg:block">
          <StickmanIcon width={52} strokeWidth={2.5} />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-black">
          What would you Stickmanify today?
        </h1>
        <p className="mt-2 text-sm text-black/40">
          Type a prompt or upload a video and we'll turn it into a stickman animation.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 shadow-sm">
            <Input
              placeholder="Enter a prompt / Upload a video"
              className="h-11 flex-1 border-0 bg-transparent text-black placeholder:text-black/30 focus-visible:ring-0 shadow-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") setDialogOpen(true); }}
            />
            <Button
              className="h-10 rounded-full bg-black text-white font-bold px-6 hover:bg-black/85 transition"
              onClick={() => setDialogOpen(true)}
            >
              GO!
            </Button>
          </div>
        </div>
      </div>

      <CreateDialog
        triggerVariant="none"
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialPrompt={prompt}
        onJobCreated={loadJobs}
      />

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold text-black">Recent jobs</h2>
          <span className="text-xs text-black/35">
            {jobCount === null ? `${recentJobs.length} visible` : `${jobCount} total`}
          </span>
        </div>

        {(error || actionError) && (
          <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {actionError || error}
          </p>
        )}

        {loading ? (
          <EmptyState message="Loading jobs..." />
        ) : recentJobs.length === 0 ? (
          <EmptyState message="No completed jobs yet" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentJobs.map((job) => (
              <Card
                key={job.jobId}
                className="rounded-2xl border border-black/8 bg-white text-black shadow-sm hover:shadow-md hover:border-black/14 transition group"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-black/75">
                    {job.jobName || `Job #${job.jobId}`}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-28 rounded-xl bg-black/3 border border-black/6 flex items-center justify-center overflow-hidden">
                    <StickmanIcon width={28} strokeWidth={3} className="opacity-10 group-hover:opacity-20 transition" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs rounded-full border border-black/12 px-2 py-0.5 text-black/45">
                      Done
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        className="h-8 w-8 px-0 rounded-full text-black/35 hover:text-black hover:bg-black/6"
                        disabled={!job.stickmanifiedS3ObjectKey || downloadingId === job.jobId}
                        onClick={() => handleOpen(job)}
                        aria-label={`Open ${job.jobName || `Job #${job.jobId}`}`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 px-0 rounded-full text-black/35 hover:text-red-500 hover:bg-red-50"
                        disabled={deletingId === job.jobId}
                        onClick={() => handleDelete(job)}
                        aria-label={`Delete ${job.jobName || `Job #${job.jobId}`}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-4 text-black/30">
      <StickmanIcon width={40} strokeWidth={2.5} className="opacity-15 anim-sway" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function StickmanIcon({
  width,
  strokeWidth,
  className,
}: {
  width: number;
  strokeWidth: number;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 44 80" width={width} fill="none" stroke="black" strokeWidth={strokeWidth} strokeLinecap="round"
      className={className}>
      <circle cx="22" cy="8" r="7"/>
      <line x1="22" y1="15" x2="22" y2="46"/>
      <line x1="22" y1="24" x2="6"  y2="18"/>
      <line x1="22" y1="24" x2="38" y2="30"/>
      <line x1="22" y1="46" x2="8"  y2="70"/>
      <line x1="22" y1="46" x2="36" y2="70"/>
    </svg>
  );
}
