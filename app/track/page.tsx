import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TrackingSearchForm } from "@/components/tracking-search-form";
import { AuthButton } from "@/components/auth-button";
import { Suspense } from "react";
import { MapPin, Clock, Package } from "lucide-react";

export const metadata = {
  title: "Track Your Shipment — SwiftShip Logistics",
};

export default function TrackPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader authSlot={<Suspense><AuthButton /></Suspense>} />

      <main className="flex-1 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-5">
              <Package className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              Track your shipment
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">
              Enter your tracking number to see real-time status and location updates.
            </p>
          </div>

          <TrackingSearchForm size="lg" className="max-w-xl mx-auto" />

          <div className="mt-10 grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: Clock,
                title: "Real-time updates",
                desc: "Status refreshes as your shipment moves through our network.",
              },
              {
                icon: MapPin,
                title: "Location history",
                desc: "See every scan and facility your package has passed through.",
              },
              {
                icon: Package,
                title: "Full details",
                desc: "Weight, dimensions, sender, and estimated delivery at a glance.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white dark:bg-neutral-800 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700 text-center"
              >
                <Icon className="w-6 h-6 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1">
                  {title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
