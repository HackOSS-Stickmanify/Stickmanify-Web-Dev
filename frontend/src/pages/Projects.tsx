import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Project = {
  id: string;
  name: string;
  edited: string;
  status: "Draft" | "Open" | "Done";
};

type Folder = {
  id: string;
  name: string;
  items: number;
  updated: string;
};

const mockProjects: Project[] = [
  { id: "1", name: "Untitled Design 1", edited: "Edited 2 days ago", status: "Draft" },
  { id: "2", name: "Untitled Design 2", edited: "Edited 2 days ago", status: "Draft" },
  { id: "3", name: "Untitled Design 3", edited: "Edited 2 days ago", status: "Draft" },
  { id: "4", name: "Untitled Design 4", edited: "Edited 2 days ago", status: "Draft" },
  { id: "5", name: "Untitled Design 5", edited: "Edited 5 days ago", status: "Draft" },
  { id: "6", name: "Untitled Design 6", edited: "Edited 1 week ago", status: "Draft" },
];

const mockFolders: Folder[] = [
  { id: "f1", name: "Friends", items: 12, updated: "Updated 3 days ago" },
  { id: "f2", name: "Family", items: 4, updated: "Updated 1 week ago" },
  { id: "f3", name: "Strangers", items: 7, updated: "Updated 2 weeks ago" },
  { id: "f4", name: "Hidden", items: 19, updated: "Updated 1 month ago" },
  { id: "f5", name: "Random", items: 6, updated: "Updated 2 days ago" },
  { id: "f6", name: "Archived", items: 23, updated: "Updated 3 months ago" },
];

export default function Projects() {
  return (
    <div className="space-y-10">
      {/* Top row: filters + create folder */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-white/60">Filter by: </span>
        <Pill>Name</Pill>
        <Pill>Category</Pill>
        <Pill>Date modified</Pill>

        <div className="ml-auto flex items-center gap-2">
          <Pill>Sort</Pill>
          <Pill>View</Pill>
          <Button className="h-10 rounded-full bg-blue-600 hover:bg-blue-700">
            + Create folder
          </Button>
        </div>
      </div>

      {/* Recents */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-white">Recents</h2>
          <span className="text-sm text-white/60">Edited recently</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* Folders */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-white">Folders</h2>
          <span className="text-sm text-white/60">Organize your work</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockFolders.map((f) => (
            <FolderCard key={f.id} folder={f} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <Button
      variant="secondary"
      className="h-10 rounded-full bg-white/10 text-white hover:bg-white/15"
    >
      {children}
    </Button>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="rounded-2xl border border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white/90">{project.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Preview placeholder */}
        <div className="h-40 rounded-2xl bg-white/10" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">{project.edited}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/70">
            {project.status}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function FolderCard({ folder }: { folder: Folder }) {
  return (
    <Card className="rounded-2xl border border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur">
      <CardContent className="flex items-center gap-4 py-5">
        {/* Folder icon placeholder */}
        <div className="h-12 w-12 rounded-2xl bg-white/10" />

        <div className="flex-1">
          <div className="text-sm font-semibold text-white/90">{folder.name}</div>
          <div className="mt-1 text-xs text-white/60">
            {folder.items} items • {folder.updated}
          </div>
        </div>

        <Button
          variant="secondary"
          className="h-9 rounded-full bg-white/10 px-4 text-white hover:bg-white/15"
        >
          Open
        </Button>
      </CardContent>
    </Card>
  );
}
