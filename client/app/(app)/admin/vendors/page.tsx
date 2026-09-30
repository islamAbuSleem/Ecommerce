import { AdminGuard } from "../guard";
import { AdminVendorsView } from "./components/AdminVendorsView";

export default function AdminVendorsPage() {
  return (
    <AdminGuard>
      <AdminVendorsView />
    </AdminGuard>
  );
}
