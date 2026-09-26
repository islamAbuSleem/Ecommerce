import { Navbar } from "@/components/layout/components/Navbar";
import { Footer } from "@/components/layout/components/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
