import { api } from "./api";
export type ParaphraseApiMode = "standard" | "academic" | "creative" | "fluency" | "experimental" | "custom";

// 파일 업로드 지원
interface ParaphraseRequest {
  text?: string;
  userRequestMode?: string; // 'custom' 모드일 때
  scale?: number; // 0-1 범위
  file?: File; // 파일 업로드 시
}

// API 응답 타입
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

// FormData와 일반 객체 모두 지원
export const requestParaphrase = async (mode: ParaphraseApiMode, data: ParaphraseRequest | FormData): Promise<ParaphraseResponse> => {
  const url = `/paraphrase/paraphrasing/${mode}`;

  // FormData인 경우 그대로 전송
  if (data instanceof FormData) {
    const response = await api.post<ParaphraseResponse>(url, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  }

  // 일반 객체인 경우
  const response = await api.post<ParaphraseResponse>(url, data);
  return response.data;
};
