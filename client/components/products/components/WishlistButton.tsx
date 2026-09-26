"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/components/Icon";

export function WishlistButton() {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <button
      aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={wishlisted}
      type="button"
      onClick={() => setWishlisted((v) => !v)}
      className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center shadow-sm active:scale-90 transition-all hover:text-error ${
        wishlisted ? "text-error" : "text-on-surface-variant"
      }`}
    >
      <Icon size="sm" filled={wishlisted}>
        favorite
      </Icon>
    </button>
  );
}
