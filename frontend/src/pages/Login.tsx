import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import SignupDialog from "./SignupDialogue";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-white text-black stickman-grid">

      {/* ── Background stickman decorations ────────────────────── */}
      {/* Large — bottom left */}
      <div className="pointer-events-none absolute bottom-0 left-4 opacity-[0.05] anim-sway hidden md:block" style={{ transformOrigin: "bottom center" }}>
        <svg viewBox="0 0 44 80" width="140" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round">
          <circle cx="22" cy="8" r="7"/>
          <line x1="22" y1="15" x2="22" y2="46"/>
          <line x1="22" y1="24" x2="6"  y2="18"/>
          <line x1="22" y1="24" x2="38" y2="30"/>
          <line x1="22" y1="46" x2="8"  y2="70"/>
          <line x1="22" y1="46" x2="36" y2="70"/>
        </svg>
      </div>
      {/* Medium — top right */}
      <div className="pointer-events-none absolute top-8 right-8 opacity-[0.06] anim-bounce hidden lg:block">
        <svg viewBox="0 0 44 80" width="90" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="22" cy="8" r="7"/>
          <line x1="22" y1="15" x2="22" y2="46"/>
          {/* raised arm */}
          <line x1="22" y1="24" x2="6"  y2="12"/>
          <line x1="22" y1="24" x2="38" y2="30"/>
          <line x1="22" y1="46" x2="8"  y2="70"/>
          <line x1="22" y1="46" x2="36" y2="70"/>
        </svg>
      </div>
      {/* Small — mid left */}
      <div className="pointer-events-none absolute top-1/2 left-16 opacity-[0.04] anim-sway hidden xl:block" style={{ animationDelay: "1s", transformOrigin: "bottom center" }}>
        <svg viewBox="0 0 44 80" width="60" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round">
          <circle cx="22" cy="8" r="7"/>
          <line x1="22" y1="15" x2="22" y2="46"/>
          <line x1="22" y1="24" x2="6"  y2="16"/>
          <line x1="22" y1="24" x2="38" y2="28"/>
          <line x1="22" y1="46" x2="8"  y2="70"/>
          <line x1="22" y1="46" x2="36" y2="70"/>
        </svg>
      </div>
      {/* Extra — bottom right */}
      <div className="pointer-events-none absolute bottom-20 right-20 opacity-[0.05] anim-bounce hidden xl:block" style={{ animationDelay: "0.5s" }}>
        <svg viewBox="0 0 44 80" width="70" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="22" cy="8" r="7"/>
          <line x1="22" y1="15" x2="22" y2="46"/>
          <line x1="22" y1="24" x2="6"  y2="18"/>
          <line x1="22" y1="24" x2="38" y2="32"/>
          <line x1="22" y1="46" x2="8"  y2="70"/>
          <line x1="22" y1="46" x2="36" y2="70"/>
        </svg>
      </div>

      {/* Walking stickman at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-12 overflow-hidden">
        <div className="anim-walk absolute bottom-1 opacity-[0.07]">
          <svg viewBox="0 0 44 80" width="32" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round">
            <circle cx="22" cy="8" r="7"/>
            <line x1="22" y1="15" x2="22" y2="46"/>
            <line x1="22" y1="24" x2="6"  y2="18"/>
            <line x1="22" y1="24" x2="38" y2="32"/>
            <line x1="22" y1="46" x2="8"  y2="70"/>
            <line x1="22" y1="46" x2="36" y2="70"/>
          </svg>
        </div>
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center gap-12 px-6 py-10">

        {/* ── Left hero ──────────────────────────────────────── */}
        <div className="flex-1 space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 44 80" width="44" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" className="anim-sway shrink-0" style={{ transformOrigin: "bottom center" }}>
              <circle cx="22" cy="8" r="7"/>
              <line x1="22" y1="15" x2="22" y2="46"/>
              <line x1="22" y1="24" x2="6"  y2="14"/>
              <line x1="22" y1="24" x2="38" y2="30"/>
              <line x1="22" y1="46" x2="8"  y2="70"/>
              <line x1="22" y1="46" x2="36" y2="70"/>
            </svg>
            <div>
              <h1 className="text-5xl sm:text-6xl font-extrabold leading-none tracking-tight text-black">
                Stickmanify
              </h1>
              <p className="text-sm text-black/40 mt-1 tracking-wide">by NTU Open Source Society</p>
            </div>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-black/50">
            Upload a video and watch it transform into a smooth stickman animation,
            synced with music using computer vision and generative AI.
          </p>

          <div className="flex flex-col gap-2">
            {[
              "Pose detection via computer vision",
              "Beat-aligned stickman animations",
              "Generative AI style customisation",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-sm text-black/45">
                <div className="h-1.5 w-1.5 rounded-full bg-black/30 shrink-0" />
                {feat}
              </div>
            ))}
          </div>

          <Button
            variant="secondary"
            className="rounded-full border border-black/12 bg-black/5 text-black/65 hover:bg-black hover:text-white transition"
          >
            Learn more
          </Button>
        </div>

        {/* ── Right login card ───────────────────────────────── */}
        <div className="w-full max-w-sm shrink-0">
          <Card className="rounded-2xl border border-black/10 bg-white text-black shadow-xl">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-xl font-bold text-black/75">Welcome back</CardTitle>
              <p className="text-xs text-black/35 mt-1">Sign in to your account</p>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-black/50">Email</Label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  className="h-11 bg-white text-black placeholder:text-black/25 border-black/10 focus-visible:ring-black/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs text-black/50">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 bg-white text-black placeholder:text-black/25 border-black/10 focus-visible:ring-black/20"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button
                className="h-11 w-full rounded-full bg-black text-white font-bold hover:bg-black/85 tracking-wide"
                onClick={() => navigate("/home")}
              >
                LOGIN
              </Button>
              <p className="text-sm text-black/45">
                Don't have an account?{" "}
                <SignupDialog />
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
