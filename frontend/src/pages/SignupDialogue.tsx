import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SignupDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-white/80 underline underline-offset-4 hover:text-white transition font-medium">
          Sign up
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm border border-white/10 bg-black text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Create an account</DialogTitle>
          <DialogDescription className="text-white/45">
            Join Stickmanify and start creating animations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="text-xs text-white/50">Name</Label>
            <Input
              id="signup-name"
              placeholder="Your name"
              className="h-11 bg-white/6 text-white placeholder:text-white/25 border-white/10 focus-visible:ring-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-xs text-white/50">Email</Label>
            <Input
              id="signup-email"
              placeholder="you@example.com"
              className="h-11 bg-white/6 text-white placeholder:text-white/25 border-white/10 focus-visible:ring-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-xs text-white/50">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              className="h-11 bg-white/6 text-white placeholder:text-white/25 border-white/10 focus-visible:ring-white/20"
            />
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button className="h-11 w-full rounded-full bg-white text-black font-bold hover:bg-white/90">
            Create account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
