import express from "express";
import { sparClient } from "./clients/sparClient";
import { executeLookup } from "./services/sparLookupService";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/lookup-request", async (req, res) => {
  const { pnr = "" } = req.body;
  if (!pnr) {
    return res.status(400).send("No personal identity number provided");
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
          .send("Invalid format of personal identity number");
      }

      if (err.message === "Communication error with SPAR service") {
        return res.status(422).send("Could not communicate with SPAR service");
      }
    }
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
