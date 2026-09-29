import { SellerGuard } from "../guard";
import { SellerDashboard } from "./components/SellerDashboard";

export default function SellerDashboardPage() {
  return (
    <SellerGuard>
      <SellerDashboard />
    </SellerGuard>
  );
}
