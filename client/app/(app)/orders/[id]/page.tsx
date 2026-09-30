"use client";

import { use } from "react";
import { OrdersGuard } from "../guard";
import { OrderDetail } from "./components/OrderDetail";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <OrdersGuard>
      <OrderDetail key={id} orderId={id} />
    </OrdersGuard>
  );
}
