"use client";

import { X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export type ToastType = "success" | "error" | "info";

type ToastProps = {
  message: string;
  type?: ToastType;
  onClose?: () => void;
};

export function Toast({ message, type = "info", onClose }: ToastProps) {
  const baseClasses =
    "fixed bottom-4 right-4 z-50 max-w-xs rounded-lg px-4 py-3 text-sm shadow-lg flex items-start gap-3";

  const typeClasses: Record<ToastType, string> = {
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    error: "bg-red-50 text-red-800 border border-red-200",
    info: "bg-zinc-900 text-zinc-50 border border-zinc-800",
  };

  const role = type === "error" ? "alert" : "status";

   const shouldReduceMotion = useReducedMotion();

   const variants = shouldReduceMotion
     ? {
         initial: { opacity: 0 },
         animate: { opacity: 1 },
         exit: { opacity: 0 },
       }
     : {
         initial: { opacity: 0, y: 16 },
         animate: { opacity: 1, y: 0 },
         exit: { opacity: 0, y: 16 },
       };

   const progressColor: Record<ToastType, string> = {
     success: "bg-emerald-400",
     error: "bg-red-400",
     info: "bg-zinc-200",
   };

  return (
    <motion.div
      className={`${baseClasses} ${typeClasses[type]}`}
      role={role}
      aria-live="polite"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.24, ease: [0.16, 0.84, 0.44, 1] }}
    >
      <div className="flex-1">
        {message}
        <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-black/10">
          <div
            className={`toast-progress h-full ${progressColor[type]}`}
            aria-hidden="true"
          />
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="mt-0.5 inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-current/70 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-purple-500"
          aria-label="Fechar notificação"
        >
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      )}
    </motion.div>
  );
}
