import {
  Package,
  Truck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getAllShipments, getCurrentUser } from "@/lib/supabase/queries";
import { ShipmentStatusBadge } from "@/components/tracking/shipment-status-badge";
import { TrackingSearchForm } from "@/components/tracking-search-form";

export const metadata = { title: "Dashboard — SwiftShip" };

export default async function DashboardPage() {
  const [shipments, user] = await Promise.all([
    getAllShipments(),
    getCurrentUser(),
  ]);

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter(
      (s) => s.status === "in_transit" || s.status === "out_for_delivery"
    ).length,
    onHold: shipments.filter((s) => s.status === "on_hold").length,
    delivered: shipments.filter((s) => s.status === "delivered").length,
  };

  const recent = shipments.slice(0, 4);
  const greeting = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
          Welcome back, {greeting} 👋
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Here&apos;s a live summary of your shipments.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Shipments", value: stats.total, icon: Package, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "In Transit", value: stats.inTransit, icon: Truck, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          {
            label: "On Hold", value: stats.onHold, icon: AlertTriangle,
            color: stats.onHold > 0 ? "text-red-600" : "text-neutral-400",
            bg: stats.onHold > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-neutral-100 dark:bg-neutral-800",
          },
          { label: "Delivered", value: stats.delivered, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-neutral-800 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-neutral-500 font-medium">{label}</p>
                <p className={`text-2xl font-bold mt-1 ${color.includes("red") ? color : "text-neutral-900 dark:text-white"}`}>
                  {value}
                </p>
              </div>
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hold alert */}
      {stats.onHold > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              {stats.onHold} shipment{stats.onHold > 1 ? "s" : ""} on hold
            </p>
            <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">
              Action required — contact support or resolve payment to release.
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent shipments */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900 dark:text-white">Recent shipments</h3>
            <Link href="/dashboard/shipments" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-8 text-center text-neutral-400">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No shipments yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((shipment) => (
                <Link
                  key={shipment.id}
                  href={`/track/${shipment.tracking_number}`}
                  className="block bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-semibold text-neutral-900 dark:text-white">
                          {shipment.tracking_number}
                        </span>
                        <ShipmentStatusBadge status={shipment.status} />
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        {shipment.origin} → {shipment.destination}
                      </p>
                      {shipment.status === "on_hold" && shipment.hold_reason && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1 line-clamp-1">
                          ⚠️ {shipment.hold_reason}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {shipment.estimated_delivery && (
                        <p className="text-xs text-neutral-400">
                          Est.{" "}
                          {new Date(shipment.estimated_delivery).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      )}
                      {shipment.amount && (
                        <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
                          ${Number(shipment.amount).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick track */}
        <div>
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Quick track</h3>
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5">
            <p className="text-sm text-neutral-500 mb-4">
              Track any shipment by its tracking number.
            </p>
            <TrackingSearchForm />
            {shipments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
                <p className="text-xs text-neutral-400 mb-2">Your shipments:</p>
                <div className="flex flex-wrap gap-2">
                  {shipments.slice(0, 4).map((s) => (
                    <Link
                      key={s.id}
                      href={`/track/${s.tracking_number}`}
                      className="text-xs font-mono bg-neutral-100 dark:bg-neutral-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded transition-colors"
                    >
                      {s.tracking_number}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
