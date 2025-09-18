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

export type HistoryContent = {
  id: number;
  content: string;
  lastUpdate: string;
};

export type HistoryWrapper = { histories: HistoryName[] };

export type HistoryList = ApiResponse<HistoryWrapper>;
