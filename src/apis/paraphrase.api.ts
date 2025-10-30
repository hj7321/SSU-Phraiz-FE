// src/apis/paraphrase.api.ts
import { api } from "./api";

export type ParaphraseApiMode = "standard" | "academic" | "creative" | "fluency" | "experimental" | "custom";

interface ParaphraseRequest {
  text?: string;
  userRequestMode?: string;
  scale?: number;
  folderId?: null | number;
  historyId?: null | number;
}
export interface ParaphraseResponse {
  historyId: number;
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

export const requestParaphrase = async (mode: ParaphraseApiMode, data: ParaphraseRequest): Promise<ParaphraseResponse> => {
  const url = `/paraphrase/paraphrasing/${mode}`;

  if (data instanceof FormData) {
    const response = await api.post<ParaphraseResponse>(url, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  }

  console.log("--- API 요청 디버깅 (Paraphrase) ---");
  console.log(`[Request URL]: POST ${url}`);
  console.log("[Request Body]:", data);
  console.log("------------------------------------");

  const response = await api.post<unknown>(url, data);

  // Type narrowing: response.data의 타입을 체크
  if (typeof response !== "object" || response === null || !("data" in response)) {
    throw new Error("Invalid response from Paraphrase API");
  }

  const responseData = response.data as Record<string, unknown>;

  const processedResponse: ParaphraseResponse = {
    historyId: typeof responseData.resultHistoryId === "number" ? responseData.resultHistoryId : 0,
    name: typeof responseData.name === "string" ? responseData.name : "",
    originalText: typeof responseData.originalText === "string" ? responseData.originalText : "",
    paraphrasedText: typeof responseData.paraphrasedText === "string" ? responseData.paraphrasedText : "",
    sequenceNumber: typeof responseData.sequenceNumber === "number" ? responseData.sequenceNumber : 0,
    remainingToken: typeof responseData.remainingToken === "number" ? responseData.remainingToken : 0
  };

  return processedResponse;
};
