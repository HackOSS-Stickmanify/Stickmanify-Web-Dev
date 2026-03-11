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

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative text-center pt-2">
        {/* decorative stickman — left */}
        <div className="pointer-events-none absolute -left-2 top-0 opacity-[0.09] anim-sway hidden lg:block">
          <svg viewBox="0 0 44 80" width="52" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="22" cy="8" r="7"/>
            <line x1="22" y1="15" x2="22" y2="46"/>
            <line x1="22" y1="24" x2="6"  y2="14"/>
            <line x1="22" y1="24" x2="38" y2="30"/>
            <line x1="22" y1="46" x2="8"  y2="70"/>
            <line x1="22" y1="46" x2="36" y2="70"/>
          </svg>
        </div>
        {/* decorative stickman — right */}
        <div className="pointer-events-none absolute -right-2 top-0 opacity-[0.07] anim-bounce hidden lg:block">
          <svg viewBox="0 0 44 80" width="52" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="22" cy="8" r="7"/>
            <line x1="22" y1="15" x2="22" y2="46"/>
            <line x1="22" y1="24" x2="6"  y2="12"/>
            <line x1="22" y1="24" x2="38" y2="30"/>
            <line x1="22" y1="46" x2="8"  y2="70"/>
            <line x1="22" y1="46" x2="36" y2="70"/>
          </svg>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-black">
          What would you Stickmanify today?
        </h1>
        <p className="mt-2 text-sm text-black/40">
          Type a prompt or upload a video — we'll turn it into a stickman animation.
        </p>
      </div>

      {/* ── Search / prompt bar ──────────────────────────────── */}
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

      {/* Hidden dialog triggered by GO */}
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
          <h2 className="text-xl font-semibold text-black">Recents</h2>
          <span className="text-xs text-black/35">Sorted by last edited</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="rounded-2xl border border-black/8 bg-white text-black shadow-sm cursor-pointer hover:shadow-md hover:border-black/14 transition group"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-black/75">
                  Untitled Design {i + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Preview with stickman */}
                <div className="h-28 rounded-xl bg-black/3 border border-black/6 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 44 80" width="28" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"
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
                  <span className="text-xs text-black/35">Edited 2 days ago</span>
                  <span className="text-xs rounded-full border border-black/12 px-2 py-0.5 text-black/45">
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
        <h2 className="text-xl font-semibold text-black">Folders</h2>

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
    <Card className="rounded-2xl border border-black/8 bg-white text-black shadow-sm hover:shadow-md hover:border-black/14 transition cursor-pointer">
      <CardContent className="flex items-center gap-3 py-5">
        <div className="h-10 w-10 rounded-xl bg-black/5 border border-black/8 flex items-center justify-center">
          <Folder className="h-5 w-5 text-black/40" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-black/75">{title}</div>
          <div className="text-xs text-black/35">{subtitle}</div>
        </div>
        <Button
          variant="secondary"
          className="h-8 rounded-full bg-black/5 border border-black/8 px-4 text-black/60 hover:bg-black hover:text-white transition text-xs font-semibold"
        >
          Open
        </Button>
      </CardContent>
    </Card>
  );
}
