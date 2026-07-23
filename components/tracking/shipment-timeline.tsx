import {
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShipmentEvent } from "@/lib/supabase/queries";

const EVENT_ICON: Record<string, React.ElementType> = {
  pending: Package,
  picked_up: Truck,
  in_transit: Truck,
  customs_clearance: ShieldCheck,
  out_for_delivery: Truck,
  delivered: CheckCircle2,
  on_hold: AlertCircle,
  delayed: Clock,
  returned: RotateCcw,
};

const EVENT_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  picked_up: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  in_transit: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  customs_clearance: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  out_for_delivery: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  delivered: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  on_hold: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  delayed: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  returned: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
};

interface Props {
  events: ShipmentEvent[];
}

export function ShipmentTimeline({ events }: Props) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-10 text-neutral-400">
        <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm">No tracking events yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-700" />

      <ol className="space-y-0">
        {events.map((event, index) => {
          const Icon = EVENT_ICON[event.status] ?? Package;
          const iconClass = EVENT_COLOR[event.status] ?? EVENT_COLOR.pending;
          const isFirst = index === 0;

          return (
            <li key={event.id} className={cn("relative pl-14 pb-8 last:pb-0")}>
              <div
                className={cn(
                  "absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center z-10",
                  iconClass,
                  isFirst &&
                    "ring-4 ring-offset-2 ring-blue-100 dark:ring-blue-900/40 dark:ring-offset-neutral-800"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div
                className={cn(
                  "rounded-xl p-4 border transition-colors",
                  isFirst
                    ? "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/40"
                    : "bg-neutral-50 border-neutral-200 dark:bg-neutral-800/40 dark:border-neutral-700"
                )}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p
                      className={cn(
                        "font-semibold capitalize text-sm",
                        isFirst
                          ? "text-blue-700 dark:text-blue-400"
                          : "text-neutral-900 dark:text-white"
                      )}
                    >
                      {event.status.replace(/_/g, " ")}
                    </p>
                    {event.description && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                        {event.description}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                        <span>📍</span>
                        {event.location}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-neutral-500 whitespace-nowrap">
                      {new Date(event.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {new Date(event.created_at).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                {isFirst && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
                    Latest update
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
