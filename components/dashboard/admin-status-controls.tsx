"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateShipmentStatus } from "@/lib/supabase/actions";

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "picked_up", label: "Picked Up" },
  { value: "in_transit", label: "In Transit" },
  { value: "customs_clearance", label: "Customs Clearance" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "delayed", label: "Delayed" },
  { value: "returned", label: "Returned" },
];

interface Props {
  trackingNumber: string;
  currentStatus: string;
}

export function AdminStatusControls({ trackingNumber, currentStatus }: Props) {
  const [activeStatus, setActiveStatus] = useState(currentStatus);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === activeStatus) return;
    setError(null);
    setPendingStatus(newStatus);
    startTransition(async () => {
      const result = await updateShipmentStatus(trackingNumber, newStatus);
      if (result.error) {
        setError(result.error);
      } else {
        setActiveStatus(newStatus);
      }
      setPendingStatus(null);
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {STATUSES.map(({ value, label }) => {
          const isActive = activeStatus === value;
          const isLoading = pendingStatus === value;

          return (
            <button
              key={value}
              onClick={() => handleStatusChange(value)}
              disabled={isPending}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                isActive
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400",
                isPending && !isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {isActive && !isLoading && <Check className="w-3 h-3" />}
              {isLoading && (
                <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
              )}
              {label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
