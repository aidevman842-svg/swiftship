import { Calendar, Weight, Box, CreditCard } from "lucide-react";
import type { Shipment } from "@/lib/supabase/queries";

interface Props {
  shipment: Shipment;
}

export function ShipmentInfoCard({ shipment }: Props) {
  const paymentColors: Record<string, string> = {
    paid: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
    unpaid: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
    on_hold: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
  };

  const paymentLabel: Record<string, string> = {
    paid: "Paid",
    unpaid: "Unpaid",
    on_hold: "Payment on Hold",
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-5 space-y-5">
      <h3 className="font-semibold text-neutral-900 dark:text-white">
        Shipment details
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium mb-1">From</p>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">{shipment.sender_name}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{shipment.sender_address}</p>
          {shipment.sender_phone && (
            <p className="text-xs text-neutral-400 mt-0.5">{shipment.sender_phone}</p>
          )}
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-700" />

        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium mb-1">To</p>
          <p className="text-sm font-semibold text-neutral-900 dark:text-white">{shipment.receiver_name}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{shipment.receiver_address}</p>
          {shipment.receiver_phone && (
            <p className="text-xs text-neutral-400 mt-0.5">{shipment.receiver_phone}</p>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-100 dark:border-neutral-700" />

      <div className="grid grid-cols-2 gap-3">
        {shipment.package_type && (
          <div className="flex items-start gap-2">
            <Box className="w-4 h-4 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-xs text-neutral-500">Package type</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white capitalize">
                {shipment.package_type}
              </p>
            </div>
          </div>
        )}
        {shipment.weight && (
          <div className="flex items-start gap-2">
            <Weight className="w-4 h-4 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-xs text-neutral-500">Weight</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {shipment.weight} kg
              </p>
            </div>
          </div>
        )}
        {shipment.estimated_delivery && (
          <div className="flex items-start gap-2 col-span-2">
            <Calendar className="w-4 h-4 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-xs text-neutral-500">Estimated delivery</p>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {new Date(shipment.estimated_delivery).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-neutral-100 dark:border-neutral-700" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Payment</span>
        </div>
        <div className="flex items-center gap-2">
          {shipment.amount && (
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              ${Number(shipment.amount).toFixed(2)}
            </span>
          )}
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            paymentColors[shipment.payment_status] ?? paymentColors.unpaid
          }`}>
            {paymentLabel[shipment.payment_status] ?? shipment.payment_status}
          </span>
        </div>
      </div>

      {shipment.status === "on_hold" && shipment.payment_status === "unpaid" && (
        <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
          <span>⚠️</span>
          Payment required to release this shipment. Contact support to resolve.
        </div>
      )}
    </div>
  );
}
