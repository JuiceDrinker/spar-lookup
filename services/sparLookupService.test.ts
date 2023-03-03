import { describe, it, expect } from "@jest/globals";
import { SparClient } from "../clients/sparClient";
import { executeLookup } from "./sparLookupService";

describe("executeLookup", () => {
  const validPnr = "196211022766";

  const createSparClient = (
    lookupResponse: Record<string, unknown> | Error = {}
  ) =>
    ({
      makeLookupRequest: () => lookupResponse,
    } as unknown as SparClient);

  const exampleXML = `<note>
<to>Tove</to>
</note>
    `;

  it("will throw an error if provided Swedish personal identity number is invalid", async () => {
    const invalidPnr = "000000-0000";
    await expect(() =>
      executeLookup(invalidPnr, createSparClient())
    ).rejects.toThrowError("Invalid personal identity number");
  });

  it("will throw an error if SPAR client does not return XML data", async () => {
    await expect(() =>
      executeLookup(validPnr, createSparClient(new Error("Some error")))
    ).rejects.toThrowError("Communication error with SPAR service");
  });

  it("will return the parsed XML response", async () => {
    const result = await executeLookup(
      validPnr,
      createSparClient({ data: exampleXML })
    );
    expect(result).toMatchObject({ note: { to: "Tove" } });
  });
});
