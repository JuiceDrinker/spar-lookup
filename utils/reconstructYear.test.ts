import { reconstructYear } from "./isValidPnr";
import { describe, it, expect } from "@jest/globals";

describe("reconstructYear", () => {
  it("will return 2023 when input is 23", () => {
    const result = reconstructYear(23);
    expect(result).toEqual(2023);
  });

  it("will return 1924 when input is 24", () => {
    const result = reconstructYear(24);
    expect(result).toEqual(1924);
  });

  it("will return 2000 when input is 0", () => {
    const result = reconstructYear(0);
    expect(result).toEqual(2000);
  });
});
