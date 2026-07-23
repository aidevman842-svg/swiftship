import { LoginForm } from "@/components/login-form";
import { Package2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Sign In — SwiftShip Logistics",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col bg-[#0a1628] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d2240] to-[#1a3a5c]" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">SwiftShip</span>
          </Link>
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <blockquote className="mt-auto">
            <p className="text-2xl font-semibold leading-snug text-white max-w-xs">
              &ldquo;Visibility from pickup to delivery. Every single step.&rdquo;
            </p>
            <footer className="mt-4 text-neutral-400 text-sm">
              Track, manage, and control your shipments from one dashboard.
            </footer>
          </blockquote>
        </div>
        <div className="relative z-10 mt-auto pt-8 text-xs text-neutral-500">
          © 2026 SwiftShip Logistics Inc.
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-col justify-center items-center p-8 bg-neutral-50 dark:bg-neutral-950">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-neutral-900 dark:text-white">
                SwiftShip
              </span>
            </Link>
          </div>

          <LoginForm />

          <p className="text-center text-xs text-neutral-400 mt-6">
            By signing in you agree to our{" "}
            <Link href="/" className="underline hover:text-neutral-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/" className="underline hover:text-neutral-600">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
