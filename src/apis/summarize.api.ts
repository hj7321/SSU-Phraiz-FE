import { api } from "./api";
export type SummarizeApiMode = "one-line" | "full" | "by-paragraph" | "key-points" | "question-based" | "targeted";

// 파라미터 타입 정의
interface SummarizeRequest {
  text: string;
  question?: string; // 'question-based' 모드일 때
  target?: string; // 'targeted' 모드일 때
}

// api 응답 데이터타입 정의
interface SummarizeResponse {
  result: string;
}

export const requestSummarize = async (mode: SummarizeApiMode, data: SummarizeRequest): Promise<SummarizeResponse> => {
  const url = `/summary/summarize/${mode}`;
  const response = await api.post<SummarizeResponse>(url, data);
  return response.data;
};
