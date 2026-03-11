import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CreateDialog from "@/pages/CreateDialogue";
import { cn } from "@/lib/utils";

import {
  Home as HomeIcon,
  FolderKanban,
  Settings,
  Bell,
  LogOut,
  X,
} from "lucide-react";

const FOLDERS = [
  { id: "friends", name: "Friends" },
  { id: "family", name: "Family" },
  { id: "strangers", name: "Strangers" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notif dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  return (
    <div className="min-h-screen bg-black text-white stickman-grid">

      {/* ── Top Navbar ─────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 border-b border-white/10 bg-black flex items-center px-4 gap-4">
        {/* Brand */}
        <div className="w-20 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold tracking-widest text-white/40 uppercase">stk</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Inline stickman logo */}
          <svg viewBox="0 0 28 48" width="14" height="24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="opacity-80">
            <circle cx="14" cy="6" r="5" />
            <line x1="14" y1="11" x2="14" y2="30" />
            <line x1="14" y1="17" x2="4"  y2="10" />
            <line x1="14" y1="17" x2="24" y2="24" />
            <line x1="14" y1="30" x2="5"  y2="44" />
            <line x1="14" y1="30" x2="23" y2="44" />
          </svg>
          <span className="text-base font-bold tracking-tight">Stickmanify</span>
        </div>

        <div className="flex-1" />

        {/* Bell */}
        <div className="relative" ref={notifRef}>
          <Button
            variant="ghost"
            className="h-9 w-9 px-0 rounded-full text-white/60 hover:text-white hover:bg-white/8"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-72 rounded-2xl border border-white/12 bg-black shadow-2xl z-50 anim-float">
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Notifications</span>
                <button onClick={() => setNotifOpen(false)} className="text-white/40 hover:text-white transition">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                {/* Mini stickman shrug */}
                <svg viewBox="0 0 40 72" width="32" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="opacity-30 anim-sway">
                  <circle cx="20" cy="8" r="7" />
                  <line x1="20" y1="15" x2="20" y2="42" />
                  <line x1="20" y1="22" x2="4"  y2="16" />
                  <line x1="20" y1="22" x2="36" y2="16" />
                  <line x1="20" y1="42" x2="8"  y2="62" />
                  <line x1="20" y1="42" x2="32" y2="62" />
                </svg>
                <p className="text-sm text-white/30">No notifications yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          className="h-9 px-3 rounded-full text-white/60 hover:text-white hover:bg-white/8 text-sm gap-2"
          onClick={() => navigate("/")}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </header>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="flex min-h-screen pt-14">

        {/* Sidebar */}
        <aside className="fixed top-14 left-0 w-20 bottom-0 border-r border-white/10 bg-black z-40 flex flex-col items-center py-4 gap-2">
          {/* Main nav */}
          <div className="flex flex-col items-center gap-2">
            <SideNavItem to="/home"     label="Home"     icon={<HomeIcon      className="h-5 w-5" />} />
            <SideNavItem to="/projects" label="Projects" icon={<FolderKanban  className="h-5 w-5" />} />
            <CreateDialog folders={FOLDERS} triggerVariant="sidebar" />
          </div>

          {/* Settings at bottom */}
          <div className="mt-auto">
            <SideNavItem to="/settings" label="Settings" icon={<Settings className="h-5 w-5" />} />
          </div>
        </aside>

        {/* Main content */}
        <main className="ml-20 flex-1 min-w-0">
          <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
        </main>
      </div>

      {/* Walking stickman decoration */}
      <div className="pointer-events-none fixed bottom-0 left-0 w-full h-16 overflow-hidden">
        <div className="anim-walk absolute bottom-2 opacity-[0.07]">
          <svg viewBox="0 0 44 80" width="36" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
            <circle cx="22" cy="8"  r="7"  />
            <line x1="22" y1="15" x2="22" y2="46" />
            <line x1="22" y1="24" x2="6"  y2="18" />
            <line x1="22" y1="24" x2="38" y2="32" />
            <line x1="22" y1="46" x2="8"  y2="70" />
            <line x1="22" y1="46" x2="36" y2="70" />
          </svg>
        </div>
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
          "text-white/40 hover:bg-white/8 hover:text-white",
          isActive && "bg-white/10 text-white ring-1 ring-white/15"
        )
      }
      title={label}
      aria-label={label}
    >
      <span className="text-white/60 group-hover:text-white transition">{icon}</span>
    </NavLink>
  );
}
