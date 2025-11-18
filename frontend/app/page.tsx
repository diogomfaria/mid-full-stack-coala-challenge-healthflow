"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import type { LoginResponse } from "@/types/auth";
import { saveAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import type { UserRole } from "@/types/auth";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [registerRole, setRegisterRole] = useState<UserRole>("ATTENDANT");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const data = await apiFetch<LoginResponse>("/auth/login", {
          method: "POST",
          body: { email, password },
        });

        saveAuth(data);

        if (data.role === "ATTENDANT") {
          router.push("/attendant");
        } else {
          router.push("/doctor");
        }
      } else {
        await apiFetch("/users", {
          method: "POST",
          body: { email, password, role: registerRole },
        });

        setMode("login");
        setPassword("");
        setSuccess("Usuário criado com sucesso. Agora faça login.");
      }
    } catch (err: any) {
      setError(err?.message ?? "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md rounded-3xl border border-purple-100 bg-white p-9 shadow-2xl shadow-purple-200">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-12 w-24 items-center justify-center">
            <Image
              src="/coala-logo.svg"
              alt="Coala Saúde"
              width={128}
              height={64}
              priority
            />
            <h1 className="ml-6 text-2xl font-semibold text-purple-700">
              HealthFlow
            </h1>
          </div>
        </div>

        <div className="mb-4 text-left">
          <h2 className="text-sm font-semibold text-zinc-800">
            {mode === "login" ? "Acessar sua conta" : "Criar nova conta"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {(error || success) && (
            <div
              className={`rounded-md border px-3 py-2 text-sm ${
                error
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
              role="alert"
              aria-live="assertive"
            >
              {error ?? success}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              E-mail
            </label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="atendente@clinicacoala.com"
              aria-invalid={!!error}
              className={error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Senha
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••"
                aria-invalid={!!error}
                className={`pr-10 ${
                  error ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-zinc-400 transition hover:text-zinc-600"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                Papel
              </label>
              <Select
                value={registerRole}
                onChange={(event) =>
                  setRegisterRole(event.target.value as UserRole)
                }
              >
                <option value="ATTENDANT">Atendente</option>
                <option value="DOCTOR">Médico</option>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading && (
                <span
                  className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent"
                  aria-hidden="true"
                />
              )}
              {loading
                ? mode === "login"
                  ? "Entrando..."
                  : "Criando usuário..."
                : mode === "login"
                  ? "Entrar"
                  : "Criar usuário"}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError(null);
                setSuccess(null);
              }}
              className="mt-1 text-xs"
            >
              {mode === "login"
                ? "Criar usuário"
                : "Já tenho conta, fazer login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
