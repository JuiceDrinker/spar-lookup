export type LookupResponse = {
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

export type MappedLookupResponse = {
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
