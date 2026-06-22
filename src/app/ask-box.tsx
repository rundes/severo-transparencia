"use client";

import { useState } from "react";
import { Markdown } from "@/components/markdown";

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
      <textarea
        value={pregunta}
        onChange={(e) => setPregunta(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) preguntar();
        }}
        placeholder="¿Quién ganó las generales 2023 a presidente? ¿Cómo fue la participación en Córdoba?"
        rows={3}
        className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-sm outline-none focus:border-neutral-600"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={preguntar}
          disabled={loading}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
        >
          {loading ? "Consultando…" : modo === "informe" ? "Generar informe" : "Preguntar"}
        </button>
        <div className="flex rounded-lg border border-neutral-800 p-0.5 text-xs">
          {(["pregunta", "informe"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setModo(m)}
              className={`rounded-md px-3 py-1.5 capitalize ${
                modo === m ? "bg-neutral-700 text-white" : "text-neutral-400"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <span className="text-xs text-neutral-600">⌘/Ctrl + Enter</span>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {respuesta && (
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
          <Markdown>{respuesta}</Markdown>
        </div>
      )}
    </div>
  );
}
