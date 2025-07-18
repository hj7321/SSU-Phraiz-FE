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
}

export const requestParaphrase = async (mode: ParaphraseApiMode, data: ParaphraseRequest): Promise<ParaphraseResponse> => {
  const url = `/paraphrase/paraphrasing/${mode}`;
  const response = await api.post<ParaphraseResponse>(url, data);
  return response.data;
};
