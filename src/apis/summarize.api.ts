// src/apis/summarize.api.ts

import api from "./api"; // api.ts에서 만든 커스텀 axios 인스턴스를 불러옵니다.

// 1. API가 요구하는 요약 모드의 종류를 타입으로 정의합니다.
export type SummarizeApiMode = "one-line" | "full" | "by-paragraph" | "key-points" | "question-based" | "targeted";

// 2. API 요청에 필요한 파라미터 타입을 정의합니다.
// 'question-based' 또는 'targeted' 모드일 때만 question/target이 필요하므로 옵셔널로 만듭니다.
interface SummarizeRequest {
  text: string;
  question?: string; // 'question-based' 모드일 때만 사용
  target?: string; // 'targeted' 모드일 때만 사용
}

// 3. API 응답으로 받을 데이터 타입을 정의합니다.
interface SummarizeResponse {
  result: string;
}

// 4. 텍스트 요약을 요청하는 함수를 export const로 선언합니다.
export const requestSummarize = async (mode: SummarizeApiMode, data: SummarizeRequest): Promise<SummarizeResponse> => {
  // 5. 명세서에 따라 동적으로 API 경로를 만듭니다.
  const url = `/api/summary/summarize/${mode}`;

  // 6. api 인스턴스를 사용해 POST 요청을 보냅니다.
  const response = await api.post<SummarizeResponse>(url, data);

  // 7. 성공적으로 받은 데이터(결과값)만 반환합니다.
  return response.data;
};
