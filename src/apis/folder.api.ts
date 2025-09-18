import axios from "axios";
import { api } from "./api";
import { FolderId, FolderList, PageAndSize } from "@/types/folder.type";
import { Service } from "@/types/common.type";

// 폴더 목록 불러오기
export const findFolderList = async ({
  service,
  page,
  size,
}: Service & PageAndSize): Promise<FolderList> => {
  const path = `/${service}/folders`;
  try {
    const response = await api.get<FolderList>(path, {
      params: { page: page ?? undefined, size: size ?? undefined },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[findFolderList] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[findFolderList] Axios 에러: ", error);
    } else {
      console.error("[findFolderList] 일반 에러: ", error);
    }
    throw error;
  }
};

// 폴더 생성
export const createFolder = async ({
  service,
  name,
}: Service & { name: string }) => {
  const path = `/${service}/folders`;
  try {
    const response = await api.post(path, { name });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[createFolder] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[createFolder] Axios 에러: ", error);
    } else {
      console.error("[createFolder] 일반 에러: ", error);
    }
    throw error;
  }
};

// 폴더 이름 수정
export const editFolderName = async ({
  service,
  folderId,
  name,
}: Service & FolderId & { name: string }) => {
  const path = `/${service}/folders/${folderId}`;
  try {
    const response = await api.patch(path, { name });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[editFolderName] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[editFolderName] Axios 에러: ", error);
    } else {
      console.error("[editFolderName] 일반 에러: ", error);
    }
    throw error;
  }
};

// 폴더 삭제
export const deleteFolder = async ({
  service,
  folderId,
}: Service & FolderId) => {
  const path = `/${service}/folders/${folderId}`;
  try {
    const response = await api.delete(path);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.data.code) {
        console.error(
          "[deleteFolder] Axios 에러: ",
          error.response.data.message
        );
        throw new Error(error.response.data.message);
      } else console.error("[deleteFolder] Axios 에러: ", error);
    } else {
      console.error("[deleteFolder] 일반 에러: ", error);
    }
    throw error;
  }
};
