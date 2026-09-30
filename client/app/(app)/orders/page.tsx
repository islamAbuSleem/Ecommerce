import { OrdersGuard } from "./guard";
import { OrdersList } from "./components/OrdersList";

export default function OrdersPage() {
  return (
    <OrdersGuard>
      <OrdersList />
    </OrdersGuard>
  );
}
