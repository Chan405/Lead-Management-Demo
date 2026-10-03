"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { DEMO_TODAY, TEAM_MEMBERS } from "@/lib/demo";
import { LEAD_SOURCES, LEAD_STATUSES, isLeadSource, isLeadStatus, type NewLeadInput } from "@/lib/types";
import { useLeads } from "@/components/leads/leads-context";
import { IconClose } from "@/components/ui/icons";
import { controlClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/ui/styles";

type Draft = {
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  assignedTo: string;
  followUpDate: string;
  value: string;
  notes: string;
};

type FieldName = "name" | "email" | "value" | "followUpDate" | "source" | "status" | "assignedTo";
type FieldErrors = Partial<Record<FieldName, string>>;

function emptyDraft(): Draft {
  return {
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "Website",
    status: "New",
    assignedTo: TEAM_MEMBERS[0],
    followUpDate: DEMO_TODAY,
    value: "",
    notes: "",
  };
}

function validate(draft: Draft): { errors: FieldErrors; value: NewLeadInput | null } {
  const errors: FieldErrors = {};
  const name = draft.name.trim();
  const email = draft.email.trim();
  const followUpDate = draft.followUpDate.trim();

  if (!name) errors.name = "Enter a name.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email, or leave it blank.";
  }
  if (!followUpDate) errors.followUpDate = "Choose a follow-up date.";
  if (!isLeadSource(draft.source)) errors.source = "Choose a source.";
  if (!isLeadStatus(draft.status)) errors.status = "Choose a status.";
  if (!draft.assignedTo.trim()) errors.assignedTo = "Choose who owns this lead.";

  const amount = Number(draft.value);
  if (draft.value.trim() === "" || !Number.isFinite(amount)) {
    errors.value = "Enter an estimated value.";
  } else if (amount < 0) {
    errors.value = "Value cannot be negative.";
  }

  if (
    !name ||
    errors.email ||
    errors.followUpDate ||
    errors.source ||
    errors.status ||
    errors.assignedTo ||
    errors.value ||
    !isLeadSource(draft.source) ||
    !isLeadStatus(draft.status)
  ) {
    return { errors, value: null };
  }

  return {
    errors,
    value: {
      name,
      company: draft.company.trim(),
      email,
      phone: draft.phone.trim(),
      source: draft.source,
      status: draft.status,
      assignedTo: draft.assignedTo,
      followUpDate,
      value: Math.round(amount),
      notes: draft.notes.trim(),
    },
  };
}

export function AddLeadModal() {
  const { addOpen, closeAddLead, addLead } = useLeads();
  if (!addOpen) return null;
  return <AddLeadDialog onClose={closeAddLead} onCreate={addLead} />;
}

function AddLeadDialog({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (input: NewLeadInput) => void;
}) {
  const formId = useId();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function update<Key extends keyof Draft>(key: Key, value: Draft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validate(draft);
    setErrors(result.errors);
    if (!result.value) return;
    onCreate(result.value);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/40"
        aria-label="Close add lead"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
        className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-card shadow-xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 id={`${formId}-title`} className="text-lg font-semibold tracking-tight">
              Add lead
            </h2>
            <p className="mt-1 text-sm text-muted">
              Capture a new inquiry and put a follow-up on the calendar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted hover:bg-black/[0.04] hover:text-foreground"
            aria-label="Close"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </header>

        <form className="px-5 py-5" onSubmit={submit} autoComplete="off">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" error={errors.name} htmlFor={`${formId}-name`}>
              <input
                id={`${formId}-name`}
                className={controlClass}
                value={draft.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Elena Vasquez"
              />
            </Field>
            <Field label="Company" htmlFor={`${formId}-company`}>
              <input
                id={`${formId}-company`}
                className={controlClass}
                value={draft.company}
                onChange={(event) => update("company", event.target.value)}
                placeholder="Vasquez Bakery"
              />
            </Field>
            <Field label="Email" error={errors.email} htmlFor={`${formId}-email`}>
              <input
                id={`${formId}-email`}
                type="email"
                className={controlClass}
                value={draft.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder="elena@vasquezbakery.com"
              />
            </Field>
            <Field label="Phone" htmlFor={`${formId}-phone`}>
              <input
                id={`${formId}-phone`}
                type="tel"
                className={controlClass}
                value={draft.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="(503) 555-0142"
              />
            </Field>
            <Field label="Source" error={errors.source} htmlFor={`${formId}-source`}>
              <select
                id={`${formId}-source`}
                className={controlClass}
                value={draft.source}
                onChange={(event) => update("source", event.target.value)}
              >
                {LEAD_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status" error={errors.status} htmlFor={`${formId}-status`}>
              <select
                id={`${formId}-status`}
                className={controlClass}
                value={draft.status}
                onChange={(event) => update("status", event.target.value)}
              >
                {LEAD_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Assigned to" error={errors.assignedTo} htmlFor={`${formId}-owner`}>
              <select
                id={`${formId}-owner`}
                className={controlClass}
                value={draft.assignedTo}
                onChange={(event) => update("assignedTo", event.target.value)}
              >
                {TEAM_MEMBERS.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Follow-up date" error={errors.followUpDate} htmlFor={`${formId}-date`}>
              <input
                id={`${formId}-date`}
                type="date"
                className={controlClass}
                value={draft.followUpDate}
                onChange={(event) => update("followUpDate", event.target.value)}
              />
            </Field>
            <Field label="Estimated value" error={errors.value} htmlFor={`${formId}-value`}>
              <input
                id={`${formId}-value`}
                inputMode="numeric"
                className={controlClass}
                value={draft.value}
                onChange={(event) => update("value", event.target.value)}
                placeholder="1280"
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Notes" htmlFor={`${formId}-notes`}>
                <textarea
                  id={`${formId}-notes`}
                  className={`${controlClass} min-h-24 py-2`}
                  value={draft.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  placeholder="What did they ask for, and what should happen next?"
                />
              </Field>
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" className={secondaryButtonClass} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={primaryButtonClass}>
              Save lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className={labelClass}>{label}</span>
      {children}
      {error ? <span className="mt-1.5 block text-xs text-rose-700">{error}</span> : null}
    </label>
  );
}
