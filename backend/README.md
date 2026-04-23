# Stickmanify Backend API Reference

This document describes the currently implemented REST/SSE endpoints in the Spring Boot backend.

## Base URL

- Local default: `http://localhost:8080`
- All endpoints below are relative to the base URL.

## Authentication & Common Headers

All API routes are protected by `SupabaseJwtFilter` except infrastructure paths beginning with:
- `/actuator`

### Required request header (most routes)

```http
Authorization: Bearer <supabase_access_token>
```

If the header is missing or malformed, the backend returns:

- `401 Unauthorized`
- `Content-Type: application/json`
- Body:

```json
{ "error": "Unauthorized" }
```

If the JWT is invalid/expired, it returns:

```json
{ "error": "Invalid or expired token" }
```

## Endpoint Details

---

### 1) Get pre-signed upload URL

- **Verb:** `GET`
- **URI:** `/videos/upload`
- **Description:** Generates a short-lived pre-signed object-storage URL. The object key is auto-generated as `<userId>/<uuid>`.

#### Required headers
- `Authorization: Bearer <JWT>`

#### Path/query params
- None

#### Request body
- None

#### Success response
- **Status:** `200 OK`
- **Headers:** `Content-Type: text/plain;charset=UTF-8` (default Spring string response)
- **Body (string):** pre-signed URL

Example:
```text
https://.../storage/v1/s3/videos/<userId>/<uuid>?X-Amz-Algorithm=...
```

---

### 2) Redirect to pre-signed download URL

- **Verb:** `GET`
- **URI:** `/videos/download/{objectKey}`
- **Description:** Returns an HTTP redirect to a pre-signed download URL for a stored object.

#### Required headers
- `Authorization: Bearer <JWT>`

#### Path/query params
- **Path:** `objectKey` (`string`)
  - Example: `user-123/abc-def-file`

#### Request body
- None

#### Success response
- **Status:** `302 Found`
- **Headers:**
  - `Location: <presigned_download_url>`
  - `Cache-Control: no-cache`
- **Body:** empty

---

### 3) Create a processing job

- **Verb:** `POST`
- **URI:** `/jobs/create/{objectKey}`
- **Description:** Creates a job linked to the uploaded object and queues it for processing.

#### Required headers
- `Authorization: Bearer <JWT>`

#### Path/query params
- **Path:** `objectKey` (`string`) - source video object key

#### Request body
- None

#### Success response
- **Status:** `200 OK`
- **Body:** empty

#### Possible error behavior
- If user is at/max over job quota, service throws runtime exception (currently no explicit exception mapping).

---

### 4) Update job status (admin only FrontEnd DO NOT IMPLEMENT)

- **Verb:** `PUT`
- **URI:** `/jobs/{jobId}`
- **Description:** Updates progress/status for a job. Intended for worker/admin flows.

#### Required headers
- `Authorization: Bearer <JWT>` (JWT user must have role `admin`)

#### Path/query params
- **Path:** `jobId` (`integer`)

#### Request body (JSON)

```json
{
  "percentCompleted": 80,
  "jobStatus": "IN_PROGRESS",
  "stickmanifiedS3ObjectKey": "optional/output-key"
}
```

- `percentCompleted` (`integer`, required)
- `jobStatus` (`string`, required enum): `COMPLETED | IN_PROGRESS | FAILED | DELETED | CANCELLED`
- `stickmanifiedS3ObjectKey` (`string`, optional/nullable)

#### Success response
- **Status:** `200 OK`
- **Body:** empty

#### Authorization failure
- **Status:** `401 Unauthorized`
- **Body:** empty (controller sets status directly)

---

### 5) List completed jobs for current user

- **Verb:** `GET`
- **URI:** `/jobs/completed`
- **Description:** Returns all completed jobs for the authenticated user.

#### Required headers
- `Authorization: Bearer <JWT>`

#### Path/query params
- None

#### Request body
- None

#### Success response
- **Status:** `200 OK`
- **Headers:** `Content-Type: application/json`
- **Body (JSON array):**

```json
[
  {
    "jobId": 1,
    "jobName": "example-job",
    "stickmanifiedS3ObjectKey": "user-123/result-key"
  }
]
```

> Note: `jobName` may be `null` with current service implementation.

---

### 6) Get total job count for current user

- **Verb:** `GET`
- **URI:** `/jobs/count`
- **Description:** Returns `completed + in_progress` job count for the authenticated user.

#### Required headers
- `Authorization: Bearer <JWT>`

#### Path/query params
- None

#### Request body
- None

#### Success response
- **Status:** `200 OK`
- **Headers:** `Content-Type: application/json`
- **Body (number):**

```json
3
```

---

### 7) Soft-delete a job

- **Verb:** `DELETE`
- **URI:** `/jobs/{jobId}`
- **Description:** Marks a job as `DELETED`.

#### Required headers
- `Authorization: Bearer <JWT>`

#### Path/query params
- **Path:** `jobId` (`integer`)

#### Request body
- None

#### Success response
- **Status:** `200 OK`
- **Body:** empty

---

### 8) Stream in-progress jobs (SSE)

- **Verb:** `GET`
- **URI:** `/jobs/in-progress`
- **Description:** Streams in-progress job updates using Server-Sent Events.

#### Required headers
- `Authorization: Bearer <JWT>`
- Recommended client header: `Accept: text/event-stream`

#### Path/query params
- None

#### Request body
- None

#### Success response
- **Status:** `200 OK`
- **Response headers (typical SSE):**
  - `Content-Type: text/event-stream`
  - `Cache-Control: no-cache`
  - `Connection: keep-alive`

#### Event payload format
Event name is `Jobs Update Event`, and `data` contains JSON text:

```json
{
  "jobUpdates": [
    {
      "jobId": 1,
      "jobName": "job-1",
      "percentageCompleted": 45
    }
  ]
}
```

> The stream emitter timeout is set to 30 minutes. If there are no in-progress jobs, server-side logic currently throws and completes the emitter with error.

---

### 9) Update user max jobs (admin only)

- **Verb:** `PUT`
- **URI:** `/users/{userId}/max-jobs/{maxJobs}`
- **Description:** Updates a user's maximum allowed active+completed jobs.

#### Required headers
- `Authorization: Bearer <JWT>` (JWT user must have role `admin`)

#### Path/query params
- **Path:** `userId` (`string`)
- **Path:** `maxJobs` (`integer`)

#### Request body
- None

#### Success response
- **Status:** `200 OK`
- **Body:** empty

#### Authorization failure
- **Status:** `401 Unauthorized`
- **Body:** empty (controller sets status directly)

---

## Notes

- JWT role extraction uses `app_metadata.user_role` claim (`admin`/`user`).
- Some service exceptions are not converted into structured error responses yet; depending on failure path, default Spring error handling may return generic 5xx JSON.
