import { isValidPnr } from "./utils/isValidPnr";
import parser from "xml2json";

const executeLookup = async (
  pnr: string,
  client: { postSparLookupRequest: (pnr: string) => Promise<unknown> }
) => {
  try {
    if (isValidPnr(pnr)) {
      return await client.postSparLookupRequest(pnr);
    } else {
      throw new Error("Invalid personal identity number");
    }
  } catch (err) {
    throw new Error("Communication error with SPAR service");
  }
};
