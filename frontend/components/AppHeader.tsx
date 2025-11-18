"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth } from "@/lib/auth";

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/attendant") || pathname.startsWith("/doctor");

  function handleLogout() {
    clearAuth();
    router.push("/");
  }

  return (
    <header className="border-b border-purple-100 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Image
            src="/coala-logo.svg"
            alt="Coala Saúde"
            width={64}
            height={64}
            priority
          />
        </div>

        {isDashboard && (
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex cursor-pointer items-center justify-center rounded-full border border-purple-200 bg-white px-4 py-1.5 text-xs font-medium text-purple-700 shadow-sm transition hover:border-purple-300 hover:bg-purple-50"
          >
            Sair
          </button>
        )}
      </div>
    </header>
  );
}
