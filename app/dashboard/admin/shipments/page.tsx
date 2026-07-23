import { getAllShipments } from "@/lib/supabase/queries";
import { ShipmentStatusBadge } from "@/components/tracking/shipment-status-badge";
import { HoldToggle } from "@/components/dashboard/hold-toggle";
import { AlertTriangle, ArrowUpRight, Eye } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "All Shipments — Admin — SwiftShip" };

export default async function AdminShipmentsPage() {
  const shipments = await getAllShipments();
  const held = shipments.filter((s) => s.status === "on_hold");

  const paymentColor: Record<string, string> = {
    paid: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
    unpaid: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
    on_hold: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            All Shipments
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            {shipments.length} total · {held.length} on hold
          </p>
        </div>
      </div>

      {/* Hold alerts banner */}
      {held.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-700 dark:text-red-400">
              {held.length} shipment{held.length > 1 ? "s" : ""} currently on hold
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {held.map((s) => (
              <Link
                key={s.id}
                href={`/dashboard/admin/shipments/${s.tracking_number}`}
                className="inline-flex items-center gap-1 text-xs font-mono bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-lg hover:bg-red-200 transition-colors"
              >
                {s.tracking_number}
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Shipments table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        {/* Desktop header */}
        <div className="hidden lg:grid grid-cols-[1.5fr_1fr_140px_100px_110px_200px] gap-4 px-5 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-500 uppercase tracking-wide">
          <span>Shipment</span>
          <span>Route</span>
          <span>Status</span>
          <span>Payment</span>
          <span>Est. Delivery</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
          {shipments.map((shipment) => {
            const isOnHold = shipment.status === "on_hold";

            return (
              <div
                key={shipment.id}
                className={`px-5 py-4 transition-colors ${
                  isOnHold
                    ? "bg-red-50/50 dark:bg-red-900/10"
                    : "hover:bg-neutral-50/60 dark:hover:bg-neutral-700/20"
                }`}
              >
                {/* ── Mobile layout ── */}
                <div className="lg:hidden space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
                        {shipment.tracking_number}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {shipment.origin} → {shipment.destination}
                      </p>
                    </div>
                    <ShipmentStatusBadge status={shipment.status} />
                  </div>

                  {isOnHold && shipment.hold_reason && (
                    <p className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 rounded-lg p-2.5 flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      {shipment.hold_reason}
                    </p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <HoldToggle
                      trackingNumber={shipment.tracking_number}
                      initialStatus={shipment.status}
                      holdReason={shipment.hold_reason}
                      variant="compact"
                    />
                    <Link
                      href={`/dashboard/admin/shipments/${shipment.tracking_number}`}
                      className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-400"
                    >
                      <Eye className="w-3 h-3" />
                      Details
                    </Link>
                  </div>
                </div>

                {/* ── Desktop layout ── */}
                <div className="hidden lg:grid grid-cols-[1.5fr_1fr_140px_100px_110px_200px] gap-4 items-center">
                  {/* Shipment */}
                  <div>
                    <p className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
                      {shipment.tracking_number}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">{shipment.sender_name}</p>
                    {isOnHold && shipment.hold_reason && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1 line-clamp-1">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                        {shipment.hold_reason}
                      </p>
                    )}
                  </div>

                  {/* Route */}
                  <div>
                    <p className="text-sm text-neutral-900 dark:text-white">{shipment.origin}</p>
                    <p className="text-xs text-neutral-500">→ {shipment.destination}</p>
                  </div>

                  {/* Status */}
                  <ShipmentStatusBadge status={shipment.status} />

                  {/* Payment */}
                  <div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        paymentColor[shipment.payment_status] ?? paymentColor.unpaid
                      }`}
                    >
                      {shipment.payment_status}
                    </span>
                    {shipment.amount && (
                      <p className="text-xs text-neutral-400 mt-0.5">
                        ${Number(shipment.amount).toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Est. delivery */}
                  <p className="text-sm text-neutral-900 dark:text-white whitespace-nowrap">
                    {shipment.estimated_delivery
                      ? new Date(shipment.estimated_delivery).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </p>

                  {/* Actions — Hold toggle + detail link side by side */}
                  <div className="flex items-center gap-2">
                    <HoldToggle
                      trackingNumber={shipment.tracking_number}
                      initialStatus={shipment.status}
                      holdReason={shipment.hold_reason}
                      variant="compact"
                    />
                    <Link
                      href={`/dashboard/admin/shipments/${shipment.tracking_number}`}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-neutral-500 dark:text-neutral-400"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
