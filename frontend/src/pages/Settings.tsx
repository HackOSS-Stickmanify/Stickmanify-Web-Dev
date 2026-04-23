import { useEffect, useState } from "react";
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
import { AlertTriangle, ChevronRight, Trash2, User } from "lucide-react";
import { deleteJob, listCompletedJobs, updateUserMaxJobs } from "@/lib/api";
import { authBypassEnabled, getRoleFromSession, supabase } from "@/lib/supabase";

type DialogType = "profile" | "deleteData" | null;

export default function Settings() {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [deleteDataConfirm, setDeleteDataConfirm] = useState("");
  const [deleteDataLoading, setDeleteDataLoading] = useState(false);
  const [deleteDataError, setDeleteDataError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [maxJobsUserId, setMaxJobsUserId] = useState("");
  const [maxJobs, setMaxJobs] = useState("5");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    if (authBypassEnabled) return;

    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      setIsAdmin(getRoleFromSession(session) === "admin");
      setProfileEmail(session?.user.email ?? "");
      setProfileName(readUserName(session?.user.user_metadata));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(getRoleFromSession(session) === "admin");
      setProfileEmail(session?.user.email ?? "");
      setProfileName(readUserName(session?.user.user_metadata));
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSaveProfile() {
    setProfileLoading(true);
    setProfileMessage("");
    setProfileError("");

    try {
      if (authBypassEnabled) {
        throw new Error("Profile updates require Supabase auth. Set VITE_AUTH_BYPASS=false to use this.");
      }

      const { error } = await supabase.auth.updateUser({
        email: profileEmail.trim(),
        data: { name: profileName.trim() },
      });

      if (error) throw error;
      setProfileMessage("Profile updated.");
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleDeleteData() {
    setDeleteDataLoading(true);
    setDeleteDataError("");

    try {
      const jobs = await listCompletedJobs();
      await Promise.all(jobs.map((job) => deleteJob(job.jobId)));
      setDeleteDataConfirm("");
      setActiveDialog(null);
    } catch (err) {
      setDeleteDataError(err instanceof Error ? err.message : "Could not delete completed jobs.");
    } finally {
      setDeleteDataLoading(false);
    }
  }

  async function handleUpdateMaxJobs() {
    const parsedMaxJobs = Number(maxJobs);
    if (!maxJobsUserId.trim() || !Number.isInteger(parsedMaxJobs) || parsedMaxJobs < 0) {
      setAdminError("Enter a user ID and a non-negative whole number.");
      setAdminMessage("");
      return;
    }

    setAdminLoading(true);
    setAdminError("");
    setAdminMessage("");

    try {
      await updateUserMaxJobs(maxJobsUserId.trim(), parsedMaxJobs);
      setAdminMessage("Max jobs updated.");
    } catch (err) {
      setAdminError(err instanceof Error ? err.message : "Could not update max jobs.");
    } finally {
      setAdminLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black">Settings</h1>
        <p className="mt-1 text-sm text-black/40">Manage frontend account and backend job controls.</p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -right-4 -top-2 opacity-[0.06] anim-bounce hidden lg:block">
          <StickmanIcon width={72} strokeWidth={2} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SettingsTile
            title="Profile details"
            description="Update your Supabase account profile."
            icon={<User className="h-5 w-5" />}
            actionLabel="Edit"
            onClick={() => setActiveDialog("profile")}
          />
          <SettingsTile
            title="Delete completed jobs"
            description="Soft-delete completed backend jobs."
            icon={<Trash2 className="h-5 w-5" />}
            danger
            actionLabel="Delete"
            onClick={() => setActiveDialog("deleteData")}
          />
        </div>

        {isAdmin && (
          <Card className="mt-4 rounded-2xl border border-black/8 bg-white text-black shadow-sm">
            <CardContent className="space-y-4 py-6">
              <div>
                <h2 className="text-sm font-semibold text-black/80">Admin: user max jobs</h2>
                <p className="mt-0.5 text-xs text-black/40">
                  Update a user's maximum active and completed job allowance.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_140px_auto] sm:items-end">
                <div className="space-y-2">
                  <Label htmlFor="max-jobs-user-id" className="text-xs text-black/50">User ID</Label>
                  <Input
                    id="max-jobs-user-id"
                    value={maxJobsUserId}
                    onChange={(e) => setMaxJobsUserId(e.target.value)}
                    placeholder="Supabase user ID"
                    className="h-11 bg-white border-black/10 text-black placeholder:text-black/25 focus-visible:ring-black/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-jobs" className="text-xs text-black/50">Max jobs</Label>
                  <Input
                    id="max-jobs"
                    type="number"
                    min={0}
                    value={maxJobs}
                    onChange={(e) => setMaxJobs(e.target.value)}
                    className="h-11 bg-white border-black/10 text-black focus-visible:ring-black/20"
                  />
                </div>
                <Button
                  className="h-11 rounded-full bg-black text-white font-semibold hover:bg-black/85"
                  disabled={adminLoading}
                  onClick={handleUpdateMaxJobs}
                >
                  {adminLoading ? "Updating..." : "Update"}
                </Button>
              </div>
              {adminError && <InlineError message={adminError} />}
              {adminMessage && <InlineMessage message={adminMessage} />}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={activeDialog === "profile"} onOpenChange={(v) => !v && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-sm border border-black/8 bg-white text-black shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-black">Profile details</DialogTitle>
            <DialogDescription className="text-black/45">
              Update your Supabase display name and email address.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-1">
            <div className="space-y-2">
              <Label htmlFor="profile-name" className="text-xs text-black/50">Name</Label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Display name"
                className="h-11 bg-white border-black/10 text-black placeholder:text-black/25 focus-visible:ring-black/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email" className="text-xs text-black/50">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 bg-white border-black/10 text-black placeholder:text-black/25 focus-visible:ring-black/20"
              />
            </div>
            {profileError && <InlineError message={profileError} />}
            {profileMessage && <InlineMessage message={profileMessage} />}
          </div>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="ghost" className="rounded-full text-black/50 hover:text-black hover:bg-black/6"
              onClick={() => setActiveDialog(null)}>Cancel</Button>
            <Button className="rounded-full bg-black text-white font-semibold hover:bg-black/85"
              disabled={profileLoading}
              onClick={handleSaveProfile}>
              {profileLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "deleteData"}
        onOpenChange={(v) => { if (!v) { setDeleteDataConfirm(""); setDeleteDataError(""); setActiveDialog(null); } }}>
        <DialogContent className="sm:max-w-sm border border-black/8 bg-white text-black shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-black flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Delete completed jobs
            </DialogTitle>
            <DialogDescription className="text-black/45">
              This soft-deletes every completed job returned by the backend.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-1">
            <p className="text-xs text-black/50">
              Type <span className="font-mono text-black/80 bg-black/6 px-1.5 py-0.5 rounded">DELETE</span> to confirm.
            </p>
            <Input value={deleteDataConfirm} onChange={(e) => setDeleteDataConfirm(e.target.value)}
              placeholder="DELETE"
              className="h-11 bg-white border-black/10 text-black placeholder:text-black/20 focus-visible:ring-red-400/30" />
            {deleteDataError && <InlineError message={deleteDataError} />}
          </div>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="ghost" className="rounded-full text-black/50 hover:text-black hover:bg-black/6"
              onClick={() => { setDeleteDataConfirm(""); setDeleteDataError(""); setActiveDialog(null); }}>Cancel</Button>
            <Button className="rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-30"
              disabled={deleteDataConfirm !== "DELETE" || deleteDataLoading} onClick={handleDeleteData}>
              {deleteDataLoading ? "Deleting..." : "Delete completed jobs"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SettingsTile({ title, description, icon, actionLabel, onClick, danger = false }: {
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
        "rounded-2xl border border-black/8 bg-white text-black shadow-sm cursor-pointer",
        "transition hover:shadow-md hover:border-black/14"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
    >
      <CardContent className="flex items-center gap-4 py-6">
        <div className={cn(
          "flex h-11 w-11 items-center justify-center rounded-2xl shrink-0",
          danger ? "bg-red-50 text-red-500" : "bg-black/5 text-black/55"
        )}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-black/80">{title}</div>
          <div className="mt-0.5 text-xs text-black/40 leading-relaxed">{description}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            className={cn(
              "h-8 rounded-full px-4 text-xs font-semibold border",
              danger
                ? "bg-red-50 text-red-500 border-red-100 hover:bg-red-100"
                : "bg-black/5 text-black/60 border-black/8 hover:bg-black hover:text-white"
            )}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
          >
            {actionLabel}
          </Button>
          <ChevronRight className="h-4 w-4 text-black/20" />
        </div>
      </CardContent>
    </Card>
  );
}

function InlineError({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
      {message}
    </p>
  );
}

function InlineMessage({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-black/10 bg-black/4 px-3 py-2 text-xs text-black/55">
      {message}
    </p>
  );
}

function readUserName(metadata: Record<string, unknown> | undefined) {
  const name = metadata?.name;
  return typeof name === "string" ? name : "";
}

function StickmanIcon({ width, strokeWidth }: { width: number; strokeWidth: number }) {
  return (
    <svg viewBox="0 0 44 80" width={width} fill="none" stroke="black" strokeWidth={strokeWidth} strokeLinecap="round">
      <circle cx="22" cy="8" r="7"/>
      <line x1="22" y1="15" x2="22" y2="46"/>
      <line x1="22" y1="24" x2="6"  y2="14"/>
      <line x1="22" y1="24" x2="38" y2="30"/>
      <line x1="22" y1="46" x2="8"  y2="70"/>
      <line x1="22" y1="46" x2="36" y2="70"/>
    </svg>
  );
}
