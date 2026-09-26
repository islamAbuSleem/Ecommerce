export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} Marketplace. All rights reserved.
        </p>
        <p className="text-sm text-text-muted">Multi-vendor ecommerce platform</p>
      </div>
    </footer>
  );
}
