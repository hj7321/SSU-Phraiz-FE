import { api } from "./api";
export type ParaphraseApiMode = "standard" | "academic" | "creative" | "fluency" | "experimental" | "custom";

// 파라미터 타입 정의
interface ParaphraseRequest {
  text: string;
  userRequestMode?: string;
  scale?: number;
}

export interface ParaphraseResponse {
  result: string;
  resultHistoryId: number;
  name: string;
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
  const response = await api.post<ParaphraseResponse>(url, data);
  return response.data;
};
