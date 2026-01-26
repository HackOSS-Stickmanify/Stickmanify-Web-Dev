import { Button } from "@/components/ui/button";

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-6">
      <div className="w-full max-w-sm rounded-xl border bg-background p-6 shadow">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Testing Tailwind + shadcn Button
        </p>

        <div className="mt-6 space-y-3">
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Email"
          />
          <input
            type="password"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Password"
          />

          <Button className="w-full bg-blue-600">Sign in</Button>
        </div>
      </div>
    </div>
  );
}

export default Login
