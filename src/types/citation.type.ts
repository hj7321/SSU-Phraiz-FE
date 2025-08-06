export type SendUrlType = {
  url: string;
  session: string;
};

export type SendCitationType = {
  citeId: string;
  citation: string;
  style: string;
};

export type EditCitationFileNameType = {
  citeId: string;
  title: string;
};

export type SendUrlResponseData = {
  cite_id: number;
  csl: string;
};

export type FindCitationHistoryResponseData = {
  createdAt: string;
  title: string;
  citeId: number;
};

export type ReadDetailCitationInfoResponseData =
  FindCitationHistoryResponseData & {
    style: string;
    citation: string;
    url: string;
  };
