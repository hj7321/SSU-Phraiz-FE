import { ApiResponse } from "./common.type";
import { FolderId, PageAndSize } from "./folder.type";

export type HistoryId = { historyId?: number };

export type HistoryAndFolderId = HistoryId & FolderId;

export type FolderIdWithPageAndSize = FolderId & PageAndSize;

export type LatestHistory = {
  id: number;
  content: string;
  lastUpdate: string;
  citeId: number;
};

export type HistoryName = {
  id: number;
  name: string;
  lastUpdate: string;
};

export type HistoryAIContent = {
  resultHistoryId: number;
  name: string;
  originalText: string;
  paraphrasedText?: string;
  summarizedText?: string;
  sequenceNumber: number;
  remainingToken: number;
};

export type HistoryCiteContent = {
  id: number;
  url: string;
  style: string;
  citationText: string;
  lastUpdate: string;
  sequenceNumber?: number;
};

export type HistoryWrapper = { histories: HistoryName[] };

export type HistoryList = ApiResponse<HistoryWrapper>;
