import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Search,
  FolderPlus,
  Folder,
  LayoutGrid,
  List,
  ArrowUpDown,
  ChevronRight,
  X,
} from "lucide-react";
import CreateDialog from "@/pages/CreateDialogue";

type Project = {
  id: string;
  name: string;
  edited: string;
  editedMs: number;
  status: "Draft" | "Open" | "Done";
};

type FolderItem = {
  id: string;
  name: string;
  items: number;
  updated: string;
};

const INITIAL_PROJECTS: Project[] = [
  { id: "1", name: "Untitled Design 1", edited: "2 days ago", editedMs: Date.now() - 2*86400000, status: "Draft" },
  { id: "2", name: "Untitled Design 2", edited: "2 days ago", editedMs: Date.now() - 2*86400000, status: "Draft" },
  { id: "3", name: "Dance Clip v2",     edited: "3 days ago", editedMs: Date.now() - 3*86400000, status: "Open"  },
  { id: "4", name: "Street Performer",  edited: "4 days ago", editedMs: Date.now() - 4*86400000, status: "Done"  },
  { id: "5", name: "Untitled Design 5", edited: "5 days ago", editedMs: Date.now() - 5*86400000, status: "Draft" },
  { id: "6", name: "Birthday Surprise", edited: "1 week ago", editedMs: Date.now() - 7*86400000, status: "Draft" },
];

const INITIAL_FOLDERS: FolderItem[] = [
  { id: "f1", name: "Friends",   items: 12, updated: "3 days ago"   },
  { id: "f2", name: "Family",    items: 4,  updated: "1 week ago"   },
  { id: "f3", name: "Strangers", items: 7,  updated: "2 weeks ago"  },
  { id: "f4", name: "Hidden",    items: 19, updated: "1 month ago"  },
  { id: "f5", name: "Random",    items: 6,  updated: "2 days ago"   },
  { id: "f6", name: "Archived",  items: 23, updated: "3 months ago" },
];

type FilterKey = "none" | "name" | "date" | "status";
type SortDir   = "asc" | "desc";
type ViewMode  = "grid" | "list";

const CREATE_FOLDERS = [
  { id: "friends",   name: "Friends"   },
  { id: "family",    name: "Family"    },
  { id: "strangers", name: "Strangers" },
];

