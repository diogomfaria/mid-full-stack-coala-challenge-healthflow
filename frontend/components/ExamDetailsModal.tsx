"use client";

import type { Exam, ExamStatus } from "@/types/exam";
import { formatDate } from "@/lib/formatDate";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

function getStatusClasses(status: ExamStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800";
    case "DONE":
      return "bg-green-100 text-green-800";
    case "ERROR":
      return "bg-red-100 text-red-800";
    case "REPORTED":
    default:
      return "bg-gray-100 text-gray-800";
  }
}

type ExamDetailsModalProps = {
  exam: Exam;
  onClose: () => void;
};

export function ExamDetailsModal({ exam, onClose }: ExamDetailsModalProps) {
  async function handleCopyId() {
    try {
      await navigator.clipboard.writeText(exam.id);
    } catch {
    }
  }

  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exam-details-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl shadow-purple-200"
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.24, ease: [0.16, 0.84, 0.44, 1] }}
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h2
              id="exam-details-title"
              className="text-lg font-semibold text-zinc-900"
            >
              {exam.description}
            </h2>
            <p className="text-xs text-zinc-500">
              Paciente: {exam.patientName}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getStatusClasses(exam.status)}`}
          >
            {exam.status}
          </span>
        </div>

        <dl className="space-y-2 text-xs text-zinc-600">
          <div className="flex justify-between gap-4">
            <dt className="font-medium text-zinc-700">Criado em</dt>
            <dd>{formatDate(exam.createdAt)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-medium text-zinc-700">Atualizado em</dt>
            <dd>{formatDate(exam.updatedAt)}</dd>
          </div>
          <div>
            <dt className="font-medium text-zinc-700">Resultado do processamento</dt>
            <dd className="mt-1 whitespace-pre-wrap text-xs text-zinc-600">
              {exam.processingResult ?? "Ainda não disponível."}
            </dd>
          </div>
          {exam.report && (
            <div>
              <dt className="font-medium text-zinc-700">Laudo</dt>
              <dd className="mt-1 whitespace-pre-wrap text-xs text-zinc-600">
                {exam.report}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCopyId}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs"
            aria-label="Copiar ID do exame"
          >
            <Copy className="h-3 w-3" aria-hidden="true" />
            Copiar ID
          </Button>

          <Button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs"
            aria-label="Fechar detalhes do exame"
          >
            Fechar
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
