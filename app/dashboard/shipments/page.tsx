import { getAllShipments } from "@/lib/supabase/queries";
import { ShipmentStatusBadge } from "@/components/tracking/shipment-status-badge";
import { AlertTriangle, Package, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "My Shipments — SwiftShip" };

export default async function ShipmentsPage() {
  const shipments = await getAllShipments();

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">My Shipments</h2>
        <p className="text-sm text-neutral-500 mt-0.5">
          {shipments.length} shipment{shipments.length !== 1 ? "s" : ""} in your account
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        {shipments.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">No shipments yet.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 px-5 py-3 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-500 uppercase tracking-wide">
              <span>Tracking #</span>
              <span>Route</span>
              <span>Status</span>
              <span>Est. Delivery</span>
              <span></span>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {shipments.map((shipment) => {
                const isOnHold = shipment.status === "on_hold";
                return (
                  <div
                    key={shipment.id}
                    className={`px-5 py-4 ${isOnHold ? "bg-red-50/50 dark:bg-red-900/10" : "hover:bg-neutral-50 dark:hover:bg-neutral-700/30"} transition-colors`}
                  >
                    {/* Mobile */}
                    <div className="md:hidden space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
                            {shipment.tracking_number}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {shipment.origin} → {shipment.destination}
                          </p>
                        </div>
                        <ShipmentStatusBadge status={shipment.status} />
                      </div>
                      {isOnHold && shipment.hold_reason && (
                        <div className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 rounded-lg p-2.5">
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{shipment.hold_reason}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-neutral-400">
                          {shipment.estimated_delivery
                            ? `Est: ${new Date(shipment.estimated_delivery).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                            : "—"}
                        </p>
                        <Link href={`/track/${shipment.tracking_number}`} className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                          Track <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Desktop */}
                    <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 items-center">
                      <div>
                        <p className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
                          {shipment.tracking_number}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5 capitalize">
                          {shipment.package_type ?? "—"} {shipment.weight ? `· ${shipment.weight} kg` : ""}
                        </p>
                        {isOnHold && shipment.hold_reason && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1 line-clamp-1">
                            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                            {shipment.hold_reason}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-neutral-900 dark:text-white">{shipment.origin}</p>
                        <p className="text-xs text-neutral-500">→ {shipment.destination}</p>
                      </div>
                      <ShipmentStatusBadge status={shipment.status} />
                      <div>
                        <p className="text-sm text-neutral-900 dark:text-white whitespace-nowrap">
                          {shipment.estimated_delivery
                            ? new Date(shipment.estimated_delivery).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "—"}
                        </p>
                        {shipment.amount && (
                          <p className="text-xs text-neutral-400 mt-0.5">${Number(shipment.amount).toFixed(2)}</p>
                        )}
                      </div>
                      <Link href={`/track/${shipment.tracking_number}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium">
                        Track <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
