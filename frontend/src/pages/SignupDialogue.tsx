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
        <button className="text-black/75 underline underline-offset-4 hover:text-black transition font-medium">
          Sign up
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm border border-black/10 bg-white text-black shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-black">Create an account</DialogTitle>
          <DialogDescription className="text-black/45">
            Join Stickmanify and start creating animations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="text-xs text-black/50">Name</Label>
            <Input
              id="signup-name"
              placeholder="Your name"
              className="h-11 bg-white text-black placeholder:text-black/25 border-black/10 focus-visible:ring-black/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-xs text-black/50">Email</Label>
            <Input
              id="signup-email"
              placeholder="you@example.com"
              className="h-11 bg-white text-black placeholder:text-black/25 border-black/10 focus-visible:ring-black/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-xs text-black/50">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              className="h-11 bg-white text-black placeholder:text-black/25 border-black/10 focus-visible:ring-black/20"
            />
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button className="h-11 w-full rounded-full bg-black text-white font-bold hover:bg-black/85">
            Create account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
