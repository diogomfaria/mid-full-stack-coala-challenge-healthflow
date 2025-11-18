"use client";

import type { Exam, ExamStatus } from "@/types/exam";
import { formatDate } from "@/lib/formatDate";
import { AlertCircle, FileText } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type ExamCardProps = {
  exam: Exam;
  onClick?: (exam: Exam) => void;
  actionLabel?: string;
  selected?: boolean;
  id?: string;
};

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

export function ExamCard({ exam, onClick, actionLabel, selected = false, id }: ExamCardProps) {
  const badgeClasses = getStatusClasses(exam.status);
  const shouldReduceMotion = useReducedMotion();

  function handleClick() {
    if (onClick) {
      onClick(exam);
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      id={id}
      className={`w-full cursor-pointer rounded-lg border bg-white px-3 py-2 text-left text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
        selected ? "border-purple-300 ring-1 ring-purple-200" : "border-purple-50"
      }`}
      aria-label={`Ver detalhes do exame ${exam.description} do paciente ${exam.patientName}`}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              y: -3,
              boxShadow: "var(--shadow-elev-1)",
            }
      }
      whileTap={
        shouldReduceMotion
          ? {}
          : {
              scale: 0.985,
              y: 0,
            }
      }
      transition={{ duration: 0.16, ease: [0.16, 0.84, 0.44, 1] }}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-zinc-900">
            {exam.description}
          </p>
          <p className="text-[11px] text-zinc-600">
            Paciente: {exam.patientName}
          </p>
          <p className="text-[11px] text-zinc-400">
            Criado em {formatDate(exam.createdAt)}
          </p>
        </div>
        <motion.span
          key={exam.status}
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeClasses}`}
          initial={
            shouldReduceMotion
              ? { opacity: 0.9 }
              : { opacity: 0.9, scale: 0.9 }
          }
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.18, ease: [0.16, 0.84, 0.44, 1] }}
        >
          {exam.status}
        </motion.span>
      </div>

      {actionLabel && (
        <div className="mt-2 flex justify-end">
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            <FileText className="h-3 w-3" aria-hidden="true" />
            {actionLabel}
          </span>
        </div>
      )}

      {exam.processingResult && (
        <div className="mt-2 border-t border-zinc-100 pt-1.5">
          <p className="line-clamp-2 text-[11px] text-zinc-400">
            {exam.processingResult}
          </p>
        </div>
      )}

      {exam.status === "ERROR" && (
        <div className="mt-2 flex items-center gap-1 text-[11px] text-red-600">
          <AlertCircle className="h-3 w-3" aria-hidden="true" />
          <span>
            Houve um erro no processamento. Entre em contato com o suporte para
            reenfileirar.
          </span>
        </div>
      )}
    </motion.button>
  );
}
