import { useQuery } from "@tanstack/react-query";
import { findHistoryList } from "@/apis/history.api";
import { useAuthStore } from "@/stores/auth.store";
import type { ServiceCode } from "@/types/common.type";

export default function useFolderHistoryCount(
  service?: ServiceCode,
  folderId?: number,
  enabled: boolean = true
) {
  const planTier = useAuthStore((s) => s.planTier);

  return useQuery({
    queryKey: ["folder-count", service, folderId],
    enabled: !!service && folderId != null && enabled && planTier !== "Free",
    queryFn: () =>
      findHistoryList({
        service: service!,
        folderId: folderId!,
        page: 0,
        size: 1,
      }),
    select: (res) => res.totalElements, // 바로 총 개수만 꺼내서 전달
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });
}
