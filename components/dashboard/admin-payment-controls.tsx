"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { updatePaymentStatus } from "@/lib/supabase/actions";

interface Props {
  trackingNumber: string;
  currentPaymentStatus: string;
  amount: number | null;
  shipmentStatus: string;
}

export function AdminPaymentControls({
  trackingNumber,
  currentPaymentStatus,
  amount,
  shipmentStatus,
}: Props) {
  const [status, setStatus] = useState(currentPaymentStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const paymentColors: Record<string, string> = {
    paid: "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    unpaid: "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    on_hold: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
  };

  const handleUpdate = (newStatus: string) => {
    setError(null);
    startTransition(async () => {
      const result = await updatePaymentStatus(trackingNumber, newStatus);
      if (result.error) {
        setError(result.error);
      } else {
        setStatus(newStatus);
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">Amount due</span>
        <span className="font-bold text-neutral-900 dark:text-white">
          {amount ? `$${Number(amount).toFixed(2)}` : "—"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">Status</span>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${paymentColors[status] ?? paymentColors.unpaid}`}>
          {status}
        </span>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => handleUpdate("paid")}
          disabled={isPending || status === "paid"}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Mark Paid
        </button>
        <button
          onClick={() => handleUpdate("unpaid")}
          disabled={isPending || status === "unpaid"}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 rounded-lg transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
          Mark Unpaid
        </button>
      </div>

      {shipmentStatus === "on_hold" && status === "unpaid" && (
        <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-2.5">
          ⚠️ Marking as paid will automatically release the shipment from hold.
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
