import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  ChevronRight,
  X,
  Trash2,
  ExternalLink,
} from "lucide-react";
import CreateDialog from "@/pages/CreateDialogue";
import {
  deleteJob,
  getDownloadUrl,
  getJobCount,
  listCompletedJobs,
  streamInProgressJobs,
  type CompletedJob,
  type InProgressJob,
} from "@/lib/api";

type ProjectStatus = "Open" | "Done";

type Project = {
  id: string;
  jobId: number;
  name: string;
  edited: string;
  editedMs: number;
  status: ProjectStatus;
  objectKey?: string | null;
  percentageCompleted?: number;
};

type FilterKey = "none" | "name" | "date" | "status";
type SortDir   = "asc" | "desc";
type ViewMode  = "grid" | "list";

function completedJobToProject(job: CompletedJob): Project {
  return {
    id: `completed-${job.jobId}`,
    jobId: job.jobId,
    name: job.jobName || `Job #${job.jobId}`,
    edited: "Completed",
    editedMs: job.jobId,
    status: "Done",
    objectKey: job.stickmanifiedS3ObjectKey,
  };
}

function inProgressJobToProject(job: InProgressJob): Project {
  return {
    id: `in-progress-${job.jobId}`,
    jobId: job.jobId,
    name: job.jobName || `Job #${job.jobId}`,
    edited: `${job.percentageCompleted}% complete`,
    editedMs: job.jobId,
    status: "Open",
    percentageCompleted: job.percentageCompleted,
  };
}

