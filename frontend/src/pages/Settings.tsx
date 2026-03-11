import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { User, Trash2, ShieldAlert, ChevronRight, AlertTriangle } from "lucide-react";

type DialogType = "profile" | "deleteData" | "deleteAccount" | null;

export default function Settings() {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);

  // Profile form state
  const [profileName,  setProfileName]  = useState("Alex Johnson");
  const [profileEmail, setProfileEmail] = useState("alex@example.com");

  // Confirm delete inputs
  const [deleteDataConfirm,    setDeleteDataConfirm]    = useState("");
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState("");

  function handleSaveProfile() {
    console.log("SAVE PROFILE:", { profileName, profileEmail });
    setActiveDialog(null);
  }

  function handleDeleteData() {
    console.log("DELETE ALL DATA");
    setDeleteDataConfirm("");
    setActiveDialog(null);
  }

  function handleDeleteAccount() {
    console.log("DELETE ACCOUNT");
    setDeleteAccountConfirm("");
    setActiveDialog(null);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/40">Manage your account and app data.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SettingsTile
          title="Profile details"
          description="View and edit your name and email."
          icon={<User className="h-5 w-5" />}
          actionLabel="Edit"
          onClick={() => setActiveDialog("profile")}
        />
        <SettingsTile
          title="Delete all data"
          description="Remove all projects and folders permanently."
          icon={<Trash2 className="h-5 w-5" />}
          danger
          actionLabel="Delete"
          onClick={() => setActiveDialog("deleteData")}
        />
        <SettingsTile
          title="Delete account"
          description="Permanently delete your account and all data."
          icon={<ShieldAlert className="h-5 w-5" />}
          danger
          actionLabel="Delete"
          onClick={() => setActiveDialog("deleteAccount")}
        />
      </div>

      {/* ── Profile dialog ───────────────────────────────────── */}
      <Dialog open={activeDialog === "profile"} onOpenChange={(v) => !v && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-sm border border-white/10 bg-black text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Profile details</DialogTitle>
            <DialogDescription className="text-white/45">
              Update your display name and email address.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-1">
            <div className="space-y-2">
              <Label htmlFor="profile-name" className="text-xs text-white/50">Name</Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="h-11 bg-white/6 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email" className="text-xs text-white/50">Email</Label>
              <Input
                id="profile-email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="h-11 bg-white/6 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-white/20"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="ghost"
              className="rounded-full text-white/50 hover:text-white hover:bg-white/8"
              onClick={() => setActiveDialog(null)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full bg-white text-black font-semibold hover:bg-white/90"
              onClick={handleSaveProfile}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete all data dialog ──────────────────────────── */}
      <Dialog open={activeDialog === "deleteData"} onOpenChange={(v) => { if (!v) { setDeleteDataConfirm(""); setActiveDialog(null); } }}>
        <DialogContent className="sm:max-w-sm border border-white/10 bg-black text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Delete all data
            </DialogTitle>
            <DialogDescription className="text-white/45">
              This will permanently remove all your projects and folders. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-1">
            <p className="text-xs text-white/50">
              Type <span className="font-mono text-white/80">DELETE</span> to confirm.
            </p>
            <Input
              value={deleteDataConfirm}
              onChange={(e) => setDeleteDataConfirm(e.target.value)}
              placeholder="DELETE"
              className="h-11 bg-white/6 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-red-500/30"
            />
          </div>

          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="ghost"
              className="rounded-full text-white/50 hover:text-white hover:bg-white/8"
              onClick={() => { setDeleteDataConfirm(""); setActiveDialog(null); }}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full bg-red-500/80 text-white font-semibold hover:bg-red-500 disabled:opacity-30"
              disabled={deleteDataConfirm !== "DELETE"}
              onClick={handleDeleteData}
            >
              Delete all data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete account dialog ────────────────────────────── */}
      <Dialog open={activeDialog === "deleteAccount"} onOpenChange={(v) => { if (!v) { setDeleteAccountConfirm(""); setActiveDialog(null); } }}>
        <DialogContent className="sm:max-w-sm border border-white/10 bg-black text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Delete account
            </DialogTitle>
            <DialogDescription className="text-white/45">
              Your account and all associated data will be permanently deleted. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-1">
            <p className="text-xs text-white/50">
              Type <span className="font-mono text-white/80">DELETE MY ACCOUNT</span> to confirm.
            </p>
            <Input
              value={deleteAccountConfirm}
              onChange={(e) => setDeleteAccountConfirm(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              className="h-11 bg-white/6 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-red-500/30"
            />
          </div>

          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="ghost"
              className="rounded-full text-white/50 hover:text-white hover:bg-white/8"
              onClick={() => { setDeleteAccountConfirm(""); setActiveDialog(null); }}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full bg-red-500/80 text-white font-semibold hover:bg-red-500 disabled:opacity-30"
              disabled={deleteAccountConfirm !== "DELETE MY ACCOUNT"}
              onClick={handleDeleteAccount}
            >
              Delete account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SettingsTile({
  title,
  description,
  icon,
  actionLabel,
  onClick,
  danger = false,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  actionLabel: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-white/10 bg-white/4 text-white shadow-xl cursor-pointer",
        "transition hover:bg-white/7"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
    >
      <CardContent className="flex items-center gap-4 py-6">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl shrink-0",
            danger ? "bg-red-500/10 text-red-400" : "bg-white/8 text-white/60"
          )}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white/85">{title}</div>
          <div className="mt-0.5 text-xs text-white/40 leading-relaxed">{description}</div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            className={cn(
              "h-8 rounded-full px-4 text-xs font-semibold border",
              danger
                ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                : "bg-white/6 text-white/60 border-white/10 hover:bg-white/12 hover:text-white"
            )}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
          >
            {actionLabel}
          </Button>
          <ChevronRight className="h-4 w-4 text-white/20" />
        </div>
      </CardContent>
    </Card>
  );
}
