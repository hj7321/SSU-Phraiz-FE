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
  historyId: number;
  name: string;
  originalText: string;
  summarizedText?: string;
  paraphrasedText?: string;
  sequenceNumber: number;
  remainingToken: number;
  mode?: string; // "standard" | "academic" | "creative" | "fluency" | "experimental" | "custom"
  userRequestMode?: string; // 사용자 지정 모드일 때의 커스텀 스타일
  scale?: number; // 창의성 레벨 (0-100)
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
