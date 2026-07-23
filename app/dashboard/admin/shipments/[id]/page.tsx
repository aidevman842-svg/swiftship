import { getShipmentByTrackingNumber, getShipmentEvents } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import { ShipmentStatusBadge } from "@/components/tracking/shipment-status-badge";
import { ShipmentTimeline } from "@/components/tracking/shipment-timeline";
import { HoldToggle } from "@/components/dashboard/hold-toggle";
import { AdminStatusControls } from "@/components/dashboard/admin-status-controls";
import { AdminPaymentControls } from "@/components/dashboard/admin-payment-controls";
import { ArrowLeft, Package, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Shipment ${id.toUpperCase()} — Admin — SwiftShip` };
}

export default async function AdminShipmentDetailPage({ params }: Props) {
  const { id } = await params;
  const [shipment, events] = await Promise.all([
    getShipmentByTrackingNumber(id.toUpperCase()),
    // events fetched after we have shipment id
    getShipmentByTrackingNumber(id.toUpperCase()).then((s) =>
      s ? getShipmentEvents(s.id) : []
    ),
  ]);

  if (!shipment) notFound();

  const paymentColors: Record<string, string> = {
    paid: "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    unpaid: "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    on_hold: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <Link
        href="/dashboard/admin/shipments"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        All Shipments
      </Link>

      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-medium mb-1">Tracking Number</p>
            <h1 className="text-2xl font-bold font-mono text-neutral-900 dark:text-white">
              {shipment.tracking_number}
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <ShipmentStatusBadge status={shipment.status} size="lg" />
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${paymentColors[shipment.payment_status] ?? paymentColors.unpaid}`}>
                Payment: {shipment.payment_status}
              </span>
              {shipment.amount && (
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  ${Number(shipment.amount).toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <HoldToggle
            trackingNumber={shipment.tracking_number}
            initialStatus={shipment.status}
            holdReason={shipment.hold_reason}
            variant="full"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — controls + timeline */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status update */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-5">
            <h2 className="font-semibold text-neutral-900 dark:text-white mb-4">Update status</h2>
            <AdminStatusControls
              trackingNumber={shipment.tracking_number}
              currentStatus={shipment.status}
            />
          </div>

          {/* Timeline */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-neutral-900 dark:text-white">Tracking timeline</h2>
              <Link href={`/track/${shipment.tracking_number}`} className="text-xs text-blue-600 hover:underline" target="_blank">
                Public view ↗
              </Link>
            </div>
            <ShipmentTimeline events={events} />
          </div>
        </div>

        {/* Right — info panels */}
        <div className="space-y-5">
          {/* Shipment info */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-5 space-y-4">
            <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-neutral-400" />
              Shipment Info
            </h3>
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium mb-1">Sender</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">{shipment.sender_name}</p>
              <p className="text-xs text-neutral-500">{shipment.sender_address}</p>
              {shipment.sender_phone && <p className="text-xs text-neutral-400">{shipment.sender_phone}</p>}
            </div>
            <div className="border-t border-neutral-100 dark:border-neutral-700" />
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium mb-1">Receiver</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">{shipment.receiver_name}</p>
              <p className="text-xs text-neutral-500">{shipment.receiver_address}</p>
              {shipment.receiver_phone && <p className="text-xs text-neutral-400">{shipment.receiver_phone}</p>}
            </div>
            <div className="border-t border-neutral-100 dark:border-neutral-700" />
            <div className="grid grid-cols-2 gap-3">
              {shipment.package_type && (
                <div>
                  <p className="text-xs text-neutral-500">Type</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white capitalize">{shipment.package_type}</p>
                </div>
              )}
              {shipment.weight && (
                <div>
                  <p className="text-xs text-neutral-500">Weight</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{shipment.weight} kg</p>
                </div>
              )}
              {shipment.dimensions && (
                <div className="col-span-2">
                  <p className="text-xs text-neutral-500">Dimensions</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{shipment.dimensions}</p>
                </div>
              )}
              {shipment.description && (
                <div className="col-span-2">
                  <p className="text-xs text-neutral-500">Contents</p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{shipment.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Route */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-5">
            <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-neutral-400" />
              Route
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex-1">
                <p className="text-xs text-neutral-500">Origin</p>
                <p className="font-medium text-neutral-900 dark:text-white">{shipment.origin}</p>
              </div>
              <span className="text-neutral-300">→</span>
              <div className="flex-1 text-right">
                <p className="text-xs text-neutral-500">Destination</p>
                <p className="font-medium text-neutral-900 dark:text-white">{shipment.destination}</p>
              </div>
            </div>
            {shipment.estimated_delivery && (
              <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700">
                <p className="text-xs text-neutral-500">Est. Delivery</p>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {new Date(shipment.estimated_delivery).toLocaleDateString("en-US", {
                    weekday: "short", month: "long", day: "numeric", year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-5">
            <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-neutral-400" />
              Payment
            </h3>
            <AdminPaymentControls
              trackingNumber={shipment.tracking_number}
              currentPaymentStatus={shipment.payment_status}
              amount={shipment.amount}
              shipmentStatus={shipment.status}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
