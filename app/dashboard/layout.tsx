import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopBar } from "@/components/dashboard/dashboard-topbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/auth/login");
  }

  const user = data.claims;

  // Fetch role from profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.sub)
    .single();

  const role = (profile?.role ?? "customer") as "admin" | "customer";

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950">
      <DashboardSidebar userEmail={user.email ?? ""} role={role} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopBar userEmail={user.email ?? ""} role={role} />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
