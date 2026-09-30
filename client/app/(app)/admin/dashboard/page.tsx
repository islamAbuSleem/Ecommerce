import { AdminGuard } from "../guard";
import { AdminDashboard } from "./components/AdminDashboard";

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}
