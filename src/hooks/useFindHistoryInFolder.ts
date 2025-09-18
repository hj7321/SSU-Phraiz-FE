import { useInfiniteQuery } from "@tanstack/react-query";
import { findHistoryList } from "@/apis/history.api";
import { useAuthStore } from "@/stores/auth.store";
import type { ServiceCode } from "@/types/common.type";
import type { HistoryList, HistoryName } from "@/types/history.type";

type Params = {
  service?: ServiceCode;
  folderId?: number;
  enabled?: boolean;
  pageSize?: number;
};

const useFindHistoryInFolder = ({
  service,
  folderId,
  enabled = true,
  pageSize = 10,
}: Params) => {
  const planTier = useAuthStore((s) => s.planTier);

  const query = useInfiniteQuery<
    HistoryList, // TQueryFnData (각 페이지 모양)
    Error, // TError
    { items: HistoryName[]; total: number }, // TData (select 결과)
    [
      "sidebar-history",
      "folder",
      ServiceCode | undefined,
      number | undefined,
      number | undefined
    ], // TQueryKey
    number // TPageParam
  >({
    // ⬅️ "folder"를 두 번째(필수)로 이동: 필수 → 옵션 순서
    queryKey: ["sidebar-history", "folder", service, folderId, pageSize],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }: { pageParam?: number }) =>
      findHistoryList({
        service: service!,
        folderId: folderId!,
        page: pageParam,
        size: pageSize,
      }),
    getNextPageParam: (lastPage) => {
      const next = lastPage.number + 1;
      return next < lastPage.totalPages ? next : undefined;
    },
    enabled: !!service && !!folderId && enabled && planTier !== "Free",
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,

    // pages/content 접근을 여기서 끝내고, 밖에서는 가공된 타입만 쓰게 함
    select: (data) => {
      const items = data.pages.flatMap((page) =>
        page.content.flatMap((wrap) => wrap.histories)
      );
      const total = data.pages[0]?.totalElements ?? 0;
      return { items, total };
    },
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    refetchHistoryInFolder: query.refetch,
    isFetchingHistoryInFolder: query.isFetching,
  };
};

export default useFindHistoryInFolder;