export default function Projects() {
  const [search,         setSearch]         = useState("");
  const [filterKey,      setFilterKey]      = useState<FilterKey>("none");
  const [sortDir,        setSortDir]        = useState<SortDir>("asc");
  const [viewMode,       setViewMode]       = useState<ViewMode>("grid");
  const [folders,        setFolders]        = useState<FolderItem[]>(INITIAL_FOLDERS);
  const [folderDlgOpen,  setFolderDlgOpen]  = useState(false);
  const [newFolderName,  setNewFolderName]  = useState("");
  const [viewFolderOpen, setViewFolderOpen] = useState(false);
  const [viewFolder,     setViewFolder]     = useState<FolderItem | null>(null);

  const projects = useMemo(() => {
    let list = [...INITIAL_PROJECTS];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (filterKey === "name")   list.sort((a, b) => sortDir === "asc" ? a.name.localeCompare(b.name)       : b.name.localeCompare(a.name));
    if (filterKey === "date")   list.sort((a, b) => sortDir === "asc" ? b.editedMs - a.editedMs             : a.editedMs - b.editedMs);
    if (filterKey === "status") {
      const order = { Open: 0, Draft: 1, Done: 2 };
      list.sort((a, b) => sortDir === "asc" ? order[a.status] - order[b.status] : order[b.status] - order[a.status]);
    }
    return list;
  }, [search, filterKey, sortDir]);

  function handleFilterPill(key: FilterKey) {
    if (filterKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setFilterKey(key); setSortDir("asc"); }
  }

  function handleCreateFolder() {
    if (!newFolderName.trim()) return;
    setFolders((prev) => [{ id: `c-${Date.now()}`, name: newFolderName.trim(), items: 0, updated: "Just now" }, ...prev]);
    setNewFolderName("");
    setFolderDlgOpen(false);
  }

  function handleOpenFolder(f: FolderItem) {
    setViewFolder(f);
    setViewFolderOpen(true);
  }

  return (
    <div className="space-y-8">

      {/* ── Top controls ─────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30 pointer-events-none" />
          <Input
            placeholder="Search projects…"
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
          <Button
            className="h-9 rounded-full bg-black text-white font-semibold px-4 hover:bg-black/85 text-sm gap-2"
            onClick={() => setFolderDlgOpen(true)}>
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Create folder</span>
          </Button>
          <CreateDialog folders={CREATE_FOLDERS} triggerVariant="button" />
        </div>
      </div>

      {/* ── Recents ──────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-black">Recents</h2>
          <span className="text-xs text-black/35">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
            {search && ` matching "${search}"`}
          </span>
        </div>

        {projects.length === 0 ? (
          <EmptyState message={`No projects match "${search}"`} />
        ) : viewMode === "grid" ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {projects.map((p) => <ProjectRow key={p.id} project={p} />)}
          </div>
        )}
      </section>

      {/* ── Folders ──────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-black">Folders</h2>
          <span className="text-xs text-black/35">{folders.length} folders</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((f) => <FolderCard key={f.id} folder={f} onOpen={handleOpenFolder} />)}
        </div>
      </section>

      {/* ── Create folder dialog ─────────────────────────────── */}
      <Dialog open={folderDlgOpen} onOpenChange={setFolderDlgOpen}>
        <DialogContent className="sm:max-w-sm border border-black/8 bg-white text-black shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-black">Create a folder</DialogTitle>
            <DialogDescription className="text-black/45">Organise your projects into folders.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-1">
            <Label htmlFor="folder-name" className="text-xs text-black/50">Folder name</Label>
            <Input
              id="folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreateFolder(); }}
              placeholder="e.g. Friends"
              className="h-11 bg-white border-black/10 text-black placeholder:text-black/25 focus-visible:ring-black/20"
              autoFocus
            />
          </div>
          <DialogFooter className="mt-2 gap-2">
            <Button variant="ghost" className="rounded-full text-black/50 hover:text-black hover:bg-black/6"
              onClick={() => { setFolderDlgOpen(false); setNewFolderName(""); }}>
              Cancel
            </Button>
            <Button className="rounded-full bg-black text-white font-semibold hover:bg-black/85 disabled:opacity-30"
              disabled={!newFolderName.trim()} onClick={handleCreateFolder}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Folder view dialog ───────────────────────────────── */}
      <Dialog open={viewFolderOpen} onOpenChange={setViewFolderOpen}>
        <DialogContent className="sm:max-w-md border border-black/8 bg-white text-black shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-black flex items-center gap-2">
              <Folder className="h-5 w-5 text-black/40" />
              {viewFolder?.name}
            </DialogTitle>
            <DialogDescription className="text-black/45">
              {viewFolder?.items} item{viewFolder?.items !== 1 ? "s" : ""} · Updated {viewFolder?.updated}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <svg viewBox="0 0 44 80" width="36" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round"
              className="opacity-12 anim-sway">
              <circle cx="22" cy="8" r="7"/>
              <line x1="22" y1="15" x2="22" y2="46"/>
              <line x1="22" y1="24" x2="6"  y2="18"/>
              <line x1="22" y1="24" x2="38" y2="30"/>
              <line x1="22" y1="46" x2="8"  y2="70"/>
              <line x1="22" y1="46" x2="36" y2="70"/>
            </svg>
            <p className="text-sm text-black/30">Folder contents coming soon</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-full text-black/50 hover:text-black hover:bg-black/6"
              onClick={() => setViewFolderOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

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
      {active && dir && <span className="text-[10px] opacity-70">{dir === "asc" ? "↑" : "↓"}</span>}
    </button>
  );
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const styles = {
    Draft: "border-black/12 text-black/40",
    Open:  "border-black/25 text-black/65 bg-black/4",
    Done:  "border-black/20 text-black/70 bg-black/6",
  };
  return <span className={cn("rounded-full border px-2.5 py-0.5 text-xs", styles[status])}>{status}</span>;
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="rounded-2xl border border-black/8 bg-white text-black shadow-sm cursor-pointer hover:shadow-md hover:border-black/14 transition group">
      <div className="p-4 pb-2">
        <p className="text-sm font-semibold text-black/75 leading-snug">{project.name}</p>
      </div>
      <div className="px-4 pb-4 space-y-3">
        <div className="h-32 rounded-xl bg-black/3 border border-black/6 flex items-center justify-center">
          <svg viewBox="0 0 44 80" width="24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"
            className="opacity-10 group-hover:opacity-20 transition">
            <circle cx="22" cy="8" r="7"/>
            <line x1="22" y1="15" x2="22" y2="46"/>
            <line x1="22" y1="24" x2="6"  y2="18"/>
            <line x1="22" y1="24" x2="38" y2="30"/>
            <line x1="22" y1="46" x2="8"  y2="70"/>
            <line x1="22" y1="46" x2="36" y2="70"/>
          </svg>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-black/35">{project.edited}</span>
          <StatusBadge status={project.status} />
        </div>
      </div>
    </Card>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white px-5 py-3 hover:shadow-sm hover:border-black/14 transition cursor-pointer group">
      <div className="h-9 w-9 rounded-xl bg-black/4 border border-black/6 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 44 80" width="14" fill="none" stroke="black" strokeWidth="3.5" strokeLinecap="round"
          className="opacity-15 group-hover:opacity-30 transition">
          <circle cx="22" cy="8" r="7"/>
          <line x1="22" y1="15" x2="22" y2="46"/>
          <line x1="22" y1="24" x2="6"  y2="18"/>
          <line x1="22" y1="24" x2="38" y2="30"/>
          <line x1="22" y1="46" x2="8"  y2="70"/>
          <line x1="22" y1="46" x2="36" y2="70"/>
        </svg>
      </div>
      <span className="flex-1 text-sm text-black/75 font-medium">{project.name}</span>
      <span className="text-xs text-black/35 hidden sm:inline">{project.edited}</span>
      <StatusBadge status={project.status} />
      <ChevronRight className="h-4 w-4 text-black/20 group-hover:text-black/50 transition" />
    </div>
  );
}

