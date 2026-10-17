import { describe, expect, it } from "vitest";
import { formatearPrecio } from "../utils/formato";

describe("formatearPrecio", () => {
  it("separa los miles con punto", () => {
    expect(formatearPrecio(18990)).toBe("$18.990");
  });

  it("no agrega separador en números de tres dígitos o menos", () => {
    expect(formatearPrecio(990)).toBe("$990");
    expect(formatearPrecio(0)).toBe("$0");
  });

  it("redondea los decimales al entero más cercano", () => {
    expect(formatearPrecio(1999.6)).toBe("$2.000");
  });

  it("formatea valores de millones", () => {
    expect(formatearPrecio(1234567)).toBe("$1.234.567");
  });
});