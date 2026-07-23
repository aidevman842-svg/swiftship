import { SignUpForm } from "@/components/sign-up-form";
import { Package2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Create Account — SwiftShip Logistics",
};

const perks = [
  "Real-time shipment tracking",
  "Instant hold & release notifications",
  "Full payment and invoice history",
  "24/7 account support",
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
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
          <h2 className="text-2xl font-bold mb-6">
            Everything you need to manage your freight.
          </h2>
          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-neutral-300 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-10 mt-auto text-xs text-neutral-500">
          © 2026 SwiftShip Logistics Inc.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center items-center p-8 bg-neutral-50 dark:bg-neutral-950">
        <div className="w-full max-w-sm">
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

          <SignUpForm />

          <p className="text-center text-xs text-neutral-400 mt-6">
            By creating an account you agree to our{" "}
            <Link href="/" className="underline hover:text-neutral-600">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
