"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package2,
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  ShieldCheck,
  Users,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const customerNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/shipments", label: "My Shipments", icon: Package },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const adminNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/shipments", label: "All Shipments", icon: Package },
  { href: "/dashboard/admin/customers", label: "Customers", icon: Users },
  { href: "/dashboard/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface Props {
  userEmail: string;
  role?: "admin" | "customer";
}

export function DashboardSidebar({ userEmail, role = "customer" }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const nav = role === "admin" ? adminNav : customerNav;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex-shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-neutral-900 dark:text-white">SwiftShip</span>
        </Link>
      </div>

      {/* Admin badge */}
      {role === "admin" && (
        <div className="px-4 pt-4">
          <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Panel
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User / logout */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
              {userEmail}
            </p>
            <p className="text-xs text-neutral-400 capitalize">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
