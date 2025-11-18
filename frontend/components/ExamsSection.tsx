"use client";

import { useState } from "react";
import type { Exam } from "@/types/exam";
import { ExamCard } from "@/components/ExamCard";
import { ChevronDown } from "lucide-react";

type ExamsSectionProps = {
  title: string;
  exams: Exam[];
  onExamClick?: (exam: Exam) => void;
  defaultExpanded?: boolean;
};

export function ExamsSection({ title, exams, onExamClick, defaultExpanded = true }: ExamsSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const sortedExams = [...exams].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  function toggle() {
    setExpanded((prev) => !prev);
  }

  return (
    <section aria-label={title} className="rounded-md">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full cursor-pointer items-center justify-between rounded-md bg-purple-50 px-3 py-2 text-left text-xs font-semibold text-purple-800 transition hover:bg-purple-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        aria-expanded={expanded}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`}
          aria-hidden="true"
        />
      </button>

      <div
        className={`mt-2 space-y-2 overflow-hidden transition-all ${
          expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {sortedExams.length === 0 ? (
          <p className="px-1 text-xs text-zinc-400">Nenhum exame nesta seção.</p>
        ) : (
          sortedExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} onClick={onExamClick} />
          ))
        )}
      </div>
    </section>
  );
}
