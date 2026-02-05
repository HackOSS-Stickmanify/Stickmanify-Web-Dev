import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { User, Trash2, ShieldAlert, ChevronRight } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/60">
          Manage your account and app data.
        </p>
      </div>

      {/* Cubed grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SettingsTile
          title="Profile details"
          description="View and edit your profile information."
          icon={<User className="h-5 w-5" />}
          actionLabel="Open"
          onClick={() => {
            // TODO: route or open a dialog later
            console.log("Profile details clicked");
          }}
        />

        <SettingsTile
          title="Delete all data"
          description="Removes all projects and folders. This cannot be undone."
          icon={<Trash2 className="h-5 w-5" />}
          danger
          actionLabel="Delete"
          onClick={() => {
            // TODO: open confirm dialog later
            console.log("Delete all data clicked");
          }}
        />

        <SettingsTile
          title="Delete account"
          description="Permanently deletes your account and all associated data."
          icon={<ShieldAlert className="h-5 w-5" />}
          danger
          actionLabel="Delete"
          onClick={() => {
            // TODO: open confirm dialog later
            console.log("Delete account clicked");
          }}
        />
      </div>
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
      className={[
        "rounded-2xl border border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur",
        "transition hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]",
        "cursor-pointer",
      ].join(" ")}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <CardContent className="flex items-center gap-4 py-6">
        {/* icon pill */}
        <div
          className={[
            "flex h-12 w-12 items-center justify-center rounded-2xl",
            danger ? "bg-red-500/15 text-red-300" : "bg-blue-500/15 text-blue-200",
          ].join(" ")}
        >
          {icon}
        </div>

        <div className="flex-1">
          <div className="text-base font-semibold text-white/90">{title}</div>
          <div className="mt-1 text-sm text-white/60">{description}</div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className={[
              "h-9 rounded-full px-4",
              "bg-white/10 text-white hover:bg-white/15",
              danger ? "hover:bg-red-500/15" : "",
            ].join(" ")}
            onClick={(e) => {
              e.stopPropagation(); // don’t double-trigger
              onClick();
            }}
          >
            {actionLabel}
          </Button>

          <ChevronRight className="h-4 w-4 text-white/40" />
        </div>
      </CardContent>
    </Card>
  );
}
