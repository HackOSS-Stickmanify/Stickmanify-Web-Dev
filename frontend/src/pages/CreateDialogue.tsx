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
  const isOpen  = controlledOpen  !== undefined ? controlledOpen  : internalOpen;
  const setOpen = setControlledOpen ?? setInternalOpen;

  const [step,     setStep]     = useState(0);
  const [name,     setName]     = useState(initialPrompt);
  const [folderId, setFolderId] = useState<string>("none");
  const [remarks,  setRemarks]  = useState("");
  const [file,     setFile]     = useState<File | null>(null);

  function handleOpenChange(v: boolean) {
    if (v) { setName(initialPrompt || ""); setStep(0); }
    setOpen(v);
  }

  const fileLabel = useMemo(() => {
    if (!file) return "Choose a video file";
    return `${file.name}  (${Math.round(file.size / 1024 / 1024)} MB)`;
  }, [file]);

  function handleCreate() {
    console.log("CREATE:", { name, folderId, remarks, file });
    setName(""); setFolderId("none"); setRemarks(""); setFile(null); setStep(0);
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
        className="group flex h-12 w-12 items-center justify-center rounded-2xl text-black/35 transition hover:bg-black/6 hover:text-black"
        title="Create" aria-label="Create"
        onClick={() => handleOpenChange(true)}
      >
        <Plus className="h-5 w-5 text-black/50 group-hover:text-black transition" />
      </button>
    ) : (
      <Button
        className="rounded-full bg-black text-white hover:bg-black/85 font-semibold"
        onClick={() => handleOpenChange(true)}
      >
        <Plus className="mr-2 h-4 w-4" /> Create
      </Button>
    );

  return (
    <>
      {trigger}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTitle className="sr-only">Start a creation</DialogTitle>
        <DialogContent
          className="p-0 gap-0 max-w-2xl border border-black/10 bg-white text-black shadow-xl overflow-hidden"
          showCloseButton={false}
        >
          <div className="flex min-h-110">

            {/* ── Left: step progress panel ──────────────────── */}
            <div className="w-52 shrink-0 border-r border-black/8 bg-black/2 flex flex-col p-5 gap-1">
              {/* Logo mark */}
              <div className="flex items-center gap-2 mb-5">
                <svg viewBox="0 0 28 48" width="14" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" className="opacity-50">
                  <circle cx="14" cy="6" r="5"/>
                  <line x1="14" y1="11" x2="14" y2="30"/>
                  <line x1="14" y1="17" x2="4"  y2="10"/>
                  <line x1="14" y1="17" x2="24" y2="24"/>
                  <line x1="14" y1="30" x2="5"  y2="44"/>
                  <line x1="14" y1="30" x2="23" y2="44"/>
                </svg>
                <span className="text-xs font-bold text-black/40 tracking-wider uppercase">New creation</span>
              </div>

              {STEPS.map((s, i) => {
                const done    = i < step;
                const active  = i === step;
                const upcoming = i > step;
                return (
                  <div key={i} className="flex items-start gap-3 py-2.5">
                    <div className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold border transition-all",
                      done    && "bg-black border-black text-white",
                      active  && "bg-black border-black text-white ring-2 ring-black/15",
                      upcoming && "border-black/20 text-black/30 bg-transparent"
                    )}>
                      {done ? <Check className="h-3 w-3" /> : i + 1}
                    </div>
                    <div className={cn("leading-tight", upcoming && "opacity-35")}>
                      <div className={cn("text-xs font-semibold", active ? "text-black" : "text-black/55")}>
                        {s.title}
                      </div>
                      <div className="text-[11px] text-black/35 mt-0.5">{s.desc}</div>
                    </div>
                  </div>
                );
              })}

              {/* Progress bar */}
              <div className="mt-auto pt-4 border-t border-black/8">
                <p className="text-[10px] text-black/25 uppercase tracking-wider">
                  Step {step + 1} of {STEPS.length}
                </p>
                <div className="mt-1.5 h-0.5 rounded-full bg-black/10 overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-300"
                    style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ── Right: form area ────────────────────────────── */}
            <div className="flex flex-1 flex-col p-6 gap-4">
              <div>
                <h2 className="text-lg font-bold text-black">{STEPS[step].title}</h2>
                <p className="text-sm text-black/40 mt-0.5">{STEPS[step].desc}</p>
              </div>

              <div className="flex-1">
                {/* Step 0: Prompt */}
                {step === 0 && (
                  <div className="space-y-3">
                    <Label htmlFor="creation-name" className="text-xs text-black/50">
                      Name or description of your creation
                    </Label>
                    <Input
                      id="creation-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dance Clip v1 / Street performer doing backflips"
                      className="h-11 bg-white border-black/10 text-black placeholder:text-black/25 focus-visible:ring-black/20"
                      autoFocus
                    />
                    <p className="text-xs text-black/30 flex items-center gap-1.5 mt-1">
                      <Sparkles className="h-3 w-3" />
                      Be descriptive — this helps our AI match the right style.
                    </p>
                  </div>
                )}

                {/* Step 1: Upload */}
                {step === 1 && (
                  <div className="space-y-3">
                    <Label className="text-xs text-black/50">Video file</Label>
                    <label className="flex flex-col items-center justify-center gap-3 cursor-pointer rounded-2xl border border-dashed border-black/15 bg-black/2 px-4 py-10 text-sm text-black/45 hover:bg-black/4 hover:border-black/25 transition">
                      <Upload className="h-8 w-8 text-black/25" />
                      <span className="text-center">
                        {file ? fileLabel : "Click to choose a video file"}
                      </span>
                      {!file && <span className="text-xs text-black/25">mp4, mov, webm accepted</span>}
                      <input type="file" accept="video/*" className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                    </label>
                    {file && (
                      <Button variant="secondary"
                        className="h-9 rounded-full bg-black/5 border border-black/10 text-black/55 hover:bg-black/10 text-xs"
                        onClick={() => setFile(null)}>
                        Remove file
                      </Button>
                    )}
                  </div>
                )}

                {/* Step 2: Folder */}
                {step === 2 && (
                  <div className="space-y-3">
                    <Label className="text-xs text-black/50">Which folder? (optional)</Label>
                    <Select value={folderId} onValueChange={setFolderId}>
                      <SelectTrigger className="h-11 rounded-2xl border-black/10 bg-white text-black focus:ring-black/20">
                        <SelectValue placeholder="Select a folder" />
                      </SelectTrigger>
                      <SelectContent className="border-black/10 bg-white text-black shadow-xl">
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
                      <Label htmlFor="creation-remarks" className="text-xs text-black/50">
                        Additional remarks (optional)
                      </Label>
                      <Textarea
                        id="creation-remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Timing notes, music vibe, style hints..."
                        className="min-h-22 resize-none rounded-2xl border-black/10 bg-white text-black placeholder:text-black/25 focus-visible:ring-black/20"
                      />
                    </div>
                    {/* Summary */}
                    <div className="rounded-2xl border border-black/8 bg-black/2 p-4 space-y-1.5 text-sm">
                      <p className="text-xs text-black/40 uppercase tracking-wider font-semibold mb-2">Summary</p>
                      <Row label="Name"   value={name || "—"} />
                      <Row label="Video"  value={file ? file.name : "—"} />
                      <Row label="Folder" value={folders.find(f => f.id === folderId)?.name ?? "None"} />
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3 pt-2 border-t border-black/8">
                {step > 0 ? (
                  <Button variant="ghost"
                    className="h-10 px-4 rounded-full text-black/45 hover:text-black hover:bg-black/6 gap-2"
                    onClick={() => setStep((s) => s - 1)}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                ) : (
                  <Button variant="ghost"
                    className="h-10 px-4 rounded-full text-black/40 hover:text-black hover:bg-black/6"
                    onClick={() => handleOpenChange(false)}>
                    Cancel
                  </Button>
                )}
                <div className="flex-1" />
                {step < STEPS.length - 1 ? (
                  <Button
                    className="h-10 px-6 rounded-full bg-black text-white font-semibold hover:bg-black/85 gap-2 disabled:opacity-30"
                    disabled={!canNext()}
                    onClick={() => setStep((s) => s + 1)}>
                    Next <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    className="h-10 px-6 rounded-full bg-black text-white font-semibold hover:bg-black/85"
                    onClick={handleCreate}>
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
      <span className="text-black/35 w-14 shrink-0">{label}</span>
      <span className="text-black/65 truncate">{value}</span>
    </div>
  );
}
