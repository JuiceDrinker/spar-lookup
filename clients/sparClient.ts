import axios from "axios";
import https from "https";
import fs from "fs";
import parser from "xml2json";

type LookupResponse = {
  "S:Envelope": {
    "S:Body": {
      "ns4:PersonId": {
        "ns4:IdNummer": string;
        "ns4:Typ": string;
      };
      "ns5:Sekretessmarkering": string;
      "ns5:SkyddadFolkbokforing": string;
      "ns4:SenasteAndringSPAR": string;
      "ns8:Namn": {
        "ns2:DatumFrom": string;
        "ns2:DatumTill": string;
        "ns7:Fornamn": string;
        "ns7:Efternamn": string;
      };
      "ns10:Persondetaljer": {
        "ns2:DatumFrom": Date;
        "ns2:DatumTill": Date;
        "ns5:Sekretessmarkering": string;
        "ns5:SkyddadFolkbokforing": string;
        "ns9:AvregistreringsorsakKod": string;
        "ns9:Avregistreringsdatum": Date;
        "ns10:Fodelsedatum": Date;
        "ns10:Kon": string;
      };
      "ns16:Utlandsadress": {
        "ns3:InternationellAdress": {
          "ns2:DatumFrom": Date;
          "ns2:DatumTill": Date;
          "ns3:Utdelningsadress1": string;
          "ns3:Utdelningsadress2": string;
          "ns3:Utdelningsadress3": string;
          "ns3:Land": string;
        };
      };
    };
  };
};

type MappedLookupResponse = {
  PersonId: {
    IdNummer: string;
    Typ: string;
  };
  Sekretessmarkering: string;
  SkyddadFolkbokforing: string;
  SenasteAndringSPAR: string;
  Namn: {
    DatumFrom: string;
    DatumTill: string;
    Fornamn: string;
    Efternamn: string;
  };
  Persondetaljer: {
    DatumFrom: Date;
    DatumTill: Date;
    Sekretessmarkering: string;
    SkyddadFolkbokforing: string;
    AvregistreringsorsakKod: string;
    Avregistreringsdatum: Date;
    Fodelsedatum: Date;
    Kon: string;
  };
  Utlandsadress: {
    InternationellAdress: {
      DatumFrom: Date;
      DatumTill: Date;
      Utdelningsadress1: string;
      Utdelningsadress2: string;
      Utdelningsadress3: string;
      Land: string;
    };
  };
};

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
