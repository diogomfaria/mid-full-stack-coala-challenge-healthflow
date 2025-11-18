"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser, UserRole } from "@/types/auth";
import { clearAuth, getAuth } from "./auth";

export function useAuthGuard(expectedRole?: UserRole) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { user, token } = getAuth();

    if (!token || !user) {
      clearAuth();
      router.replace("/");
      return;
    }

    if (expectedRole && user.role !== expectedRole) {
      router.replace("/");
      return;
    }

    setUser(user);
    setToken(token);
    setLoading(false);
  }, [router, expectedRole]);

  return { user, token, loading };
}
