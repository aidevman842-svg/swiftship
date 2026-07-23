"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
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
  initialStatus: string;
  holdReason?: string | null;
  /** compact = small button for list rows, full = big button for detail page */
  variant?: "compact" | "full";
}

export function HoldToggle({
  trackingNumber,
  initialStatus,
  holdReason,
  variant = "full",
}: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isOnHold = status === "on_hold";

  const handleHold = () => {
    const reason = selectedReason === "Other" ? customReason.trim() : selectedReason;
    if (!reason) return;
    setError(null);
    startTransition(async () => {
      const result = await holdShipment(trackingNumber, reason);
      if (result.error) {
        setError(result.error);
      } else {
        setStatus("on_hold");
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
      if (result.error) {
        setError(result.error);
      } else {
        setStatus("in_transit");
      }
    });
  };

  const isCompact = variant === "compact";

  return (
    <>
      {/* ── Toggle button ── */}
      {isOnHold ? (
        <button
          onClick={handleRelease}
          disabled={isPending}
          title="Release from hold"
          className={
            isCompact
              ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 border border-green-300 dark:border-green-700 disabled:opacity-60 transition-colors whitespace-nowrap"
              : "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-60 transition-colors shadow-sm"
          }
        >
          {isPending ? (
            <Loader2 className={isCompact ? "w-3 h-3 animate-spin" : "w-4 h-4 animate-spin"} />
          ) : (
            <CheckCircle2 className={isCompact ? "w-3 h-3" : "w-4 h-4"} />
          )}
          {isPending ? "Releasing…" : isCompact ? "Release Hold" : "✓ Release Shipment"}
        </button>
      ) : (
        <button
          onClick={() => setShowDialog(true)}
          disabled={isPending}
          title="Put on hold"
          className={
            isCompact
              ? "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 border border-red-300 dark:border-red-700 disabled:opacity-60 transition-colors whitespace-nowrap"
              : "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white disabled:opacity-60 transition-colors shadow-sm"
          }
        >
          <AlertTriangle className={isCompact ? "w-3 h-3" : "w-4 h-4"} />
          {isCompact ? "Put on Hold" : "⚠ Put on Hold"}
        </button>
      )}

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

      {/* ── Hold reason dialog ── */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="font-bold text-neutral-900 dark:text-white">Hold Shipment</h2>
                  <p className="text-xs text-neutral-500 font-mono">{trackingNumber}</p>
                </div>
              </div>
              <button
                onClick={() => { setShowDialog(false); setSelectedReason(""); setCustomReason(""); }}
                className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Select a reason. This will be shown to the customer on their tracking page.
            </p>

            {/* Reason list */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {HOLD_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedReason === reason
                      ? "border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-700"
                      : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`holdReason-${trackingNumber}`}
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="accent-red-600"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{reason}</span>
                </label>
              ))}
            </div>

            {selectedReason === "Other" && (
              <textarea
                className="w-full mt-3 px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-red-500 resize-none text-neutral-900 dark:text-white"
                rows={3}
                placeholder="Describe the reason…"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                autoFocus
              />
            )}

            {error && (
              <p className="text-xs text-red-600 mt-2 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-700">
              <button
                onClick={() => { setShowDialog(false); setSelectedReason(""); setCustomReason(""); }}
                className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleHold}
                disabled={
                  isPending ||
                  !selectedReason ||
                  (selectedReason === "Other" && !customReason.trim())
                }
                className="px-5 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isPending ? "Applying hold…" : "Confirm Hold"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
