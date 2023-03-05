import { describe, it, expect, afterEach } from "@jest/globals";
import nock from "nock";
import supertest from "supertest";
import { app } from "../../app";
import { successfulXmlResponse } from "./mockResponses";

const SPAR_BASE_URL = `https://kt-ext-ws.statenspersonadressregister.se/2021.1/`;
describe("POST /lookup-request", () => {
  const postLookupRequest = (body: Record<string, unknown> = {}) =>
    supertest(app).post("/lookup-request").send(body);

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
    nock(SPAR_BASE_URL).post("/").replyWithError("Error");

    const response = await postLookupRequest({ pnr: 195406172626 });

    expect(response.statusCode).toEqual(503);
    expect(response.body).toMatchObject({
      message: "Could not communicate with SPAR service",
    });
  });

  it("will return HTTP code 200 and the parsed JSON data", async () => {
    nock(SPAR_BASE_URL).post("/").reply(200, successfulXmlResponse, {
      "Content-Type": "application/xml",
    });

    const response = await postLookupRequest({ pnr: 195406172626 });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toMatchObject({
      PersonId: { IdNummer: "197910209290", Typ: "PERSONNUMMER" },
      Sekretessmarkering: "NEJ",
      SkyddadFolkbokforing: "NEJ",
      SenasteAndringSPAR: "2019-12-02",
      Namn: {
        DatumFrom: "2019-12-02",
        DatumTill: "9999-12-31",
        Fornamn: "Rudolf Valentino",
        Efternamn: "Efternamn1074",
      },
      Persondetaljer: {
        DatumFrom: "2019-12-02",
        DatumTill: "9999-12-31",
        Sekretessmarkering: "NEJ",
        SkyddadFolkbokforing: "NEJ",
        Fodelsedatum: "1979-10-20",
        Kon: "MAN",
      },
      Folkbokforing: [
        {
          DatumFrom: "2019-12-02",
          DatumTill: "9999-12-31",
          FolkbokfordLanKod: "01",
          FolkbokfordKommunKod: "82",
          Hemvist: "Skriven på adressen",
          Folkbokforingsdatum: "1990-12-01",
          DistriktKod: "212103",
        },
        {
          DatumFrom: "2010-02-02",
          DatumTill: "2019-12-02",
          FolkbokfordLanKod: "01",
          FolkbokfordKommunKod: "82",
          Hemvist: "Skriven på adressen",
          Folkbokforingsdatum: "1990-12-01",
        },
      ],
      Folkbokforingsadress: {
        SvenskAdress: {
          DatumFrom: "2019-12-02",
          DatumTill: "9999-12-31",
          Utdelningsadress2: "Gatan101 2",
          PostNr: "13336",
          Postort: "SALTSJÖBADEN",
        },
      },
    });
  });
});
