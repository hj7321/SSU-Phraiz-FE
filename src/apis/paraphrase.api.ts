import { api } from "./api";
export type ParaphraseApiMode = "standard" | "academic" | "creative" | "fluency" | "experimental" | "custom";

// 파라미터 타입 정의
interface ParaphraseRequest {
  text: string;
  userRequestMode?: string;
}

// api 응답 데이터타입 정의
interface ParaphraseResponse {
  result: string;

  // 토큰 사용량 정보 (optional로 추가)
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };

  // 다른 가능한 토큰 필드명들도 대비
  tokens_used?: number;
  token_count?: number;
}

export const requestParaphrase = async (mode: ParaphraseApiMode, data: ParaphraseRequest): Promise<ParaphraseResponse> => {
  const url = `/paraphrase/paraphrasing/${mode}`;
  const response = await api.post<ParaphraseResponse>(url, data);
  return response.data;
};
