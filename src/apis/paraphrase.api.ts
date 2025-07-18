// src/apis/paraphrase.api.ts

import api from "./api"; // 1. api.ts에서 만든 커스텀 axios 인스턴스를 불러옵니다.

// 2. 타입스크립트를 활용하여, API가 요구하는 모드의 종류를 타입으로 미리 정의합니다[1].
// 이렇게 하면 오타를 방지하고, 코드 자동완성의 이점을 누릴 수 있습니다.
export type ParaphraseApiMode = "standard" | "academic" | "creative" | "fluency" | "experimental" | "custom";

// 3. API 요청에 필요한 파라미터 타입을 정의합니다.
interface ParaphraseRequest {
  text: string;
  userRequestMode?: string; // 'custom' 모드일 때만 사용되므로 '?'를 붙여 옵셔널(선택적) 속성으로 만듭니다.
}

// 4. API 응답으로 받을 데이터 타입을 정의합니다.
interface ParaphraseResponse {
  result: string;
}

// 5. 문장 변환을 요청하는 함수를 export const로 선언합니다.
export const requestParaphrase = async (mode: ParaphraseApiMode, data: ParaphraseRequest): Promise<ParaphraseResponse> => {
  // 6. 명세서에 따라 동적으로 API 경로를 만듭니다.
  const url = `/api/paraphrase/paraphrasing/${mode}`;

  // 7. api 인스턴스를 사용해 POST 요청을 보냅니다.
  const response = await api.post<ParaphraseResponse>(url, data);

  // 8. 성공적으로 받은 데이터(결과값)만 반환합니다.
  return response.data;
};
