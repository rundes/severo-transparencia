"use client";

import { useState } from "react";
import { colorAvatar, iniciales } from "@/lib/agrupacion-avatar";

/** Logo real (urlLogo) con fallback a avatar generado por nombre. */
export function AgrupacionLogo({ nombre, urlLogo, size = 40 }: { nombre: string; urlLogo?: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const showImg = urlLogo && !failed;
  const { bg, fg } = colorAvatar(nombre);

  if (showImg) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={urlLogo}
        alt={nombre}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className="shrink-0 rounded-md object-contain"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-md font-bold"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.32 }}
      aria-label={nombre}
    >
      {iniciales(nombre)}
    </div>
  );
}
