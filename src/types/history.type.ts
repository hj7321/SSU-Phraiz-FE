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

export type History = {
  id: number;
  name: string;
  lastUpdate: string;
};

export type HistoryWrapper = { histories: History[] };

export type HistoryList = ApiResponse<HistoryWrapper>;
