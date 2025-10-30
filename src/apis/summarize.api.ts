// src/apis/summarize.api.ts
import { api } from "./api";

export type SummarizeApiMode = "one-line" | "full" | "by-paragraph" | "key-points" | "question-based" | "targeted";

interface SummarizeRequest {
  text: string;
  question?: string;
  target?: string;
  folderId?: null | number;
  historyId?: null | number;
}

export interface SummarizeResponse {
  historyId: number;
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

// 텍스트 요약 API - historyId를 Body에 포함
export const requestSummarize = async (mode: SummarizeApiMode, data: SummarizeRequest | FormData): Promise<SummarizeResponse> => {
  const url = `/summary/summarize/${mode}`;

  if (data instanceof FormData) {
    const response = await api.post<SummarizeResponse>(url, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  }

  // 디버깅 로그
  console.log("--- API 요청 디버깅 (Summarize) ---");
  console.log(`[Request URL]: POST ${url}`);
  console.log("[Request Body]:", data);
  console.log("------------------------------------");

  // historyId를 Body에 그대로 포함해서 전송
  const response = await api.post<SummarizeResponse>(url, data);
  return response.data;
};

// 파일 업로드 API - historyId를 FormData에 포함
export const requestSummarizeWithFile = async (file: File, mode: SummarizeApiMode, question?: string, target?: string, historyId?: number): Promise<SummarizeResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("mode", mode);

  if (question) formData.append("question", question);
  if (target) formData.append("target", target);
  if (historyId) formData.append("historyId", String(historyId));

  const response = await api.post<SummarizeResponse>("/summary/file-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};
