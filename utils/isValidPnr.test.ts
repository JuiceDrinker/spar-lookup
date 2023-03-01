import { isValidPnr } from "./isValidPnr";
import { describe, it, expect } from "@jest/globals";
describe("isValidPnr", () => {
  it("will return true for a valid 12 digit personal identity number", () => {
    expect(isValidPnr("197912129280")).toBe(true);
  });

  it("will return true for a valid 12 digit personal identity number", () => {
    expect(isValidPnr("198003219295")).toBe(true);
  });

  it("will return true for a valid 12 digit personal identity number with a hyphen", () => {
    expect(isValidPnr("19791212-9280")).toBe(true);
  });

  it("will return true for a valid 10 digit personal identity number", () => {
    expect(isValidPnr("8003219295")).toBe(true);
  });

  it("will return true for a valid 10 digit personal identity number with a hyphen", () => {
    expect(isValidPnr("800321-9295")).toBe(true);
  });

  it("will return false for a invalid 12 digit personal identity number", () => {
    expect(isValidPnr("197912129282")).toBe(false);
  });

  it("will return false for a invalid 12 digit personal identity number with a hyphen", () => {
    expect(isValidPnr("19791212-9283")).toBe(false);
  });

  it("will return false for a invalid 10 digit personal identity number", () => {
    expect(isValidPnr("7912129282")).toBe(false);
  });

  it("will return false for a invalid 12 digit personal identity number with a hyphen", () => {
    expect(isValidPnr("791212-9283")).toBe(false);
  });

  it("will return false for a invalid 12 digit personal identity number with a hyphen", () => {
    expect(isValidPnr("000000-0000")).toBe(false);
  });

  it("will return false for a invalid 12 digit personal identity number", () => {
    expect(isValidPnr("921510-9231")).toBe(false);
  });
});
