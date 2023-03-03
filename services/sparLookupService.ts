import { isValidPnr } from "../utils/isValidPnr";
import parser from "xml2json";
import { SparClient } from "../clients/sparClient";

export const executeLookup = async (pnr: string, client: SparClient) => {
  try {
    if (isValidPnr(pnr)) {
      const result = await client.makeLookupRequest(pnr);
      if (typeof result.data === "string" || Buffer.isBuffer(result.data)) {
        return parser.toJson(result.data, { object: true });
      } else {
        throw new Error("Communication error with SPAR service");
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
