import { ApiResponse } from "./common.type";

export type PageAndSize = {
  page?: number;
  size?: number;
};

export type FolderId = { folderId?: number };

export type Folder = {
  id: number;
  name: string;
  createdAt: string;
};

export type FolderWrapper = { folders: Folder[] };

export type FolderList = ApiResponse<FolderWrapper>;
