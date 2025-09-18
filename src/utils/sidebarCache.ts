import { FolderList } from "@/types/folder.type";
import { HistoryList } from "@/types/history.type";
import { InfiniteData } from "@tanstack/react-query";

export function updateFolderNameInCache(
  old: InfiniteData<FolderList, number> | undefined,
  targetId: number,
  newName: string
) {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      content: page.content.map((wrapper) => ({
        ...wrapper,
        folders: wrapper.folders.map((f) =>
          f.id === targetId ? { ...f, name: newName } : f
        ),
      })),
    })),
  };
}

export function updateHistoryNameInCache(
  old: InfiniteData<HistoryList, number> | undefined,
  targetId: number,
  newName: string
) {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      content: page.content.map((wrapper) => ({
        ...wrapper,
        histories: wrapper.histories.map((h) =>
          h.id === targetId ? { ...h, name: newName } : h
        ),
      })),
    })),
  };
}
