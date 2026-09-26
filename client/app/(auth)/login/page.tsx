"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/components/Button";
import { Input } from "@/components/ui/components/Input";
import { AuthShell, type AuthMode } from "@/components/auth/components/AuthShell";
import { EmailField } from "@/components/auth/components/EmailField";
import { PasswordField } from "@/components/auth/components/PasswordField";
import { useAuth } from "@/components/auth/AuthContext";
import { authService } from "@/services/auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const BRAND = {
  headline: "Connecting discerning patrons with master makers and authenticated heritage studios worldwide.",
  subcopy: "Every creation transacted through Aura carries cryptographic certificate of craft, studio origin audits, and multi-signature escrow clearance.",
  quote: "Aura provided our 4th-generation atelier with direct global patrons, guaranteeing fair settlement before raw firing began.",
  name: "Tatsuo Murata",
  shop: "Murata Kiln, Kyoto",
};

const TITLES = {
  login: {
    title: "Welcome to Aura",
    subtitle: "Enter your credentials to access authenticated craft registries.",
  },
  register: {
    title: "Join Aura",
    subtitle: "Create your artisan or patron account to get started.",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVendor, setIsVendor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "register") {
        await authService.register({
          fullName,
          email,
          password,
          role: isVendor ? "seller" : "buyer",
        });
      } else {
        await authService.login(email, password);
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
    mode === "login" ? (
      <>
        New to Aura?{" "}
        <button type="button" onClick={() => setMode("register")} className="text-primary font-semibold hover:underline">
          Create an artisan or patron account
        </button>
      </>
    ) : (
      <>
        Already registered?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Sign in to your portal
        </Link>
      </>
    );

  return (
    <AuthShell mode={mode} onModeChange={setMode} brand={BRAND} titles={TITLES} helper={helper} apiUrl={API_URL}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {error && <p className="text-sm text-error">{error}</p>}

        {mode === "register" && (
          <Input
            label="Full Legal Name"
            type="text"
            placeholder="Alex Morgan"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon="badge"
            iconPosition="right"
            required
          />
        )}

        <EmailField
          value={email}
          onChange={setEmail}
          placeholder="alex.morgan@domain.com"
        />

        <PasswordField
          value={password}
          onChange={setPassword}
          placeholder="••••••••••••"
          minLength={8}
          labelAction={
            <Link href="#forgot" className="text-caption text-primary hover:underline" id="forgot-link">
              Forgot password?
            </Link>
          }
        />

        {mode === "register" && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="vendorCheck"
              checked={isVendor}
              onChange={(e) => setIsVendor(e.target.checked)}
              className="w-4 h-4 rounded text-primary accent-primary bg-surface-container-low cursor-pointer"
            />
            <label htmlFor="vendorCheck" className="text-body-sm text-on-surface cursor-pointer select-none">
              Register as an Aura Marketplace Vendor
            </label>
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
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <span>{mode === "login" ? "Sign In to Aura" : "Create Account"}</span>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
