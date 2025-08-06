import axios from "axios";
import { api } from "./api";
import {
  EditCitationFileNameType,
  FindCitationHistoryResponseData,
  ReadDetailCitationInfoResponseData,
  SendCitationType,
  SendUrlResponseData,
  SendUrlType,
} from "@/types/citation.type";
import { SuccessResponseData } from "@/types/common.type";
import { Message } from "postcss";

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

// 사용자별 인용문 히스토리 가져오기
export const findCitationHistory = async (): Promise<
  FindCitationHistoryResponseData[]
> => {
  const path = "/cite/myCitations";
  try {
    const response = await api.get<FindCitationHistoryResponseData[]>(path);
    const data = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[findCitationHistory] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[findCitationHistory] Axios 에러: ", error);
    } else {
      console.error("[findCitationHistory] 일반 에러: ", error);
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

// 파일 이름 변경하기
export const editCitationFileName = async ({
  citeId,
  title,
}: EditCitationFileNameType): Promise<Message> => {
  const path = "/cite/renameCiteFile";
  try {
    const response = await api.patch<Message>(path, {
      citeId: citeId,
      newTitle: title,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[editCitationFileName] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[editCitationFileName] Axios 에러: ", error);
    } else {
      console.error("[editCitationFileName] 일반 에러: ", error);
    }
    throw error;
  }
};

// 파일 삭제하기
export const deleteCitationFile = async (): Promise<Message> => {
  const path = "/cite/deleteCiteFile";
  try {
    const response = await api.delete<Message>(path);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[deleteCitationFile] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[deleteCitationFile] Axios 에러: ", error);
    } else {
      console.error("[deleteCitationFile] 일반 에러: ", error);
    }
    throw error;
  }
};
