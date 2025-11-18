"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { useExams } from "@/lib/useExams";
import type { Exam } from "@/types/exam";
import { submitExamReport } from "@/api/exams";
import { ExamCard } from "@/components/ExamCard";
import { Toast, type ToastType } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/Skeleton";
import { Inbox, RotateCcw } from "lucide-react";

export default function DoctorDashboardPage() {
  const { user, token, loading: authLoading } = useAuthGuard("DOCTOR");
  const shouldReduceMotion = useReducedMotion();
  const {
    exams,
    loading: examsLoading,
    error: examsError,
    removeExam,
    refresh,
    errorCount,
  } = useExams(token, { enabled: !authLoading, pollIntervalMs: 10000 });

  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [report, setReport] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(
    null,
  );

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const doneExams = useMemo(
    () =>
      exams
        .filter((exam) => exam.status === "DONE")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [exams],
  );

  const selectedExam: Exam | null = useMemo(
    () => doneExams.find((exam) => exam.id === selectedExamId) ?? null,
    [doneExams, selectedExamId],
  );

  const showSkeletons = examsLoading && doneExams.length === 0 && !examsError && !error;

  function handleOpenExam(examId: string) {
    setSelectedExamId(examId);
    setReport("");
    setError(null);
  }

  function handleClosePanel() {
    const previousId = selectedExamId;
    setSelectedExamId(null);
    setReport("");
    setError(null);

    if (previousId) {
      const trigger = document.getElementById(`doctor-exam-${previousId}`);
      if (trigger instanceof HTMLButtonElement) {
        trigger.focus();
      }
    }
  }

  useEffect(() => {
    if (!selectedExam || !textareaRef.current) return;
    textareaRef.current.focus();
  }, [selectedExam]);

  useEffect(() => {
    if (!selectedExamId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClosePanel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedExamId]);

  useEffect(() => {
    if (!toast) return;

    const id = window.setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => window.clearTimeout(id);
  }, [toast]);

  async function handleSubmitReport() {
    if (!token || !selectedExam) return;

    const trimmed = report.trim();
    if (!trimmed) {
      setError("O laudo não pode estar vazio.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const examId = selectedExam.id;

    async function attempt(attemptIndex: number) {
      try {
        await submitExamReport(examId, trimmed, token as string);
        removeExam(examId);
        setToast({ message: "Laudo enviado com sucesso.", type: "success" });
        handleClosePanel();
      } catch (err: any) {
        if (attemptIndex === 0) {
          window.setTimeout(() => {
            void attempt(1);
          }, 500);
          return;
        }

        const message = err?.message ?? "Erro ao enviar laudo";
        setError(message);
        setToast({ message, type: "error" });
      } finally {
        setSubmitting(false);
      }
    }

    void attempt(0);
  }

  if (authLoading || !user || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#4e2ac8]">
        <p className="text-sm text-white/90">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-8 font-sans">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-purple-700">
              Painel do Médico
            </h1>
          </div>
          <Button
            type="button"
            onClick={() => refresh()}
            disabled={examsLoading}
            title="Atualizar lista de exames"
            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:mt-0 active:scale-95 transition"
          >
            <RotateCcw
              className={`h-3 w-3 ${examsLoading ? "icon-spin" : ""}`}
              aria-hidden="true"
            />
            {examsLoading ? "Sincronizando..." : "Atualizar lista"}
          </Button>
        </header>

        <main className="rounded-2xl bg-white/95 shadow-lg shadow-purple-100 ring-1 ring-purple-50">
          <div className="max-h-[calc(100vh-14rem)] overflow-y-auto pr-2">
            <div className="sticky top-0 z-10 bg-white/95 px-7 pt-7 pb-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-medium text-zinc-900">
                  Exames aguardando laudo 
                </h2>
                {errorCount >= 3 && (
                  <span className="text-[11px] text-red-600">
                    Falha ao sincronizar. Tentar novamente.
                  </span>
                )}
              </div>
            </div>

            <div className="px-7 pb-7">
              {(error || examsError) && (
                <p className="mb-3 text-sm text-red-500" role="alert">
                  {error ?? examsError}
                </p>
              )}

              {showSkeletons ? (
                <div className="space-y-4" aria-hidden="true">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-purple-50 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-1.5">
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-2 w-40" />
                          <Skeleton className="h-2 w-24" />
                        </div>
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                      <Skeleton className="mt-2 h-10 w-full rounded-md" />
                    </div>
                  ))}
                </div>
              ) : doneExams.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-500">
                    <Inbox className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-800">
                      Não há exames aguardando laudo no momento.
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Você pode atualizar a lista para verificar se novos exames foram concluídos.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => refresh()}
                    disabled={examsLoading}
                    title="Atualizar lista de exames"
                    className="mt-1 inline-flex items-center gap-1 px-3 py-1.5 text-xs active:scale-95 transition"
                  >
                    <RotateCcw
                      className={`h-3 w-3 ${examsLoading ? "icon-spin" : ""}`}
                      aria-hidden="true"
                    />
                    {examsLoading ? "Sincronizando..." : "Atualizar lista"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {doneExams.map((exam, index) => (
                      <motion.div
                        key={exam.id}
                        layout
                        initial={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: 8 }
                        }
                        animate={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 1, y: 0 }
                        }
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: -8 }
                        }
                        transition={{
                          duration: 0.2,
                          delay: shouldReduceMotion ? 0 : index * 0.03,
                          ease: [0.16, 0.84, 0.44, 1],
                        }}
                      >
                        <ExamCard
                          id={`doctor-exam-${exam.id}`}
                          exam={exam}
                          onClick={() => handleOpenExam(exam.id)}
                          actionLabel="Laudar"
                          selected={exam.id === selectedExamId}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selectedExam && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exam-report-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl shadow-purple-200"
              initial={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }
              }
              animate={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
              }
              exit={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }
              }
              transition={{ duration: 0.24, ease: [0.16, 0.84, 0.44, 1] }}
            >
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <h2
                  id="exam-report-title"
                  className="text-lg font-semibold text-zinc-900"
                >
                  {selectedExam.description}
                </h2>
                <p className="text-xs text-zinc-500">
                  Paciente: {selectedExam.patientName}
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-800">
                {selectedExam.status}
              </span>
            </div>

            <div className="mb-4 space-y-1 text-xs text-zinc-600">
              <p className="text-[11px] text-zinc-500">
                Criado em {new Date(selectedExam.createdAt).toLocaleString("pt-BR")}
              </p>
              <p className="text-[11px] text-zinc-500">
                Atualizado em {new Date(selectedExam.updatedAt).toLocaleString("pt-BR")}
              </p>
              <p className="mt-2 text-xs font-medium text-zinc-700">
                Resultado do processamento
              </p>
              <p className="text-xs text-zinc-600">
                {selectedExam.processingResult ?? "Ainda não disponível."}
              </p>
            </div>

            <div>
              <label
                className="mb-1 block text-xs font-medium text-zinc-700"
                htmlFor="exam-report-textarea"
              >
                Laudo
              </label>
              <textarea
                id="exam-report-textarea"
                ref={textareaRef}
                rows={5}
                value={report}
                onChange={(event) => setReport(event.target.value)}
                className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none ring-2 ring-transparent transition focus:border-purple-300 focus:ring-purple-100"
                placeholder="Digite aqui o laudo médico deste exame..."
              />
              {error && (
                <p className="mt-1 text-xs text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClosePanel}
                className="px-3 py-1.5 text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleSubmitReport}
                disabled={submitting}
                aria-busy={submitting}
                className="px-3 py-1.5 text-xs"
              >
                {submitting ? "Finalizando..." : "Finalizar laudo"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
