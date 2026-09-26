"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { Icon } from "@/components/ui/components/Icon";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "/seller/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-logo-gradient">
            <Icon size="lg" className="text-white">token</Icon>
          </span>
          <span className="text-lg font-semibold text-text-darkest">Marketplace</span>
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-accent" : "text-text-dark hover:text-text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {user ? (
            <span className="flex items-center gap-3">
              <span className="text-sm font-medium text-text-dark">{user.fullName || user.email}</span>
              <button
                type="button"
                onClick={() => void logout()}
                className="text-sm font-medium text-text-dark hover:text-text-primary transition-colors"
              >
                Logout
              </button>
            </span>
          ) : (
            !loading && (
              <Link
                href="/login"
                className="text-sm font-medium text-text-dark hover:text-text-primary transition-colors"
              >
                Sign in
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
