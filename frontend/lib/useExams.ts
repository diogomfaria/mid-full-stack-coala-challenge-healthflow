"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Exam } from "@/types/exam";
import { getExams } from "@/api/exams";

type UseExamsOptions = {
  pollIntervalMs?: number;
  enabled?: boolean;
};

export function useExams(
  token: string | null,
  options: UseExamsOptions = {},
) {
  const { pollIntervalMs = 0, enabled = true } = options;

  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);

  const lastManualChangeRef = useRef<number | null>(null);

  const fetchExams = useCallback(
    async ({ force = false }: { force?: boolean } = {}) => {
      if (!token || !enabled) return;

      const now = Date.now();
      if (!force && lastManualChangeRef.current && now - lastManualChangeRef.current < 2000) {
        return;
      }

      setLoading(true);
      try {
        const data = await getExams(token);

        setExams((previous) => {
          if (previous.length === 0) {
            return data;
          }

          const previousMap = new Map(previous.map((exam) => [exam.id, exam]));
          const next: Exam[] = [];

          for (const incoming of data) {
            const existing = previousMap.get(incoming.id);

            if (!existing) {
              next.push(incoming);
              continue;
            }

            if (
              existing.status !== incoming.status ||
              existing.processingResult !== incoming.processingResult ||
              existing.updatedAt !== incoming.updatedAt
            ) {
              next.push(incoming);
            } else {
              next.push(existing);
            }

            previousMap.delete(incoming.id);
          }

          // exames que sumiram do backend são removidos ao não entrarem no array "next"
          return next;
        });

        setError(null);
        setErrorCount(0);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? "Erro ao buscar exames");
        setErrorCount((prev) => prev + 1);
      } finally {
        setLoading(false);
      }
    },
    [token, enabled],
  );

  useEffect(() => {
    if (!token || !enabled) return;
    void fetchExams({ force: true });
  }, [token, enabled, fetchExams]);

  useEffect(() => {
    if (!token || !enabled) return;
    if (!pollIntervalMs || pollIntervalMs <= 0) return;

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void fetchExams();
      }
    }, pollIntervalMs);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void fetchExams();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [token, enabled, pollIntervalMs, fetchExams]);

  const removeExam = useCallback((id: string) => {
    lastManualChangeRef.current = Date.now();
    setExams((prev) => prev.filter((exam) => exam.id !== id));
  }, []);

  const upsertExam = useCallback((exam: Exam) => {
    lastManualChangeRef.current = Date.now();
    setExams((prev) => {
      const index = prev.findIndex((item) => item.id === exam.id);
      if (index === -1) {
        return [exam, ...prev];
      }

      const next = [...prev];
      next[index] = exam;
      return next;
    });
  }, []);

  const refresh = useCallback(() => {
    void fetchExams({ force: true });
  }, [fetchExams]);

  return {
    exams,
    loading,
    error,
    refresh,
    removeExam,
    upsertExam,
    errorCount,
  };
}
