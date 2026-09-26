"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function QuickSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2" role="search">
      <div className="relative flex flex-1 items-center">
        <span className="material-symbols-outlined pointer-events-none absolute left-3 text-[20px] text-on-surface-variant">
          search
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search independent studios, artisans..."
          aria-label="Search products"
          className="h-11 w-full rounded-xl bg-surface-container-lowest py-2 pr-4 pl-10 text-body-md text-on-surface shadow-sm placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        aria-label="Submit search"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest text-on-surface shadow-sm transition-all hover:bg-surface-container-low active:scale-95"
      >
        <span className="material-symbols-outlined text-[20px]">search</span>
      </button>
    </form>
  );
}
