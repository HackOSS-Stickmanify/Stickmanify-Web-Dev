import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#040713] text-white">
      {/* Background shapes (subtle) */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-white/10 blur-sm" />
      <div className="pointer-events-none absolute -bottom-52 -left-64 h-[760px] w-[760px] rounded-full bg-white/10" />
      <div className="pointer-events-none absolute top-24 left-1/3 h-[420px] w-[420px] rounded-full bg-white/5" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center gap-10 px-6 py-10">
        {/* Left hero */}
        <div className="flex-1">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
            Stickmanify<span className="text-white/90">.</span>
          </h1>

          <p className="mt-2 text-xl font-semibold text-white/90">
            A project by NTU Open Source Society
          </p>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70">
            A web application that turns user-uploaded videos into stickman animations synced with music.
            Using computer vision for pose detection and generative AI for style customisation, the app 
            will generate smooth beat-aligned animations.
          </p>

          <div className="mt-8">
            <Button
              variant="secondary"
              className="rounded-full bg-white text-[#040713] hover:bg-white/90"
            >
              Learn more
            </Button>
          </div>
        </div>

        {/* Right login card */}
        <div className="w-full max-w-sm">
          <Card className="rounded-2xl border border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-xl tracking-wide text-white/70">
                Welcome Back!
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-white/60">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="Please enter your email"
                  className="h-11 bg-white/10 text-white placeholder:text-white/40 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs text-white/60">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Please enter your password"
                  className="h-11 bg-white/10 text-white placeholder:text-white/40 border-white/10"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button className="h-11 w-full bg-blue-600 hover:bg-blue-700">
                LOGIN
              </Button>

              <p className="text-sm text-white/70">
                Don’t have an account?{" "}
                <a
                  href="/signup"
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-4"
                >
                  Sign up
                </a>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
