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

export type CSLDate = {
  /** [ [YYYY, MM, DD] ] 형태 */
  "date-parts": [number, number?, number?][];
};

export type CSLAuthor = {
  given: string;
  family: string;
};

export type CSL = {
  author: CSLAuthor[];
  "container-title": string;
  id: string;
  type: string;
  title: string;
  issued: CSLDate;
  URL: string;
  DOI: string | null;
};

export type SendUrlResponseData = {
  cite_id: number;
  csl: CSL;
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
