"use client";

import { SignOut, SpinnerGap } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { API_ENDPOINTS } from "@/lib/api/endpoints";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);

    try {
      await fetch(API_ENDPOINTS.client.clientLogout, { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <button
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 text-sm font-extrabold text-white transition hover:bg-white/15 disabled:opacity-60"
      disabled={isLoggingOut}
      onClick={logout}
      type="button"
    >
      {isLoggingOut ? (
        <SpinnerGap aria-hidden="true" className="animate-spin" size={18} />
      ) : (
        <SignOut aria-hidden="true" size={18} weight="bold" />
      )}
      {isLoggingOut ? "Logging out…" : "Log Out"}
    </button>
  );
}
