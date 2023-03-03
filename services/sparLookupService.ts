import { isValidPnr } from "../utils/isValidPnr";
import parser from "xml2json";

export const executeLookup = async (
  pnr: string,
  client: {
    makeLookupRequest: (pnr: string) => Promise<{ data: unknown }>;
  }
) => {
  try {
    if (isValidPnr(pnr)) {
      const result = await client.makeLookupRequest(pnr);
      if (typeof result.data === "string" || Buffer.isBuffer(result.data)) {
        return parser.toJson(result.data);
      }
    } else {
      throw new Error("Invalid personal identity number");
    }
  } catch (err) {
    if (err.message === "Invalid personal identity number") {
      throw err;
    }
    throw new Error("Communication error with SPAR service");
  }
};
