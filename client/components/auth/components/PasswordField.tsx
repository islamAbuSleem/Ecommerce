"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/components/Icon";

type Props = {
  id?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
  labelAction?: React.ReactNode;
};

export function PasswordField({
  id = "password",
  label = "Password",
  placeholder = "••••••••",
  value,
  onChange,
  minLength,
  labelAction,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-label-md text-on-surface" htmlFor={id}>{label}</label>
        {labelAction}
      </div>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={minLength}
          className="w-full h-11 px-3.5 pr-10 rounded-lg bg-surface-container-low text-on-surface text-body-md placeholder:text-outline outline-none focus:bg-surface-container transition-all"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-2.5 top-2 p-1 text-on-surface-variant hover:text-on-surface"
          aria-label="Toggle password visibility"
        >
          <Icon size="md">{showPassword ? "visibility_off" : "visibility"}</Icon>
        </button>
      </div>
    </div>
  );
}
