import { test } from "node:test";
import assert from "node:assert/strict";
import { computeFlips } from "./flips.ts";
import type { DistritoGanador } from "../api/mapa/route";

function d(idDistrito: number, distrito: string, ganador: string): DistritoGanador {
  return { idDistrito, distrito, ganador, color: "#000", pct: 50, participacion: 70 };
}

test("detecta un flip cuando cambia el ganador en la misma provincia", () => {
  const a = [d(1, "CABA", "Unión por la Patria")];
  const b = [d(1, "CABA", "La Libertad Avanza")];
  const flips = computeFlips(a, b);
  assert.equal(flips.length, 1);
  assert.equal(flips[0].id, 1);
  assert.equal(flips[0].prov, "CABA");
  assert.equal(flips[0].from.ganador, "Unión por la Patria");
  assert.equal(flips[0].to.ganador, "La Libertad Avanza");
});

test("no hay flip cuando el ganador es el mismo", () => {
  const a = [d(2, "Buenos Aires", "Unión por la Patria")];
  const b = [d(2, "Buenos Aires", "Unión por la Patria")];
  assert.deepEqual(computeFlips(a, b), []);
});

test("excluye provincias ausentes en uno de los lados", () => {
  const a = [d(1, "CABA", "X"), d(3, "Catamarca", "Y")];
  const b = [d(1, "CABA", "Z")]; // falta Catamarca
  const flips = computeFlips(a, b);
  assert.equal(flips.length, 1);
  assert.equal(flips[0].id, 1);
});
