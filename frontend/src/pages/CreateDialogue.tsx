import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { Plus, Upload, Check, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

type Folder = { id: string; name: string };

const STEPS = [
  { title: "Your Prompt",   desc: "What should we create?"   },
  { title: "Upload Video",  desc: "Add your source footage"  },
  { title: "Organize",      desc: "Choose a folder"          },
  { title: "Final Touches", desc: "Notes & review"           },
];

export default function CreateDialog({
  folders = [],
  triggerVariant = "sidebar",
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  initialPrompt = "",
}: {
  folders?: Folder[];
  triggerVariant?: "sidebar" | "button" | "none";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialPrompt?: string;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen   = controlledOpen  !== undefined ? controlledOpen  : internalOpen;
  const setOpen  = setControlledOpen ?? setInternalOpen;

  const [step,     setStep]     = useState(0);
  const [name,     setName]     = useState(initialPrompt);
  const [folderId, setFolderId] = useState<string>("none");
  const [remarks,  setRemarks]  = useState("");
  const [file,     setFile]     = useState<File | null>(null);

  // Sync initialPrompt when dialog opens
  function handleOpenChange(v: boolean) {
    if (v) {
      setName(initialPrompt || "");
      setStep(0);
    }
    setOpen(v);
  }

  const fileLabel = useMemo(() => {
    if (!file) return "Choose a video file";
    return `${file.name}  (${Math.round(file.size / 1024 / 1024)} MB)`;
  }, [file]);

  function handleCreate() {
    console.log("CREATE:", { name, folderId, remarks, file });
    setName("");
    setFolderId("none");
    setRemarks("");
    setFile(null);
    setStep(0);
    setOpen(false);
  }

  function canNext() {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return file !== null;
    return true;
  }

  const trigger =
    triggerVariant === "none" ? null :
    triggerVariant === "sidebar" ? (
      <button
        className="group flex h-12 w-12 items-center justify-center rounded-2xl text-white/40 transition hover:bg-white/8 hover:text-white"
        title="Create"
        aria-label="Create"
        onClick={() => handleOpenChange(true)}
      >
        <Plus className="h-5 w-5 text-white/60 group-hover:text-white transition" />
      </button>
    ) : (
      <Button
        className="rounded-full bg-white text-black hover:bg-white/90 font-semibold"
        onClick={() => handleOpenChange(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create
      </Button>
    );

  return (
    <>
      {trigger}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTitle className="sr-only">Start a creation</DialogTitle>
        <DialogContent
          className="p-0 gap-0 max-w-2xl border border-white/10 bg-black text-white shadow-2xl overflow-hidden"
          showCloseButton={false}
        >
          <div className="flex min-h-110">

            {/* ── Left: step progress panel ──────────────────── */}
            <div className="w-52 shrink-0 border-r border-white/10 bg-white/3 flex flex-col p-5 gap-1">
              {/* Logo mark */}
              <div className="flex items-center gap-2 mb-5">
                <svg viewBox="0 0 28 48" width="14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="opacity-60">
                  <circle cx="14" cy="6" r="5" />
                  <line x1="14" y1="11" x2="14" y2="30" />
                  <line x1="14" y1="17" x2="4"  y2="10" />
                  <line x1="14" y1="17" x2="24" y2="24" />
                  <line x1="14" y1="30" x2="5"  y2="44" />
                  <line x1="14" y1="30" x2="23" y2="44" />
                </svg>
                <span className="text-xs font-bold text-white/50 tracking-wider uppercase">New creation</span>
              </div>

              {STEPS.map((s, i) => {
                const done    = i < step;
                const active  = i === step;
                const upcoming = i > step;
                return (
                  <div key={i} className="flex items-start gap-3 py-2.5">
                    {/* Step indicator dot */}
                    <div
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold border transition-all",
                        done    && "bg-white border-white text-black",
                        active  && "bg-white border-white text-black ring-2 ring-white/20",
                        upcoming && "border-white/20 text-white/30 bg-transparent"
                      )}
                    >
                      {done ? <Check className="h-3 w-3" /> : i + 1}
                    </div>

                    {/* Step label */}
                    <div className={cn("leading-tight", upcoming && "opacity-35")}>
                      <div className={cn(
                        "text-xs font-semibold",
                        active ? "text-white" : "text-white/60"
                      )}>
                        {s.title}
                      </div>
                      <div className="text-[11px] text-white/35 mt-0.5">{s.desc}</div>
                    </div>
                  </div>
                );
              })}

              {/* Steps remaining indicator */}
              <div className="mt-auto pt-4 border-t border-white/8">
                <p className="text-[10px] text-white/25 uppercase tracking-wider">
                  Step {step + 1} of {STEPS.length}
                </p>
                {/* Progress bar */}
                <div className="mt-1.5 h-0.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ── Right: form area ────────────────────────────── */}
            <div className="flex flex-1 flex-col p-6 gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">{STEPS[step].title}</h2>
                <p className="text-sm text-white/45 mt-0.5">{STEPS[step].desc}</p>
              </div>

              <div className="flex-1">
                {/* Step 0: Prompt / name */}
                {step === 0 && (
                  <div className="space-y-3">
                    <Label htmlFor="creation-name" className="text-xs text-white/50">
                      Name or description of your creation
                    </Label>
                    <Input
                      id="creation-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dance Clip v1 / Street performer doing backflips"
                      className="h-11 bg-white/6 text-white placeholder:text-white/25 border-white/10 focus-visible:ring-white/20"
                      autoFocus
                    />
                    <p className="text-xs text-white/30 flex items-center gap-1.5 mt-1">
                      <Sparkles className="h-3 w-3" />
                      Be descriptive — this helps our AI match the right style.
                    </p>
                  </div>
                )}

                {/* Step 1: Upload */}
                {step === 1 && (
                  <div className="space-y-3">
                    <Label className="text-xs text-white/50">Video file</Label>
                    <label className="flex flex-col items-center justify-center gap-3 cursor-pointer rounded-2xl border border-dashed border-white/15 bg-white/4 px-4 py-10 text-sm text-white/50 hover:bg-white/7 hover:border-white/25 transition">
                      <Upload className="h-8 w-8 text-white/30" />
                      <span className="text-center">
                        {file ? fileLabel : "Click to choose a video file"}
                      </span>
                      {!file && (
                        <span className="text-xs text-white/25">mp4, mov, webm accepted</span>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      />
                    </label>
                    {file && (
                      <Button
                        variant="secondary"
                        className="h-9 rounded-full bg-white/8 border border-white/10 text-white/60 hover:bg-white/12 text-xs"
                        onClick={() => setFile(null)}
                      >
                        Remove file
                      </Button>
                    )}
                  </div>
                )}

                {/* Step 2: Folder */}
                {step === 2 && (
                  <div className="space-y-3">
                    <Label className="text-xs text-white/50">Which folder? (optional)</Label>
                    <Select value={folderId} onValueChange={setFolderId}>
                      <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-white/6 text-white focus:ring-white/20">
                        <SelectValue placeholder="Select a folder" />
                      </SelectTrigger>
                      <SelectContent className="border-white/10 bg-black text-white">
                        <SelectItem value="none">No folder</SelectItem>
                        {folders.map((f) => (
                          <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Step 3: Remarks + review */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="creation-remarks" className="text-xs text-white/50">
                        Additional remarks (optional)
                      </Label>
                      <Textarea
                        id="creation-remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Timing notes, music vibe, style hints..."
                        className="min-h-22 resize-none rounded-2xl border-white/10 bg-white/6 text-white placeholder:text-white/25 focus-visible:ring-white/20"
                      />
                    </div>

                    {/* Summary card */}
                    <div className="rounded-2xl border border-white/10 bg-white/4 p-4 space-y-1.5 text-sm">
                      <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">Summary</p>
                      <Row label="Name"   value={name || "—"} />
                      <Row label="Video"  value={file ? file.name : "—"} />
                      <Row label="Folder" value={folders.find(f => f.id === folderId)?.name ?? "None"} />
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/8">
                {step > 0 ? (
                  <Button
                    variant="ghost"
                    className="h-10 px-4 rounded-full text-white/50 hover:text-white hover:bg-white/8 gap-2"
                    onClick={() => setStep((s) => s - 1)}
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="h-10 px-4 rounded-full text-white/40 hover:text-white hover:bg-white/8"
                    onClick={() => handleOpenChange(false)}
                  >
                    Cancel
                  </Button>
                )}

                <div className="flex-1" />

                {step < STEPS.length - 1 ? (
                  <Button
                    className="h-10 px-6 rounded-full bg-white text-black font-semibold hover:bg-white/90 gap-2 disabled:opacity-30"
                    disabled={!canNext()}
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    className="h-10 px-6 rounded-full bg-white text-black font-semibold hover:bg-white/90"
                    onClick={handleCreate}
                  >
                    Create
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/35 w-14 shrink-0">{label}</span>
      <span className="text-white/70 truncate">{value}</span>
    </div>
  );
}
