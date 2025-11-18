"use client";

import type { AuthUser, LoginResponse } from "@/types/auth";

const TOKEN_KEY = "healthflow_token";
const USER_KEY = "healthflow_user";

export function saveAuth(login: LoginResponse) {
  if (typeof window === "undefined") return;

  const user: AuthUser = {
    id: login.id,
    email: login.email,
    role: login.role,
  };

  window.localStorage.setItem(TOKEN_KEY, login.access_token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuth(): { token: string | null; user: AuthUser | null } {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const token = window.localStorage.getItem(TOKEN_KEY);
  const rawUser = window.localStorage.getItem(USER_KEY);

  if (!token || !rawUser) {
    return { token: null, user: null };
  }

  try {
    const user = JSON.parse(rawUser) as AuthUser;
    if (!user.id || !user.email || !user.role) {
      return { token: null, user: null };
    }
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
