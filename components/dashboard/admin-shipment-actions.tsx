"use client";

import Link from "next/link";
import { ExternalLink, Eye } from "lucide-react";

interface Props {
  shipmentId: string;
  currentStatus: string;
}

export function AdminShipmentActions({ shipmentId, currentStatus }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/dashboard/admin/shipments/${shipmentId}`}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-blue-200 dark:border-blue-800"
      >
        <Eye className="w-3 h-3" />
        Manage
      </Link>
      <Link
        href={`/track/${shipmentId}`}
        target="_blank"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-lg transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
      </Link>
    </div>
  );
}
