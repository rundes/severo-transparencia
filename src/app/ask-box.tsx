"use client";

import { useState } from "react";
import { Markdown } from "@/components/markdown";
import { Notice, PrimaryButton, SecondaryButton } from "@/components/ui";

type Modo = "pregunta" | "informe";

export function AskBox() {
  const [pregunta, setPregunta] = useState("");
  const [modo, setModo] = useState<Modo>("pregunta");
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function preguntar() {
    if (!pregunta.trim() || loading) return;
    setLoading(true);
    setError("");
    setRespuesta("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta, modo }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Error ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() ?? "";
        for (const part of parts) {
          const line = part.replace(/^data: /, "").trim();
          if (!line) continue;
          const ev = JSON.parse(line) as { type: string; text?: string; error?: string };
          if (ev.type === "text") setRespuesta((r) => r + ev.text);
          else if (ev.type === "error") setError(ev.error ?? "Error");
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-rule-strong bg-paper-2 focus-within:border-accent">
        <textarea
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) preguntar();
          }}
          placeholder="¿Quién ganó las generales 2023 a presidente? ¿Cómo fue la participación en Córdoba?"
          rows={3}
          className="w-full resize-none rounded-lg bg-transparent p-3.5 text-[0.95rem] text-ink placeholder:text-ink-faint focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <PrimaryButton onClick={preguntar} disabled={loading}>
          {loading ? "Consultando…" : modo === "informe" ? "Generar informe" : "Preguntar"}
        </PrimaryButton>
        <div className="inline-flex rounded-md border border-rule-strong p-0.5 text-xs">
          {(["pregunta", "informe"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setModo(m)}
              aria-pressed={modo === m}
              className={`rounded px-3 py-1.5 capitalize transition-colors ${
                modo === m ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <span className="text-xs text-ink-faint">⌘/Ctrl + Enter</span>
      </div>
      {error && <Notice>{error}</Notice>}
      {respuesta && (
        <div className="flex flex-col gap-2">
          {!loading && (
            <SecondaryButton onClick={() => window.print()} className="self-end px-3 py-1 text-xs print:hidden">
              Descargar PDF
            </SecondaryButton>
          )}
          <div id="reporte" className="rounded-lg border border-rule bg-paper-2/60 p-5">
            <Markdown>{respuesta}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
