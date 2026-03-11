import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Folder } from "lucide-react";
import CreateDialog from "@/pages/CreateDialogue";

const FOLDERS = [
  { id: "friends",   name: "Friends"   },
  { id: "family",    name: "Family"    },
  { id: "strangers", name: "Strangers" },
];

export default function Home() {
  const [prompt, setPrompt]         = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-10">

      {/* ── Hero title with stickman ─────────────────────────── */}
      <div className="relative flex items-start gap-6">
        <div className="flex-1 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            What would you Stickmanify today?
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Type a prompt or upload a video — we'll turn it into a stickman animation.
          </p>
        </div>

        {/* Decorative stickman, waving */}
        <div className="hidden lg:flex absolute -right-4 top-0 anim-bounce opacity-20 pointer-events-none">
          <svg viewBox="0 0 44 80" width="40" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
            <circle cx="22" cy="8"  r="7"  />
            <line x1="22" y1="15" x2="22" y2="46" />
            {/* waving arm */}
            <line x1="22" y1="24" x2="6"  y2="15" className="anim-wave" />
            <line x1="22" y1="24" x2="38" y2="30" />
            <line x1="22" y1="46" x2="8"  y2="70" />
            <line x1="22" y1="46" x2="36" y2="70" />
          </svg>
        </div>
      </div>

      {/* ── Search / prompt bar ──────────────────────────────── */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/4 px-3 py-2">
            <Input
              placeholder="Enter a prompt / Upload a video"
              className="h-11 flex-1 border-0 bg-transparent text-white placeholder:text-white/30 focus-visible:ring-0"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") setDialogOpen(true); }}
            />
            <Button
              className="h-10 rounded-full bg-white text-black font-bold px-6 hover:bg-white/90 transition"
              onClick={() => setDialogOpen(true)}
            >
              GO!
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden create dialog — triggered by GO button */}
      <CreateDialog
        folders={FOLDERS}
        triggerVariant="none"
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialPrompt={prompt}
      />

      {/* ── Recents ──────────────────────────────────────────── */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold">Recents</h2>
          <span className="text-xs text-white/40">Sorted by last edited</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="rounded-2xl border border-white/10 bg-white/4 text-white shadow-xl cursor-pointer hover:bg-white/7 transition group"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white/80">
                  Untitled Design {i + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Preview placeholder with inline stickman */}
                <div className="h-28 rounded-xl bg-white/6 border border-white/8 flex items-center justify-center overflow-hidden">
                  <svg
                    viewBox="0 0 44 80"
                    width="28"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-20 group-hover:opacity-35 transition"
                  >
                    <circle cx="22" cy="8"  r="7"  />
                    <line x1="22" y1="15" x2="22" y2="46" />
                    <line x1="22" y1="24" x2="6"  y2="18" />
                    <line x1="22" y1="24" x2="38" y2="30" />
                    <line x1="22" y1="46" x2="8"  y2="70" />
                    <line x1="22" y1="46" x2="36" y2="70" />
                  </svg>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Edited 2 days ago</span>
                  <span className="text-xs rounded-full border border-white/15 px-2 py-0.5 text-white/50">
                    Draft
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Folders ──────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Folders</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FolderCard title="Friends"   subtitle="12 items" />
          <FolderCard title="Family"    subtitle="4 items"  />
          <FolderCard title="Strangers" subtitle="7 items"  />
        </div>
      </section>
    </div>
  );
}

function FolderCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Card className="rounded-2xl border border-white/10 bg-white/4 text-white shadow-xl hover:bg-white/7 transition cursor-pointer">
      <CardContent className="flex items-center gap-3 py-5">
        <div className="h-10 w-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center">
          <Folder className="h-5 w-5 text-white/50" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white/80">{title}</div>
          <div className="text-xs text-white/40">{subtitle}</div>
        </div>
        <Button
          variant="secondary"
          className="h-8 rounded-full bg-white/8 border border-white/10 px-4 text-white/70 hover:bg-white hover:text-black transition text-xs"
        >
          Open
        </Button>
      </CardContent>
    </Card>
  );
}
