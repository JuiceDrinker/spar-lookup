import { isValidDate } from "./isValidPnr";
import { describe, it, expect } from "@jest/globals";

describe("isValidDate function", () => {
  it("will return true for a valid date", () => {
    const result = isValidDate(2022, 2, 1);
    expect(result).toBe(true);
  });

  it("will return false for an invalid date", () => {
    // February 29, 2021 doesn't exist
    const result = isValidDate(2021, 2, 29);
    expect(result).toBe(false);
  });

  it("will return false for a negative year", () => {
    const result = isValidDate(-1, 1, 1);
    expect(result).toBe(false);
  });

  it("will return false for a month greater than 12", () => {
    const result = isValidDate(2022, 13, 1);
    expect(result).toBe(false);
  });

  it("will return false for a date greater than 31", () => {
    const result = isValidDate(2022, 1, 32);
    expect(result).toBe(false);
  });
});
