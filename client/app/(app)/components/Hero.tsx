"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { Icon } from "@/components/ui/components/Icon";

const METRICS: { value: string; label: string; accent?: string }[] = [
  { value: "Direct-from-maker", label: "Independent Studios" },
  { value: "Escrow protected", label: "Verified Transactions" },
  { value: "100%", label: "Escrow Protected", accent: "text-tertiary" },
];

export function Hero() {
  const { user } = useAuth();
  const ctaHref = user ? "/products" : "/register";

  return (
    <section className="relative w-full overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm lg:rounded-3xl lg:p-10">
      <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-32 w-32 rounded-full bg-secondary-container/10 blur-xl" />
      <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <div className="flex flex-col items-start lg:col-span-7">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary-fixed px-3 py-1 text-label-sm text-on-primary-fixed">
            <Icon size="sm" className="text-primary">auto_awesome</Icon>
            <span>Curated Edition Autumn / Winter 2025</span>
          </span>
          <h1 className="text-headline-lg-mobile tracking-tight text-on-surface lg:text-headline-lg">
            Crafted by Hand,
            <br />
            <span className="font-normal text-primary italic">Curated for Life</span>
          </h1>
          <p className="mt-3 max-w-xl text-body-md leading-relaxed text-on-surface-variant">
            Discover authenticated heritage craft and contemporary studio objects directly from
            sovereign artisans. Every transaction supports independent creators through verified
            escrow.
          </p>
          <div className="mt-6 flex w-full flex-wrap items-center gap-3 sm:w-auto">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-label-md text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-95"
            >
              <span>Explore Collections</span>
              <Icon size="md">arrow_forward</Icon>
            </Link>
            <Link
              href="/#spotlight"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-surface-container-low px-5 py-3 text-label-md text-on-surface shadow-sm transition-all hover:bg-surface-container"
            >
              <Icon size="md" className="text-primary">storefront</Icon>
              <span>Meet Featured Artisans</span>
            </Link>
          </div>
          <div className="grid w-full grid-cols-3 gap-4 pt-6">
            {METRICS.map(({ value, label, accent }) => (
              <div key={label} className="flex flex-col">
                <span className={`text-headline-md text-on-surface ${accent ?? ""}`}>{value}</span>
                <span className="text-caption text-on-surface-variant">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative lg:col-span-5">
          <div className="relative rounded-2xl bg-surface-container-lowest p-3 shadow-md">
            <div className="absolute -top-3 -left-3 z-20 flex items-center gap-1.5 rounded-full bg-surface-container-lowest px-3 py-1 text-label-sm font-semibold text-on-surface shadow-md">
              <Icon size="sm" className="text-tertiary-container">
                verified_user
              </Icon>
              <span>Staff Pick Collection</span>
            </div>
            <div className="group relative aspect-square overflow-hidden rounded-xl bg-surface-container">
              <Image
                alt="Wheel-thrown ceramic pour-over and cup set"
                src="https://picsum.photos/seed/hero-craft/800/800"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                priority
              />
              <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-xl bg-surface-container-lowest/90 p-3 shadow-sm backdrop-blur-md">
                <div className="min-w-0">
                  <span className="block text-caption font-semibold tracking-wider text-primary uppercase">
                    Ceramic Series 04
                  </span>
                  <span className="block truncate text-headline-sm text-on-surface">
                    Pour-Over and Mug Pair
                  </span>
                  <span className="block text-body-sm text-on-surface-variant">
                    Terra and Kiln, Oregon
                  </span>
                </div>
                <div className="shrink-0 text-right">
                  <span className="block text-headline-md text-on-surface">$64.00</span>
                  <span className="block text-caption text-secondary">In Stock</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-1 pt-3 text-on-surface-variant">
              <span className="flex items-center gap-1.5 text-caption">
                <Icon size="sm" className="text-primary">handshake</Icon>
                Direct Studio Payout Guaranteed
              </span>
              <Link
                href="/products"
                aria-label="Browse the staff pick collection"
                className="rounded-lg bg-primary p-2 text-on-primary transition-colors hover:bg-primary-container"
              >
                <Icon size="md">add_shopping_cart</Icon>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
