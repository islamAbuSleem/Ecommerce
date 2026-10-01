"use client";

import { useEffect, useState } from "react";
import { commissionService } from "@/services/commission.service";
import { Icon } from "@/components/ui/components/Icon";
import { formatCurrency } from "./dashboardConfig";

export function EarningsCard() {
  const [net, setNet] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    commissionService
      .seller()
      .then((next) => {
        if (cancelled) return;
        setNet(next.net);
        setRate(next.rate);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-caption uppercase tracking-wider text-on-surface-variant">
          Net to you
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-secondary">
          <Icon size="sm" aria-hidden="true">account_balance</Icon>
        </span>
      </div>
      <div className="mt-2">
        <p className="text-headline-lg tracking-tight text-on-surface">
          {net === null ? "—" : formatCurrency(net)}
        </p>
        <p className="mt-0.5 text-caption text-on-surface-variant">
          {rate === null ? "Loading commission" : `${Math.round(rate * 100)}% platform rate`}
        </p>
      </div>
    </div>
  );
}
