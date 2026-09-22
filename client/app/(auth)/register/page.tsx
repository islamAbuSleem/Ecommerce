"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthShell, type AuthMode } from "@/components/auth/AuthShell";
import { useAuth } from "@/components/auth/AuthContext";
import { authService } from "@/services/auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const BRAND = {
  headline: "Begin your journey through authenticated craft and curated provenance.",
  subcopy: "Join a global collective of master artisans and discerning patrons. Every transaction secured by cryptographic escrow and studio lineage verification.",
  quote: "The Aura registry gave our Kyoto workshop instant global reach, with verified provenance for every piece leaving our studio.",
  name: "Yuki Tanaka",
  shop: "Tanaka Ceramics, Kyoto",
};

const TITLES = {
  login: {
    title: "Welcome Back",
    subtitle: "Enter your credentials to access authenticated craft registries.",
  },
  register: {
    title: "Welcome to Aura",
    subtitle: "Create your artisan or patron account to get started.",
  },
};

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [mode, setMode] = useState<AuthMode>("register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await authService.login(email, password);
      } else {
        await authService.register({ fullName, email, password, role });
      }

      await refresh();
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const helper =
    mode === "register" ? (
      <>
        Already registered?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Sign in to your portal
        </Link>
      </>
    ) : (
      <>
        New to Aura?{" "}
        <button type="button" onClick={() => setMode("register")} className="text-primary font-semibold hover:underline">
          Create an artisan or patron account
        </button>
      </>
    );

  return (
    <AuthShell mode={mode} onModeChange={setMode} brand={BRAND} titles={TITLES} helper={helper} apiUrl={API_URL}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-error">{error}</p>}

        {mode === "register" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-on-surface" htmlFor="fullName">Full Legal Name</label>
          <Input
            id="fullName"
            type="text"
            placeholder="Evelyn de Varis"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon="badge"
            iconPosition="right"
            required
          />
        </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-on-surface" htmlFor="email">Patron or Studio Email</label>
          <Input
            id="email"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="mail"
            iconPosition="right"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-on-surface" htmlFor="password">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full h-11 px-3.5 pr-10 rounded-lg bg-surface-container-low text-on-surface text-body-md placeholder:text-outline outline-none focus:bg-surface-container transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-2 p-1 text-on-surface-variant hover:text-on-surface"
              aria-label="Toggle password visibility"
            >
              <span className="material-symbols-outlined text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>

        {mode === "register" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-label-md text-on-surface" htmlFor="role">Account Type</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "buyer" | "seller")}
              className="w-full h-11 px-3 rounded-lg bg-surface-container-low text-on-surface text-body-md border-0 outline-none focus:bg-surface-container transition-all cursor-pointer"
            >
              <option value="buyer">Buyer — Browse and purchase</option>
              <option value="seller">Seller — List and sell products</option>
            </select>
            <p className="text-caption text-on-surface-variant">
              Sellers require admin approval before listing products.
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={loading}
          icon="arrow_forward"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
              <span>Creating Account...</span>
            </>
          ) : (
            <span>{mode === "register" ? "Create Account" : "Sign In to Aura"}</span>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
