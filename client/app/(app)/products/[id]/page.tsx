"use client";

import { use } from "react";
import { ProductDetail } from "./components/ProductDetail";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // Remount on id change so product/error/quantity state starts fresh for each listing.
  return <ProductDetail key={id} id={id} />;
}