function FolderCard({ folder, onOpen }: { folder: FolderItem; onOpen: (f: FolderItem) => void }) {
  return (
    <Card className="rounded-2xl border border-black/8 bg-white text-black shadow-sm hover:shadow-md hover:border-black/14 transition cursor-pointer group">
      <CardContent className="flex items-center gap-4 py-5">
        <div className="h-11 w-11 rounded-2xl bg-black/4 border border-black/8 flex items-center justify-center shrink-0">
          <Folder className="h-5 w-5 text-black/35 group-hover:text-black/60 transition" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-black/75 truncate">{folder.name}</div>
          <div className="mt-0.5 text-xs text-black/35">
            {folder.items} item{folder.items !== 1 ? "s" : ""} · {folder.updated}
          </div>
        </div>
        <Button
          variant="secondary"
          className="h-8 rounded-full bg-black/5 border border-black/8 px-4 text-black/60 hover:bg-black hover:text-white transition text-xs font-semibold shrink-0"
          onClick={(e) => { e.stopPropagation(); onOpen(folder); }}
        >
          Open
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-black/30">
      <svg viewBox="0 0 44 80" width="40" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round"
        className="opacity-15 anim-sway">
        <circle cx="22" cy="8" r="7"/>
        <line x1="22" y1="15" x2="22" y2="46"/>
        <line x1="22" y1="24" x2="6"  y2="18"/>
        <line x1="22" y1="24" x2="38" y2="30"/>
        <line x1="22" y1="46" x2="8"  y2="70"/>
        <line x1="22" y1="46" x2="36" y2="70"/>
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  );
}
