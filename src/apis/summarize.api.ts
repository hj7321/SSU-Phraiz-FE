// src/apis/summarize.api.ts에 추가
import { api } from "./api";

export type SummarizeApiMode =
  | "one-line"
  | "full"
  | "by-paragraph"
  | "key-points"
  | "question-based"
  | "targeted";

interface SummarizeRequest {
  text: string;
  question?: string; // 'question-based' 모드일 때
  target?: string; // 'targeted' 모드일 때
  folderId?: null | number;
  historyId?: null | number;
}

export interface SummarizeResponse {
  resultHistoryId: number;
  name: string;
  originalText: string;
  summarizedText: string;
  sequenceNumber: number;
  remainingToken: number;

  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  tokens_used?: number;
  token_count?: number;
}

// 기존 텍스트 요약 API
export const requestSummarize = async (
  mode: SummarizeApiMode,
  data: SummarizeRequest | FormData
): Promise<SummarizeResponse> => {
  const url = `/summary/summarize/${mode}`;

  if (data instanceof FormData) {
    const response = await api.post<SummarizeResponse>(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  const response = await api.post<SummarizeResponse>(url, data);
  return response.data;
};

// 파일 업로드 전용 API
export const requestSummarizeWithFile = async (
  file: File,
  mode: SummarizeApiMode,
  question?: string,
  target?: string
): Promise<SummarizeResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("mode", mode);

  if (question) {
    formData.append("question", question);
  }
  if (target) {
    formData.append("target", target);
  }

  const response = await api.post<SummarizeResponse>(
    "/summary/file-upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
