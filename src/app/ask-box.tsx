"use client";

import { useState } from "react";

export function AskBox() {
  const [pregunta, setPregunta] = useState("");
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
        body: JSON.stringify({ pregunta }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setRespuesta(data.respuesta);
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
        placeholder="¿Quién ganó las generales 2023 a presidente? ¿Cómo fue la participación en Córdoba?"
        rows={3}
        className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-sm outline-none focus:border-neutral-600"
      />
      <button
        onClick={preguntar}
        disabled={loading}
        className="self-start rounded-lg bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
      >
        {loading ? "Consultando…" : "Preguntar"}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {respuesta && (
        <div className="whitespace-pre-wrap rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 text-sm leading-relaxed">
          {respuesta}
        </div>
      )}
    </div>
  );
}
