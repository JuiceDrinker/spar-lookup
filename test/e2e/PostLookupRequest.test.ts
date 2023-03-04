import { describe, it, expect, afterEach } from "@jest/globals";
import nock from "nock";
import supertest from "supertest";
import { app } from "../../app";
import { BASE_URL } from "../../clients/sparClient";

describe("POST /lookup-request", () => {
  const postLookupRequest = (body: Record<string, unknown> = {}) =>
    supertest(app).post("/lookup-request").send(body);

  const mockXMLResponse = `<note>
    <to>Tove</to>
    </note>`;

  it("will return HTTP code 400 when no personal identity number is provided", async () => {
    const response = await postLookupRequest();

    expect(response.statusCode).toEqual(400);
    expect(response.body).toMatchObject({
      message: "No personal identity number provided",
    });
  });

  it("will return HTTP code 422 when invalid personal identity number is provided", async () => {
    const response = await postLookupRequest({ pnr: 195406172623 });

    expect(response.statusCode).toEqual(422);
    expect(response.body).toMatchObject({
      message: "Invalid format of personal identity number",
    });
  });

  it("will return HTTP code 503 when response from SPAR registry responsds with an error", async () => {
    nock(BASE_URL).post("/").replyWithError("Error");

    const response = await postLookupRequest({ pnr: 195406172626 });

    expect(response.statusCode).toEqual(503);
    expect(response.body).toMatchObject({
      message: "Could not communicate with SPAR service",
    });
  });

  it("will return HTTP code 200 and the parsed JSON data", async () => {
    nock(BASE_URL).post("/").reply(200, mockXMLResponse, {
      "Content-Type": "application/xml",
    });

    const response = await postLookupRequest({ pnr: 195406172626 });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatchObject({
      note: {
        to: "Tove",
      },
    });
  });
});
