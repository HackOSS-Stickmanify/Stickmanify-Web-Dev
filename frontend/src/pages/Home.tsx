import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">What would you Stickmanify today?</h1>
      </div>

      {/* Search */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 shadow-2xl backdrop-blur">
            <Input
                placeholder="Enter a prompt / Upload a video"
                className="h-11 flex-1 border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0"
            />
            <Pill>GO!</Pill>
            </div>
        </div>
      </div>

      {/* Recents */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold">Recents</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/90">
                  Untitled Design {i + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-28 rounded-xl bg-white/10" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Edited 2 days ago</span>
                  <span className="text-xs rounded-full bg-white/10 px-2 py-1 text-white/70">
                    Draft
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Folders */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Folders</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FolderCard title="Friends" subtitle="12 items" />
          <FolderCard title="Family" subtitle="4 items" />
          <FolderCard title="Strangers" subtitle="7 items" />
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

function FolderCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Card className="rounded-2xl border border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur">
      <CardContent className="flex items-center gap-3 py-5">
        <div className="h-10 w-10 rounded-xl bg-white/10" />
        <div className="flex-1">
          <div className="text-sm font-semibold text-white/90">{title}</div>
          <div className="text-xs text-white/60">{subtitle}</div>
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
