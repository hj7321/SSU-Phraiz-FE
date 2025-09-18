import axios from "axios";
import { api } from "./api";
import {
  ReadDetailCitationInfoResponseData,
  SendCitationType,
  SendUrlResponseData,
  SendUrlType,
} from "@/types/citation.type";
import { SuccessResponseData } from "@/types/common.type";

// 인용문을 생성할 정보가 담긴 URL 보내기
export const sendUrl = async ({
  url,
  session,
}: SendUrlType): Promise<SendUrlResponseData> => {
  const path = "/cite/getUrlData";
  try {
    const response = await api.post<SendUrlResponseData>(path, {
      url: url,
      session: session,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error("[sendUrl] Axios 에러: ", error.response.data.message);
        throw new Error(error.response.data.message);
      } else console.error("[sendUrl] Axios 에러: ", error);
    } else {
      console.error("[sendUrl] 일반 에러: ", error);
    }
    throw error;
  }
};

// 인용문 보내기 (히스토리 저장을 위해)
export const sendCitation = async ({
  citeId,
  citation,
  style,
}: SendCitationType): Promise<SuccessResponseData> => {
  const path = "/cite/getCitation";
  try {
    const response = await api.post<SuccessResponseData>(path, {
      citeId: citeId,
      citation: citation,
      style: style,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[sendCitation] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[sendCitation] Axios 에러: ", error);
    } else {
      console.error("[sendCitation] 일반 에러: ", error);
    }
    throw error;
  }
};

// 인용문 상세 조회하기
export const readDetailCitationInfo = async (
  citeId: string
): Promise<ReadDetailCitationInfoResponseData> => {
  const path = `/cite/citeDetail/${citeId}`;
  try {
    const response = await api.get<ReadDetailCitationInfoResponseData>(path);
    const data = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[readDetailCitationInfo] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[readDetailCitationInfo] Axios 에러: ", error);
    } else {
      console.error("[readDetailCitationInfo] 일반 에러: ", error);
    }
    throw error;
  }
};
