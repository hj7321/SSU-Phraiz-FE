import { findFolderList } from "@/apis/folder.api";
import { findHistoryList } from "@/apis/history.api";
import { useAuthStore } from "@/stores/auth.store";
import { ServiceCode } from "@/types/common.type";
import { Folder, FolderList } from "@/types/folder.type";
import { HistoryName, HistoryList } from "@/types/history.type";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

const useFindFolderAndHistory = (service?: ServiceCode) => {
  const planTier = useAuthStore((state) => state.planTier);

  const folderInfiniteQuery = useInfiniteQuery<
    FolderList,
    Error,
    Folder[],
    [string, typeof service],
    number
  >({
    queryKey: ["sidebar-folder", service],
    queryFn: ({ pageParam }) =>
      findFolderList({ service: service!, page: pageParam, size: 10 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.number + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
    enabled: !!service && planTier !== "Free",
    staleTime: 60_000, // 데이터를 1분 동안은 신선한 것으로 간주
    gcTime: 5 * 60_000, // 사용하지 않는 캐시를 5분 후 메모리에서 제거
    retry: 1, // 실패 시 최대 1회 재시도
    select: (data: InfiniteData<FolderList, number>) =>
      data.pages.flatMap((p) => p.content.flatMap((w) => w.folders)),
  });

  const historyInfiniteQuery = useInfiniteQuery<
    HistoryList,
    Error,
    HistoryName[],
    [string, typeof service],
    number
  >({
    queryKey: ["sidebar-history", service],
    queryFn: ({ pageParam }) =>
      findHistoryList({ service: service!, page: pageParam, size: 10 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.number + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
    enabled: !!service,
    staleTime: 60_000, // 데이터를 1분 동안은 신선한 것으로 간주
    gcTime: 5 * 60_000, // 사용하지 않는 캐시를 5분 후 메모리에서 제거
    retry: 1, // 실패 시 최대 1회 재시도
    select: (data: InfiniteData<HistoryList, number>) =>
      data.pages.flatMap((p) => p.content.flatMap((w) => w.histories)),
  });

  return { folderInfiniteQuery, historyInfiniteQuery };
};

export default useFindFolderAndHistory;
