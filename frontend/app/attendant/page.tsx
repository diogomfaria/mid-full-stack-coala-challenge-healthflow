"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { useExams } from "@/lib/useExams";
import { createExam } from "@/api/exams";
import type { Exam } from "@/types/exam";
import { UploadExamForm, type UploadExamFormValues } from "@/components/UploadExamForm";
import { ExamsSection } from "@/components/ExamsSection";
import { ExamDetailsModal } from "@/components/ExamDetailsModal";

export default function AttendantDashboardPage() {
  const { user, token, loading: authLoading } = useAuthGuard("ATTENDANT");
  const {
    exams,
    loading: examsLoading,
    error: examsError,
    refresh,
    upsertExam,
  } = useExams(
    token,
    { enabled: !authLoading, pollIntervalMs: 10000 },
  );

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  async function handleUpload(values: UploadExamFormValues) {
    if (!token) return;

    setUploading(true);
    setUploadError(null);

    try {
      const created = await createExam(
        {
          description: values.description,
          patientName: values.patientName,
        },
        token,
      );

      upsertExam(created);
      setToast({ message: "Exame cadastrado com sucesso.", type: "success" });
    } catch (err: any) {
      const message = err?.message ?? "Erro ao enviar exame";
      setUploadError(message);
      setToast({ message, type: "error" });
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    if (!toast) return;

    const id = window.setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => window.clearTimeout(id);
  }, [toast]);

  const pendingAndProcessing = useMemo(
    () =>
      exams.filter(
        (exam) => exam.status === "PENDING" || exam.status === "PROCESSING",
      ),
    [exams],
  );

  const doneExams = useMemo(
    () => exams.filter((exam) => exam.status === "DONE"),
    [exams],
  );

  const reportedExams = useMemo(
    () => exams.filter((exam) => exam.status === "REPORTED"),
    [exams],
  );

  if (authLoading || !user || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#4e2ac8]">
        <p className="text-sm text-white/90">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-8 font-sans">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-purple-700">
              Painel do Atendente
            </h1>
            <p className="text-sm text-zinc-500">
              Logado como {user.email}
            </p>
          </div>
          <p className="text-xs font-medium text-purple-600">
            Atualização automática a cada 10s.
          </p>
        </header>

        <main className="grid gap-8 md:grid-cols-5">
          <section className="md:col-span-2 rounded-2xl bg-white/95 p-6 shadow-lg shadow-purple-100 ring-1 ring-purple-50">
            <h2 className="mb-4 text-lg font-medium text-zinc-900">
              Upload de novo exame
            </h2>

            <UploadExamForm
              loading={uploading}
              error={uploadError}
              onSubmit={handleUpload}
            />
          </section>

          <section className="md:col-span-3 rounded-2xl bg-white/95 shadow-lg shadow-purple-100 ring-1 ring-purple-50">
            <div className="max-h-[calc(100vh-14rem)] overflow-y-auto pr-2">
              <div className="sticky top-0 z-10 bg-white/95 px-6 pt-6 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-medium text-zinc-900">
                    Exames recentes
                  </h2>
                  <div className="text-[11px] text-zinc-500">
                    {examsLoading ? "Sincronizando..." : "Atualizado"}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                {examsError && (
                  <p className="mb-2 text-sm text-red-500" role="alert">
                    {examsError}
                  </p>
                )}

                {exams.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    Nenhum exame cadastrado ainda.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <ExamsSection
                      title={`Aguardando (${pendingAndProcessing.length})`}
                      exams={pendingAndProcessing}
                      onExamClick={setSelectedExam}
                      defaultExpanded
                    />
                    <ExamsSection
                      title={`Concluídos (${doneExams.length})`}
                      exams={doneExams}
                      onExamClick={setSelectedExam}
                      defaultExpanded={false}
                    />
                    <ExamsSection
                      title={`Finalizados / Laudados (${reportedExams.length})`}
                      exams={reportedExams}
                      onExamClick={setSelectedExam}
                      defaultExpanded={false}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      {toast && (
        <div
          className="fixed bottom-4 right-4 z-50 max-w-xs rounded-lg bg-zinc-900 px-4 py-3 text-sm text-white shadow-lg"
          role="status"
          aria-live="polite"
        >
          <p>{toast.message}</p>
        </div>
      )}

      <AnimatePresence>
        {selectedExam && (
          <ExamDetailsModal
            exam={selectedExam}
            onClose={() => setSelectedExam(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
