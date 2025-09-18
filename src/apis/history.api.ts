import { Service } from "@/types/common.type";
import {
  FolderIdWithPageAndSize,
  HistoryAndFolderId,
  HistoryId,
  HistoryList,
} from "@/types/history.type";
import { api } from "./api";
import axios from "axios";
import { FolderId } from "@/types/folder.type";

// 히스토리 목록 불러오기
export const findHistoryList = async ({
  service,
  folderId,
  page,
  size,
}: Service & FolderIdWithPageAndSize): Promise<HistoryList> => {
  const path = `/${service}/histories`;
  try {
    const response = await api.get<HistoryList>(path, {
      params: {
        page: page ?? undefined,
        size: size ?? undefined,
        folderId: folderId ?? undefined,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[findHistoryList] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[findHistoryList] Axios 에러: ", error);
    } else {
      console.error("[findHistoryList] 일반 에러: ", error);
    }
    throw error;
  }
};

// 히스토리 생성
export const createHistory = async ({
  service,
  folderId,
  name,
}: Service & FolderId & { name: string }) => {
  const path = folderId
    ? `/${service}/histories/${folderId}`
    : `/${service}/histories`;
  try {
    const response = await api.post(path, { name });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[createHistory] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[createHistory] Axios 에러: ", error);
    } else {
      console.error("[createHistory] 일반 에러: ", error);
    }
    throw error;
  }
};

// 히스토리 이름 수정
export const editHistoryName = async ({
  service,
  historyId,
  name,
}: Service & HistoryId & { name: string }) => {
  const path = `/${service}/histories/${historyId}`;
  try {
    const response = await api.patch(path, { name });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[editHistoryName] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[editHistoryName] Axios 에러: ", error);
    } else {
      console.error("[editHistoryName] 일반 에러: ", error);
    }
    throw error;
  }
};

// 히스토리 이동(폴더 변경)
export const moveFolder = async ({
  service,
  historyId,
  folderId,
}: Service & HistoryAndFolderId) => {
  const path = `/${service}/histories/${historyId}`;
  try {
    const response = await api.patch(path, { folderId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error("[moveFolder] Axios 에러: ", error.response.data.message);
        throw new Error(error.response.data.message);
      } else console.error("[moveFolder] Axios 에러: ", error);
    } else {
      console.error("[moveFolder] 일반 에러: ", error);
    }
    throw error;
  }
};

// 히스토리 삭제
export const deleteHistory = async ({
  service,
  historyId,
}: Service & HistoryId) => {
  const path = `/${service}/histories/${historyId}`;
  try {
    const response = await api.delete(path);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error("[moveFolder] Axios 에러: ", error.response.data.message);
        throw new Error(error.response.data.message);
      } else console.error("[moveFolder] Axios 에러: ", error);
    } else {
      console.error("[moveFolder] 일반 에러: ", error);
    }
    throw error;
  }
};

// 히스토리 최신 내용 조회
export const readLatestHistory = async ({
  service,
  historyId,
}: Service & HistoryId) => {
  const path = `/${service}/histories/${historyId}/latest`;
  try {
    const response = await api.get(path);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[readLatestHistory] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[readLatestHistory] Axios 에러: ", error);
    } else {
      console.error("[readLatestHistory] 일반 에러: ", error);
    }
    throw error;
  }
};
