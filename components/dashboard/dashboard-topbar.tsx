"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Package2,
  LayoutDashboard,
  Package,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/shipments": "My Shipments",
  "/dashboard/admin/shipments": "All Shipments",
  "/dashboard/admin/customers": "Customers",
  "/dashboard/admin/reports": "Reports",
  "/dashboard/settings": "Settings",
};

interface Props {
  userEmail: string;
  role?: "admin" | "customer";
}

export function DashboardTopBar({ userEmail, role = "customer" }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const title =
    Object.entries(pageTitles).find(([key]) => pathname === key)?.[1] ??
    "Dashboard";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <>
      <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 lg:px-8 flex-shrink-0">
        {/* Mobile menu toggle + page title */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <h1 className="font-semibold text-neutral-900 dark:text-white">
            {title}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <button className="relative p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
          </button>
          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold ml-1">
            {userEmail.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="flex-1 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="w-64 bg-white dark:bg-neutral-900 flex flex-col h-full shadow-xl">
            <div className="h-16 flex items-center justify-between px-5 border-b border-neutral-200 dark:border-neutral-800">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Package2 className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-neutral-900 dark:text-white">
                  SwiftShip
                </span>
              </Link>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 px-4 py-4 space-y-1">
              {(role === "admin"
                ? [
                    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
                    { href: "/dashboard/admin/shipments", label: "All Shipments", icon: Package },
                    { href: "/dashboard/settings", label: "Settings", icon: Settings },
                  ]
                : [
                    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
                    { href: "/dashboard/shipments", label: "My Shipments", icon: Package },
                    { href: "/dashboard/settings", label: "Settings", icon: Settings },
                  ]
              ).map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-xs text-neutral-500 px-3 mb-2 truncate">
                {userEmail}
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