export default function Projects() {
  const [search,         setSearch]         = useState("");
  const [filterKey,      setFilterKey]      = useState<FilterKey>("none");
  const [sortDir,        setSortDir]        = useState<SortDir>("asc");
  const [viewMode,       setViewMode]       = useState<ViewMode>("grid");
  const [completedJobs,  setCompletedJobs]  = useState<CompletedJob[]>([]);
  const [inProgressJobs, setInProgressJobs] = useState<InProgressJob[]>([]);
  const [jobCount,       setJobCount]       = useState<number | null>(null);
  const [jobsLoading,    setJobsLoading]    = useState(true);
  const [jobsError,      setJobsError]      = useState("");
  const [actionError,    setActionError]    = useState("");
  const [downloadingId,  setDownloadingId]  = useState<number | null>(null);
  const [deletingId,     setDeletingId]     = useState<number | null>(null);

  const loadJobs = useCallback(async () => {
    setJobsLoading(true);
    setJobsError("");

    try {
      const [completed, count] = await Promise.all([
        listCompletedJobs(),
        getJobCount(),
      ]);
      setCompletedJobs(completed);
      setJobCount(count);
    } catch (err) {
      setJobsError(err instanceof Error ? err.message : "Could not load jobs.");
    } finally {
      setJobsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    const controller = new AbortController();

    streamInProgressJobs(setInProgressJobs, controller.signal).catch(() => {
      if (!controller.signal.aborted) setInProgressJobs([]);
    });

    return () => controller.abort();
  }, []);

  const projects = useMemo(() => {
    let list = [
      ...inProgressJobs.map(inProgressJobToProject),
      ...completedJobs.map(completedJobToProject),
    ];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (filterKey === "name")   list.sort((a, b) => sortDir === "asc" ? a.name.localeCompare(b.name)       : b.name.localeCompare(a.name));
    if (filterKey === "date")   list.sort((a, b) => sortDir === "asc" ? b.editedMs - a.editedMs             : a.editedMs - b.editedMs);
    if (filterKey === "status") {
      const order = { Open: 0, Done: 1 };
      list.sort((a, b) => sortDir === "asc" ? order[a.status] - order[b.status] : order[b.status] - order[a.status]);
    }

    return list;
  }, [completedJobs, filterKey, inProgressJobs, search, sortDir]);

  function handleFilterPill(key: FilterKey) {
    if (filterKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setFilterKey(key); setSortDir("asc"); }
  }

  async function handleDownload(project: Project) {
    if (!project.objectKey) return;

    setActionError("");
    setDownloadingId(project.jobId);

    try {
      const url = await getDownloadUrl(project.objectKey);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not open the download.");
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDelete(project: Project) {
    setActionError("");
    setDeletingId(project.jobId);

    try {
      await deleteJob(project.jobId);
      setInProgressJobs((prev) => prev.filter((job) => job.jobId !== project.jobId));
      await loadJobs();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not delete the job.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30 pointer-events-none" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-full bg-white border-black/10 text-black placeholder:text-black/30 shadow-sm focus-visible:ring-black/20"
          />
          {search && (
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition"
              onClick={() => setSearch("")}>
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <span className="text-xs text-black/35 hidden sm:inline">Filter:</span>
        {(["name", "status", "date"] as FilterKey[]).map((key) => (
          <FilterPill
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            active={filterKey === key}
            dir={filterKey === key ? sortDir : undefined}
            onClick={() => handleFilterPill(key)}
          />
        ))}

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost"
            className="h-9 w-9 px-0 rounded-full text-black/40 hover:text-black hover:bg-black/6"
            title={`Sort ${sortDir === "asc" ? "descending" : "ascending"}`}
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}>
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost"
            className="h-9 w-9 px-0 rounded-full text-black/40 hover:text-black hover:bg-black/6"
            title={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
            onClick={() => setViewMode((v) => (v === "grid" ? "list" : "grid"))}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </Button>
          <CreateDialog triggerVariant="button" onJobCreated={loadJobs} />
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-black">Jobs</h2>
          <span className="text-xs text-black/35">
            {jobCount === null ? `${projects.length} visible` : `${jobCount} total`}
            {search && ` matching "${search}"`}
          </span>
        </div>

        {(jobsError || actionError) && (
          <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {actionError || jobsError}
          </p>
        )}

        {jobsLoading ? (
          <EmptyState message="Loading jobs..." />
        ) : projects.length === 0 ? (
          <EmptyState message={search ? `No jobs match "${search}"` : "No jobs yet"} />
        ) : viewMode === "grid" ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                downloading={downloadingId === p.jobId}
                deleting={deletingId === p.jobId}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {projects.map((p) => (
              <ProjectRow
                key={p.id}
                project={p}
                downloading={downloadingId === p.jobId}
                deleting={deletingId === p.jobId}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

function FilterPill({ label, active, dir, onClick }: { label: string; active: boolean; dir?: SortDir; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={cn(
        "h-9 rounded-full px-4 text-sm font-medium transition flex items-center gap-1.5 border",
        active
          ? "bg-black text-white border-black"
          : "bg-white text-black/55 border-black/10 hover:bg-black/5 hover:text-black"
      )}>
      {label}
      {active && dir && <span className="text-[10px] opacity-70">{dir === "asc" ? "up" : "down"}</span>}
    </button>
  );
}

function StatusBadge({ status, percentageCompleted }: { status: ProjectStatus; percentageCompleted?: number }) {
  const styles = {
    Open:  "border-black/25 text-black/65 bg-black/4",
    Done:  "border-black/20 text-black/70 bg-black/6",
  };
  const label = status === "Open" && percentageCompleted !== undefined
    ? `${percentageCompleted}%`
    : status;
  return <span className={cn("rounded-full border px-2.5 py-0.5 text-xs", styles[status])}>{label}</span>;
}

function ProjectCard({
  project,
  downloading,
  deleting,
  onDownload,
  onDelete,
}: {
  project: Project;
  downloading: boolean;
  deleting: boolean;
  onDownload: (project: Project) => void;
  onDelete: (project: Project) => void;
}) {
  return (
    <Card className="rounded-2xl border border-black/8 bg-white text-black shadow-sm hover:shadow-md hover:border-black/14 transition group">
      <div className="p-4 pb-2">
        <p className="text-sm font-semibold text-black/75 leading-snug">{project.name}</p>
      </div>
      <div className="px-4 pb-4 space-y-3">
        <div className="h-32 rounded-xl bg-black/3 border border-black/6 flex items-center justify-center">
          <StickmanIcon className="opacity-10 group-hover:opacity-20 transition" width={24} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-black/35">{project.edited}</span>
          <StatusBadge status={project.status} percentageCompleted={project.percentageCompleted} />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="h-8 flex-1 rounded-full bg-black/5 border border-black/8 px-3 text-black/60 hover:bg-black hover:text-white transition text-xs font-semibold"
            disabled={!project.objectKey || downloading}
            onClick={() => onDownload(project)}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {downloading ? "Opening" : "Open"}
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-8 px-0 rounded-full text-black/35 hover:text-red-500 hover:bg-red-50"
            disabled={deleting}
            onClick={() => onDelete(project)}
            aria-label={`Delete ${project.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ProjectRow({
  project,
  downloading,
  deleting,
  onDownload,
  onDelete,
}: {
  project: Project;
  downloading: boolean;
  deleting: boolean;
  onDownload: (project: Project) => void;
  onDelete: (project: Project) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white px-5 py-3 hover:shadow-sm hover:border-black/14 transition group">
      <div className="h-9 w-9 rounded-xl bg-black/4 border border-black/6 flex items-center justify-center shrink-0">
        <StickmanIcon className="opacity-15 group-hover:opacity-30 transition" width={14} strokeWidth={3.5} />
      </div>
      <span className="flex-1 text-sm text-black/75 font-medium">{project.name}</span>
      <span className="text-xs text-black/35 hidden sm:inline">{project.edited}</span>
      <StatusBadge status={project.status} percentageCompleted={project.percentageCompleted} />
      <Button
        variant="ghost"
        className="h-8 w-8 px-0 rounded-full text-black/35 hover:text-black hover:bg-black/6"
        disabled={!project.objectKey || downloading}
        onClick={() => onDownload(project)}
        aria-label={`Open ${project.name}`}
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        className="h-8 w-8 px-0 rounded-full text-black/35 hover:text-red-500 hover:bg-red-50"
        disabled={deleting}
        onClick={() => onDelete(project)}
        aria-label={`Delete ${project.name}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
      <ChevronRight className="h-4 w-4 text-black/20 group-hover:text-black/50 transition" />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-black/30">
      <StickmanIcon className="opacity-15 anim-sway" width={40} />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function StickmanIcon({
  width,
  className,
  strokeWidth = 2.5,
}: {
  width: number;
  className?: string;
  strokeWidth?: number;
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
