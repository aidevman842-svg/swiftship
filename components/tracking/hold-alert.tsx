import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  reason?: string | null;
  className?: string;
}

export function HoldAlert({ reason, className }: Props) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-2xl p-5",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
      </div>
      <div>
        <h3 className="font-semibold text-red-700 dark:text-red-400">
          Shipment is currently on hold
        </h3>
        <p className="text-sm text-red-600 dark:text-red-500 mt-1">
          {reason || "Your shipment has been placed on hold. Please contact our support team for further details."}
        </p>
        <p className="text-xs text-red-500 dark:text-red-600 mt-2">
          Support: +1 (800) 794-8374 · support@swiftship.com
        </p>
      </div>
    </div>
  );
}
