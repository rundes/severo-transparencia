import { test } from "node:test";
import assert from "node:assert/strict";
import { colorForAgrupacion, dineColorValido } from "./format.ts";

test("dineColorValido rechaza vacío y placeholder #888", () => {
  assert.equal(dineColorValido(""), false);
  assert.equal(dineColorValido(null), false);
  assert.equal(dineColorValido(undefined), false);
  assert.equal(dineColorValido("#888"), false);
});

test("dineColorValido acepta un hex real", () => {
  assert.equal(dineColorValido("#FEDD00"), true);
  assert.equal(dineColorValido("#009CDE"), true);
});

test("colorForAgrupacion es estable por nombre", () => {
  assert.equal(
    colorForAgrupacion("UNION POR LA PATRIA"),
    colorForAgrupacion("UNION POR LA PATRIA"),
  );
});

test("colorForAgrupacion distingue nombres distintos", () => {
  // No garantizamos unicidad global (paleta de 8), pero estos tres deben diferir.
  const a = colorForAgrupacion("UNION POR LA PATRIA");
  const b = colorForAgrupacion("LA LIBERTAD AVANZA");
  const c = colorForAgrupacion("JUNTOS POR EL CAMBIO");
  assert.notEqual(a, b);
  assert.notEqual(b, c);
  assert.notEqual(a, c);
});
