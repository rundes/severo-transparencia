// Avatar determinístico para agrupaciones sin urlLogo: iniciales + color por hash.
// Mismo nombre → siempre mismo color. 100% generado, sin assets externos.

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const STOP = new Set(["de", "la", "el", "los", "las", "y", "del", "por", "para", "un", "una", "alianza", "frente"]);

/** Iniciales: hasta 3 letras de palabras significativas. */
export function iniciales(nombre: string): string {
  const palabras = nombre
    .trim()
    .split(/[\s-]+/)
    .filter((w) => w.length > 1 && !STOP.has(w.toLowerCase()));
  const fuente = palabras.length ? palabras : nombre.trim().split(/\s+/);
  return fuente
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Color HSL estable derivado del nombre. */
export function colorAvatar(nombre: string): { bg: string; fg: string } {
  const h = hash(nombre.trim().toUpperCase());
  const hue = h % 360;
  const sat = 55 + (h % 25); // 55–80%
  return { bg: `hsl(${hue} ${sat}% 42%)`, fg: "#fff" };
}
