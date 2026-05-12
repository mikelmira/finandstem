"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

interface ContactFormProps {
  fields: {
    name: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    organisation: { label: string; placeholder: string };
    topic: { label: string; options: ReadonlyArray<string> };
    message: { label: string; placeholder: string };
  };
  submitLabel: string;
  className?: string;
}

const topicToEvent: Record<string, "partnership" | "press" | "other"> = {
  Partnership: "partnership",
  "Press / interview": "press",
  Other: "other",
};

export function ContactForm({
  fields,
  submitLabel,
  className,
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>(fields.topic.options[0]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      organisation: String(form.get("organisation") ?? ""),
      topic,
      message: String(form.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "Couldn't send. Try again?");
        setStatus("error");
        return;
      }
      setStatus("success");
      track({
        name: "contact_submit",
        topic: topicToEvent[topic] ?? "other",
      });
    } catch {
      setError("Network error. Try again?");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className={cn(
          "flex items-start gap-3 rounded-2xl border border-[var(--brand)]/30 bg-[var(--brand-soft)] p-5 text-sm",
          className,
        )}
      >
        <CheckCircle2 className="mt-0.5 size-5 text-[var(--brand)]" aria-hidden />
        <div>
          <p className="font-medium text-foreground">Message sent.</p>
          <p className="mt-1 text-muted-foreground">
            We&apos;ll reply within a few working days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("space-y-5", className)}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          name="name"
          label={fields.name.label}
          placeholder={fields.name.placeholder}
          required
          autoComplete="name"
        />
        <Field
          name="email"
          type="email"
          label={fields.email.label}
          placeholder={fields.email.placeholder}
          required
          autoComplete="email"
          inputMode="email"
        />
      </div>
      <Field
        name="organisation"
        label={fields.organisation.label}
        placeholder={fields.organisation.placeholder}
        autoComplete="organization"
      />
      <div>
        <label htmlFor="topic" className="text-sm font-medium text-foreground">
          {fields.topic.label}
        </label>
        <select
          id="topic"
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-2 h-11 w-full appearance-none rounded-xl border border-border bg-background px-4 text-sm focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
        >
          {fields.topic.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          {fields.message.label}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder={fields.message.placeholder}
          className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          We respond from {`{owner email}`} within a few working days.
        </p>
        <Button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full"
        >
          {status === "submitting" ? "Sending…" : submitLabel}
          <Send className="ml-1.5 size-4" aria-hidden />
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function Field({ label, name, className, ...rest }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        {...rest}
        className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm placeholder:text-muted-foreground/70 focus:border-[var(--brand)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
      />
    </div>
  );
}
