import Link from "next/link";
import { Button } from "./ui/button";
import { hasEnvVars } from "@/lib/utils";

// Dynamically import the server client only when env vars exist
async function getUser() {
  if (!hasEnvVars) return null;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    return data?.claims ?? null;
  } catch {
    return null;
  }
}

export async function AuthButton() {
  const user = await getUser();

  return user ? (
    <div className="flex items-center gap-3">
      <Button asChild size="sm" variant="outline">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <LogoutButtonServer />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/auth/sign-up">Create account</Link>
      </Button>
    </div>
  );
}

// Inline logout — avoids an extra file import
function LogoutButtonServer() {
  // Rendered server-side, actual logout handled client-side via form action
  return (
    <form
      action={async () => {
        "use server";
        if (!hasEnvVars) return;
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        await supabase.auth.signOut();
      }}
    >
      <Button size="sm" variant="ghost" type="submit">
        Sign out
      </Button>
    </form>
  );
}
