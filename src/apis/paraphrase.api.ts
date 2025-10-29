// src/apis/paraphrase.api.ts
import { api } from "./api";

export type ParaphraseApiMode = "standard" | "academic" | "creative" | "fluency" | "experimental" | "custom";

interface ParaphraseRequest {
  text?: string;
  userRequestMode?: string;
  scale?: number;
  file?: File;
}
export interface ParaphraseResponse {
  resultHistoryId: number;
  name: string;
  originalText: string; // 필수값
  paraphrasedText: string; // result → paraphrasedText
  sequenceNumber: number; // 화살표 네비게이션용
  remainingToken: number;

  // 토큰 필드 (fallback용)
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  tokens_used?: number;
  token_count?: number;
}

export const requestParaphrase = async (mode: ParaphraseApiMode, data: ParaphraseRequest | FormData): Promise<ParaphraseResponse> => {
  const url = `/paraphrase/paraphrasing/${mode}`;

  if (data instanceof FormData) {
    const response = await api.post<ParaphraseResponse>(url, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  }

  const response = await api.post<ParaphraseResponse>(url, data);
  return response.data;
};
