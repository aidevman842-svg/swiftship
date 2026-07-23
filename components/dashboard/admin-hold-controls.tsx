"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { holdShipment, releaseShipment } from "@/lib/supabase/actions";

const HOLD_REASONS = [
  "Payment outstanding — invoice not settled",
  "Customs inspection required",
  "Documentation incomplete or missing",
  "Security screening in progress",
  "Customer requested hold",
  "Address verification required",
  "Other",
];

interface Props {
  trackingNumber: string;
  currentStatus: string;
  holdReason?: string | null;
}

export function AdminHoldControls({ trackingNumber, currentStatus, holdReason }: Props) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isOnHold = currentStatus === "on_hold";

  const handleHold = () => {
    const reason = selectedReason === "Other" ? customReason : selectedReason;
    if (!reason) return;
    setError(null);
    startTransition(async () => {
      const result = await holdShipment(trackingNumber, reason);
      if (result.error) {
        setError(result.error);
      } else {
        setShowDialog(false);
        setSelectedReason("");
        setCustomReason("");
      }
    });
  };

  const handleRelease = () => {
    setError(null);
    startTransition(async () => {
      const result = await releaseShipment(trackingNumber);
      if (result.error) setError(result.error);
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2 items-start sm:items-end">
        {isOnHold ? (
          <button
            onClick={handleRelease}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isPending ? "Releasing…" : "Release Shipment"}
          </button>
        ) : (
          <button
            onClick={() => setShowDialog(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            Put on Hold
          </button>
        )}

        {isOnHold && holdReason && (
          <p className="text-xs text-red-600 dark:text-red-400 max-w-xs text-right">
            {holdReason}
          </p>
        )}

        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>

      {/* Hold dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-neutral-900 dark:text-white">Hold Shipment</h2>
                <p className="text-sm text-neutral-500 mt-0.5">
                  Select a reason — this will be visible to the customer.
                </p>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {HOLD_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="holdReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{reason}</span>
                </label>
              ))}
            </div>

            {selectedReason === "Other" && (
              <textarea
                className="w-full mt-3 px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                placeholder="Describe the reason for holding this shipment…"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}

            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleHold}
                disabled={isPending || !selectedReason || (selectedReason === "Other" && !customReason.trim())}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isPending ? "Applying…" : "Confirm Hold"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
