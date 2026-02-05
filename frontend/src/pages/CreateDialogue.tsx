import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Upload } from "lucide-react";

type Folder = { id: string; name: string };

export default function CreateDialog({
  folders = [],
  triggerVariant = "sidebar",
}: {
  folders?: Folder[];
  triggerVariant?: "sidebar" | "button";
}) {
  const [name, setName] = useState("");
  const [folderId, setFolderId] = useState<string>("none");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fileLabel = useMemo(() => {
    if (!file) return "Choose a video file";
    return `${file.name} (${Math.round(file.size / 1024 / 1024)} MB)`;
  }, [file]);

  function handleCreate() {
    // TODO: replace with backend call later
    console.log("CREATE:", { name, folderId, remarks, file });

    // basic reset after create
    setName("");
    setFolderId("none");
    setRemarks("");
    setFile(null);
  }

  return (
    <Dialog>
      {/* Trigger */}
      <DialogTrigger asChild>
        {triggerVariant === "sidebar" ? (
          <button
            className="group flex h-12 w-12 items-center justify-center rounded-2xl text-white/70 transition hover:bg-white/10 hover:text-white"
            title="Create"
            aria-label="Create"
          >
            <Plus className="h-5 w-5 text-white/80 group-hover:text-white" />
          </button>
        ) : (
          <Button className="rounded-full bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        )}
      </DialogTrigger>

      {/* Content */}
      <DialogContent
        className="
          sm:max-w-lg
          border border-white/10
          bg-[#0b1022]/80
          text-white
          shadow-2xl
          backdrop-blur-xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-white">Start a creation</DialogTitle>
          <DialogDescription className="text-white/70">
            Upload your video and set the details for this creation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="creation-name" className="text-xs text-white/60">
              Name of creation
            </Label>
            <Input
              id="creation-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dance Clip v1"
              className="h-11 bg-white/10 text-white placeholder:text-white/40 border-white/10"
            />
          </div>

          {/* Upload */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60">Upload video</Label>

            <div className="flex items-center gap-3">
              <label
                className="
                  flex-1 cursor-pointer rounded-2xl border border-white/10 bg-white/10
                  px-4 py-3 text-sm text-white/70 hover:bg-white/15
                "
              >
                <span className="inline-flex items-center gap-2">
                  <Upload className="h-4 w-4 text-white/60" />
                  {fileLabel}
                </span>
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
                  className="h-11 rounded-full bg-white/10 text-white hover:bg-white/15"
                  onClick={() => setFile(null)}
                >
                  Clear
                </Button>
              )}
            </div>

            <p className="text-xs text-white/45">
              Accepted: mp4, mov, webm (for now).
            </p>
          </div>

          {/* Folder select */}
          <div className="space-y-2">
            <Label className="text-xs text-white/60">
              Which folder to put it in (optional)
            </Label>

            <Select value={folderId} onValueChange={setFolderId}>
              <SelectTrigger className="h-11 rounded-2xl border-white/10 bg-white/10 text-white">
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0b1022]/95 text-white">
                <SelectItem value="none">No folder</SelectItem>
                {folders.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="creation-remarks" className="text-xs text-white/60">
              Additional remarks
            </Label>
            <Textarea
              id="creation-remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Anything you'd like to note (timing, music vibe, style hints)..."
              className="min-h-[96px] resize-none rounded-2xl border-white/10 bg-white/10 text-white placeholder:text-white/40"
            />
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button
            className="h-11 w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleCreate}
            disabled={!name.trim() || !file}
            title={!name.trim() || !file ? "Name + video required" : "Create"}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
