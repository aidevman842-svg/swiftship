import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  pending: {
    label: "Pending Pickup",
    classes: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  picked_up: {
    label: "Picked Up",
    classes: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  in_transit: {
    label: "In Transit",
    classes: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    dot: "bg-blue-600 animate-pulse",
  },
  customs_clearance: {
    label: "Customs Clearance",
    classes: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800",
    dot: "bg-violet-500",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    classes: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    dot: "bg-green-500 animate-pulse",
  },
  delivered: {
    label: "Delivered",
    classes: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    dot: "bg-green-600",
  },
  on_hold: {
    label: "On Hold",
    classes: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    dot: "bg-red-500",
  },
  delayed: {
    label: "Delayed",
    classes: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
    dot: "bg-orange-500",
  },
  returned: {
    label: "Returned to Sender",
    classes: "bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700",
    dot: "bg-neutral-500",
  },
} as const;

interface Props {
  status: string;
  size?: "default" | "lg";
  className?: string;
}

export function ShipmentStatusBadge({ status, size = "default", className }: Props) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border rounded-full",
        size === "lg" ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs",
        config.classes,
        className
      )}
    >
      <span className={cn("rounded-full", size === "lg" ? "w-2 h-2" : "w-1.5 h-1.5", config.dot)} />
      {config.label}
    </span>
  );
}
