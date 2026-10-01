"use client";

import { useEffect, useState } from "react";
import {
  commissionService,
  type CommissionBreakdown,
} from "@/services/commission.service";
import { formatCurrency } from "./dashboardConfig";

export function CommissionOverview() {
  const [data, setData] = useState<CommissionBreakdown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    commissionService
      .admin()
      .then((next) => {
        if (cancelled) return;
        setData(next);
      })
      .catch(() => {
        if (cancelled) return;
        console.error("[admin/commission]");
        setError("We couldn't load commission. Try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-surface-container-lowest p-6 text-center shadow-sm">
        <p className="text-body-sm text-on-surface-variant">{error}</p>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setRetryKey((key) => key + 1);
          }}
          className="rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary transition-colors hover:bg-primary-container"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="h-40 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm"
        aria-label="Loading commission"
      />
    );
  }

  return (
    <section className="flex flex-col rounded-xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm text-on-surface">Commission collected</h2>
        <span className="text-caption text-on-surface-variant">
          {Math.round(data.rate * 100)}% platform rate
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div>
          <p className="text-caption text-on-surface-variant">Gross sales</p>
          <p className="text-headline-sm text-on-surface">{formatCurrency(data.gross)}</p>
        </div>
        <div>
          <p className="text-caption text-on-surface-variant">Commission</p>
          <p className="text-headline-sm text-on-surface">{formatCurrency(data.commission)}</p>
        </div>
        <div>
          <p className="text-caption text-on-surface-variant">To sellers</p>
          <p className="text-headline-sm text-on-surface">{formatCurrency(data.net)}</p>
        </div>
      </div>
      <p className="mt-2 text-caption text-on-surface-variant">
        Across {data.orderCount} {data.orderCount === 1 ? "order" : "orders"}.
      </p>
    </section>
  );
}
