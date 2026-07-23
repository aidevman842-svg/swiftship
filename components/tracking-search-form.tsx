"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackingSearchFormProps {
  size?: "default" | "lg";
  className?: string;
}

export function TrackingSearchForm({
  size = "default",
  className,
}: TrackingSearchFormProps) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = trackingNumber.trim().toUpperCase();
    if (trimmed) {
      router.push(`/track/${trimmed}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div
        className={cn(
          "flex gap-2 bg-white dark:bg-neutral-900 rounded-xl p-1.5 border border-neutral-200 dark:border-neutral-700 shadow-sm",
          size === "lg" && "max-w-xl shadow-lg"
        )}
      >
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter tracking number (e.g. SWF123456789)"
          className={cn(
            "flex-1 bg-transparent outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400 px-3",
            size === "lg" ? "text-base py-2" : "text-sm py-1.5"
          )}
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!trackingNumber.trim()}
          className={cn(
            "flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors",
            size === "lg" ? "px-6 py-2.5 text-sm" : "px-4 py-2 text-sm"
          )}
        >
          <Search className="w-4 h-4" />
          <span>Track</span>
        </button>
      </div>
    </form>
  );
}
