"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export type UploadExamFormValues = {
  description: string;
  patientName: string;
};

type UploadExamFormProps = {
  loading: boolean;
  error?: string | null;
  onSubmit: (values: UploadExamFormValues) => Promise<void> | void;
};

export function UploadExamForm({ loading, error, onSubmit }: UploadExamFormProps) {
  const [customDescription, setCustomDescription] = useState("");
  const [patientName, setPatientName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    description?: string;
    patientName?: string;
  }>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const description = customDescription.trim();

    const nextErrors: { description?: string; patientName?: string } = {};

    if (!description) {
      nextErrors.description = "Informe o tipo do exame.";
    }

    if (!patientName.trim()) {
      nextErrors.patientName = "Informe o nome do paciente.";
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    void onSubmit({
      description,
      patientName: patientName.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      aria-label="Formulário de upload de novo exame"
    >

      <div>
          <label
            className="mb-1 block text-sm font-medium text-zinc-700"
            htmlFor="custom-description"
          >
            Descrição do exame
          </label>
          <Input
            id="custom-description"
            aria-label="Descrição do exame"
            type="text"
            value={customDescription}
            onChange={(event) => setCustomDescription(event.target.value)}
            placeholder="TC de tórax"
            disabled={loading}
          />
        </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium text-zinc-700"
          htmlFor="patient-name"
        >
          Nome do paciente
        </label>
        <Input
          id="patient-name"
          aria-label="Nome do paciente"
          type="text"
          value={patientName}
          onChange={(event) => setPatientName(event.target.value)}
          placeholder="Diogo"
          disabled={loading}
        />
        {fieldErrors.patientName && (
          <p className="mt-1 text-xs text-red-500" role="alert">
            {fieldErrors.patientName}
          </p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center"
        aria-label="Enviar exame"
      >
        {loading && (
          <span
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent"
            aria-hidden="true"
          />
        )}
        {loading ? "Enviando..." : "Enviar exame"}
      </Button>
    </form>
  );
}
