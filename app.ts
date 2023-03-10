import express from "express";
import { sparClient } from "./clients/sparClient";
import { executeLookup } from "./services/sparLookupService";

export const app = express();
const port = 3000;

app.use(express.json());

app.post("/lookup-request", async (req, res) => {
  const { pnr = "" } = req.body;
  if (!pnr) {
    return res
      .status(400)
      .send({ message: "No personal identity number provided" });
  }

  try {
    const client = sparClient();
    const sparResponse = await executeLookup(pnr.toString(), client);

    res.status(200).json(sparResponse);
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "Invalid personal identity number") {
        return res
          .status(422)
          .send({ message: "Invalid format of personal identity number" });
      }

      if (err.message === "Not found in SPAR registry") {
        return res
          .status(200)
          .send({ message: `${pnr} not found in SPAR registry` });
      }
      if (err.message === "Communication error with SPAR service") {
        return res
          .status(503)
          .send({ message: "Could not communicate with SPAR service" });
      }
    }
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
}
