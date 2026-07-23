import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader authSlot={<Suspense><AuthButton /></Suspense>} />
      <main className="flex-1 flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-4">
        <div className="text-center max-w-md">
          <p className="text-7xl font-bold text-neutral-200 dark:text-neutral-700 mb-4">404</p>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Page not found
          </h1>
          <p className="text-neutral-500 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Go home
            </Link>
            <Link
              href="/track"
              className="inline-flex items-center justify-center px-6 py-2.5 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-colors"
            >
              Track a shipment
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
