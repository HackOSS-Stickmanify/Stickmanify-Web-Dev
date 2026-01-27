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
        <button className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
          Sign up
        </button>
      </DialogTrigger>

      <DialogContent
        className="
          sm:max-w-md
          border border-white/10
          bg-[#0b1022]/80
          text-white
          shadow-2xl
          backdrop-blur-xl
        "
      >
        <DialogHeader>
          <DialogTitle className="text-white">Create an account</DialogTitle>
          <DialogDescription className="text-white/70">
            Please enter your details to sign up.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="text-xs text-white/60">
              Name
            </Label>
            <Input
              id="signup-name"
              placeholder="Example Person"
              className="h-11 bg-white/10 text-white placeholder:text-white/40 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-xs text-white/60">
              Email
            </Label>
            <Input
              id="signup-email"
              placeholder="example@gmail.com"
              className="h-11 bg-white/10 text-white placeholder:text-white/40 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-xs text-white/60">
              Password
            </Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              className="h-11 bg-white/10 text-white placeholder:text-white/40 border-white/10"
            />
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button className="h-11 w-full bg-blue-600 hover:bg-blue-700">
            Create account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
