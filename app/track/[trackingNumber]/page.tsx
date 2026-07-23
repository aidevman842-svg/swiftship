import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TrackingSearchForm } from "@/components/tracking-search-form";
import { ShipmentTimeline } from "@/components/tracking/shipment-timeline";
import { ShipmentInfoCard } from "@/components/tracking/shipment-info-card";
import { ShipmentStatusBadge } from "@/components/tracking/shipment-status-badge";
import { HoldAlert } from "@/components/tracking/hold-alert";
import { AuthButton } from "@/components/auth-button";
import { getShipmentByTrackingNumber, getShipmentEvents } from "@/lib/supabase/queries";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
  params: Promise<{ trackingNumber: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { trackingNumber } = await params;
  return {
    title: `Tracking ${trackingNumber.toUpperCase()} — SwiftShip Logistics`,
  };
}

export default async function TrackingResultPage({ params }: Props) {
  const { trackingNumber } = await params;
  const upper = trackingNumber.toUpperCase();

  const shipment = await getShipmentByTrackingNumber(upper);

  if (!shipment) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader authSlot={<Suspense><AuthButton /></Suspense>} />
        <main className="flex-1 bg-neutral-50 dark:bg-neutral-900">
          <div className="max-w-3xl mx-auto px-4 py-20 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Tracking number not found
            </h1>
            <p className="text-neutral-500 mb-8">
              <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">
                {upper}
              </span>{" "}
              doesn&apos;t match any shipment in our system. Double-check the
              number and try again.
            </p>
            <TrackingSearchForm className="max-w-xl mx-auto" />
            <p className="text-xs text-neutral-400 mt-4">
              Try demo tracking numbers: SWF100001, SWF100002, SWF100003
            </p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const events = await getShipmentEvents(shipment.id);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader authSlot={<Suspense><AuthButton /></Suspense>} />

      <main className="flex-1 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
            <Link
              href="/track"
              className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Track another shipment
            </Link>
          </div>

          {/* Header card */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">
                  Tracking Number
                </p>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white font-mono">
                  {shipment.tracking_number}
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                  {shipment.origin} → {shipment.destination}
                </p>
              </div>
              <ShipmentStatusBadge status={shipment.status} size="lg" />
            </div>
            <div className="mt-6">
              <ShipmentProgressBar status={shipment.status} />
            </div>
          </div>

          {/* Hold alert */}
          {shipment.status === "on_hold" && (
            <HoldAlert reason={shipment.hold_reason} className="mb-6" />
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Timeline */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6">
                <h2 className="font-semibold text-neutral-900 dark:text-white mb-6">
                  Shipment progress
                </h2>
                <ShipmentTimeline events={events} />
              </div>
            </div>

            {/* Side info */}
            <div className="space-y-5">
              <ShipmentInfoCard shipment={shipment} />
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-5">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  Track another shipment
                </p>
                <TrackingSearchForm />
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

const stages = [
  "pending",
  "picked_up",
  "in_transit",
  "customs_clearance",
  "out_for_delivery",
  "delivered",
];

const stageLabels: Record<string, string> = {
  pending: "Pending",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  customs_clearance: "Customs",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

function ShipmentProgressBar({ status }: { status: string }) {
  const currentIndex = stages.indexOf(status);
  const isHeld =
    status === "on_hold" || status === "delayed" || status === "returned";

  return (
    <div>
      <div className="flex items-center">
        {stages.map((stage, i) => {
          const done = !isHeld && i <= currentIndex;
          const active = !isHeld && i === currentIndex;
          const isLast = i === stages.length - 1;

          return (
            <div key={stage} className="flex items-center flex-1 last:flex-none">
              <div
                className={`w-3 h-3 rounded-full border-2 transition-colors flex-shrink-0 ${
                  isHeld && i === currentIndex
                    ? "bg-red-500 border-red-500"
                    : active
                    ? "bg-blue-600 border-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/40"
                    : done
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                }`}
              />
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-1 ${
                    done && i < currentIndex
                      ? "bg-blue-600"
                      : "bg-neutral-200 dark:bg-neutral-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex mt-2">
        {stages.map((stage, i) => {
          const isLast = i === stages.length - 1;
          return (
            <div
              key={stage}
              className={`flex-1 last:flex-none text-[10px] font-medium ${
                i === currentIndex
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-neutral-400"
              } ${
                i === 0 ? "text-left" : isLast ? "text-right" : "text-center"
              }`}
            >
              {stageLabels[stage]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
