import { describe, it, expect } from "@jest/globals";
import { sparClient } from "../clients/sparClient";
import { executeLookup } from "./sparLookupService";

describe("executeLookup", () => {
  const validPnr = "196211022766";

  const createSparClient = (
    lookupResponse: Record<string, unknown> | Error = {}
  ) =>
    ({
      makeLookupRequest: () => lookupResponse,
    } as unknown as ReturnType<typeof sparClient>);

  it("will throw an error if provided Swedish personal identity number is invalid", async () => {
    const invalidPnr = "000000-0000";
    await expect(() =>
      executeLookup(invalidPnr, createSparClient())
    ).rejects.toThrowError("Invalid personal identity number");
  });

  it("will return the parsed XML response", async () => {
    const mockResponse = { note: { to: "Tove" } };

    const result = await executeLookup(
      validPnr,
      createSparClient({ mockResponse })
    );
    expect(result).toMatchObject({ mockResponse });
  });
});
