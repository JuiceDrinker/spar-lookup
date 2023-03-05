import { isValidPnr } from "../utils/isValidPnr";
import { sparClient } from "../clients/sparClient";

export const executeLookup = async (
  pnr: string,
  client: ReturnType<typeof sparClient>
) => {
  try {
    if (isValidPnr(pnr)) {
      const result = await client.makeLookupRequest(pnr);
      return result;
    } else {
      throw new Error("Invalid personal identity number");
    }
  } catch (err) {
    if (err.message === "Invalid personal identity number") {
      throw err;
    }
    if (err.message === "Not found in SPAR registry") {
      throw err;
    }
    throw new Error("Communication error with SPAR service");
  }
};
