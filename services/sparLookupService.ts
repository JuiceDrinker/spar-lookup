import { isValidPnr } from "../utils/isValidPnr";
import parser from "xml2json";

export const executeLookup = async (
  pnr: string,
  client: { makeLookupRequest: (pnr: string) => Promise<unknown> }
) => {
  try {
    if (isValidPnr(pnr)) {
      return await client.makeLookupRequest(pnr);
    } else {
      throw new Error("Invalid personal identity number");
    }
  } catch (err) {
    throw new Error("Communication error with SPAR service");
  }
};
