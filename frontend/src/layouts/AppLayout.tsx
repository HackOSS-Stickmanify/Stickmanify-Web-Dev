import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CreateDialog from "@/pages/CreateDialogue";

import { cn } from "@/lib/utils";

import {
  Menu,
  Home as HomeIcon,
  FolderKanban,
  Plus,
  Settings,
  HelpCircle,
} from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#040713] text-white">
      {/* subtle background shapes */}
      <div className="pointer-events-none fixed -top-48 -left-48 h-[560px] w-[560px] rounded-full bg-white/10 blur-sm" />
      <div className="pointer-events-none fixed -bottom-64 -left-72 h-[820px] w-[820px] rounded-full bg-white/10" />
      <div className="pointer-events-none fixed top-24 left-1/3 h-[460px] w-[460px] rounded-full bg-white/5" />

      <div className="relative flex min-h-screen">
        {/* Sidebar */}
        <aside className="sticky top-0 h-screen w-20 border-r border-white/10 bg-white/5 backdrop-blur">
          <div className="flex h-full flex-col items-center gap-3 py-4">
            {/* Top "menu" icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Menu className="h-5 w-5 text-white/80" />
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <SideNavItem to="/home" label="Home" icon={<HomeIcon className="h-5 w-5" />} />
              <SideNavItem
                to="/projects"
                label="Projects"
                icon={<FolderKanban className="h-5 w-5" />}
              />
              {/* Create */}
              <CreateDialog
                folders={[
                    { id: "friends", name: "Friends" },
                    { id: "family", name: "Family" },
                    { id: "strangers", name: "Strangers" },
                ]}
                />
              <SideNavItem
                to="/settings"
                label="Settings"
                icon={<Settings className="h-5 w-5" />}
              />
            </div>

            <div className="mt-auto flex flex-col items-center gap-3 pb-4">
              <Button
                variant="secondary"
                className="h-10 w-10 rounded-full bg-white/10 px-0 text-white hover:bg-white/15"
                title="Help"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Right content */}
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SideNavItem({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "group flex h-12 w-12 items-center justify-center rounded-2xl transition",
          "text-white/70 hover:bg-white/10 hover:text-white",
          isActive && "bg-white/15 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
        )
      }
      title={label}
      aria-label={label}
    >
      <span className="text-white/80 group-hover:text-white">{icon}</span>
    </NavLink>
  );
}
