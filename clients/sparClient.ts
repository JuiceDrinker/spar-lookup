import axios from "axios";
import https from "https";
import fs from "fs";
import parser from "xml2json";
import { LookupResponse, MappedLookupResponse } from "./types";

export const sparClient = () => {
  const BASE_URL = `https://kt-ext-ws.statenspersonadressregister.se/2021.1/`;

  const createRequestBody = (
    pnr: string
  ) => `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:per="http://statenspersonadressregister.se/schema/personsok/2021.1/personsokningfraga" xmlns:iden="http://statenspersonadressregister.se/schema/komponent/metadata/identifieringsinformationWs-1.1" xmlns:per1="http://statenspersonadressregister.se/schema/komponent/sok/personsokningsokparametrar-1.1" xmlns:per2="http://statenspersonadressregister.se/schema/komponent/person/person-1.2" xmlns:sok="http://statenspersonadressregister.se/schema/komponent/sok/sokargument-1.2">
  <soapenv:Header/>
  <soapenv:Body>
     <per:SPARPersonsokningFraga>
        <iden:Identifieringsinformation>
           <iden:KundNrLeveransMottagare>500243</iden:KundNrLeveransMottagare>
           <iden:KundNrSlutkund>500243</iden:KundNrSlutkund>
           <iden:UppdragId>637</iden:UppdragId>
           <iden:SlutAnvandarId>spar-lookup</iden:SlutAnvandarId>
        </iden:Identifieringsinformation>
        <per1:PersonsokningFraga>
           <per2:IdNummer>${pnr}</per2:IdNummer> 
        </per1:PersonsokningFraga>
     </per:SPARPersonsokningFraga>
  </soapenv:Body>
  </soapenv:Envelope>`;

  const httpsAgent = new https.Agent({
    cert: fs.readFileSync("./certificates/bolag-a.crt"),
    key: fs.readFileSync("./certificates//bolag-a.key"),
    keepAlive: true,
  });

  const mapResponseToDomain = (parsedResponse: Record<string, unknown>) => {
    const data = parsedResponse["Envelope"]["Body"]["SPARPersonsokningSvar"];
    if (data["PersonsokningSvarspost"]) {
      return data["PersonsokningSvarspost"];
    } else {
      throw new Error("Not found in SPAR registry");
    }
  };
  return {
    makeLookupRequest: async (pnr: string): Promise<MappedLookupResponse> => {
      const response: { data: LookupResponse } = await axios.post(
        BASE_URL,
        createRequestBody(pnr),
        {
          headers: { "Content-Type": "text/xml" },
          httpsAgent,
        }
      );

      if (typeof response.data === "string") {
        const parsedResponse = parser.toJson(removeXmlTags(response.data), {
          object: true,
        });
        return mapResponseToDomain(parsedResponse);
      } else {
        throw new Error("Communication error with SPAR service");
      }
    },
  };
};

const removeXmlTags = (str: string) =>
  str.replace(/(ns\d:)|(ns\d\d:)|(S:)/g, "");
