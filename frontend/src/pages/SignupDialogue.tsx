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
import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    setMessage("Account created. Check your email if confirmation is required, then log in.");
    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <form onSubmit={handleSignup}>
        <div className="space-y-4 mt-1">
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="text-xs text-black/50">Name</Label>
            <Input
              id="signup-name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 bg-white text-black placeholder:text-black/25 border-black/10 focus-visible:ring-black/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-xs text-black/50">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-white text-black placeholder:text-black/25 border-black/10 focus-visible:ring-black/20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-xs text-black/50">Password</Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-white text-black placeholder:text-black/25 border-black/10 focus-visible:ring-black/20"
              required
            />
          </div>
          {error && (
            <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-xl border border-black/10 bg-black/4 px-3 py-2 text-xs text-black/55">
              {message}
            </p>
          )}
        </div>

        <DialogFooter className="mt-2">
          <Button
            type="submit"
            className="h-11 w-full rounded-full bg-black text-white font-bold hover:bg-black/85"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
