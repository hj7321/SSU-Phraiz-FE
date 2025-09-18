import { useEffect, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { editFolderName } from "@/apis/folder.api";
import { editHistoryName } from "@/apis/history.api";
import type { ServiceCode } from "@/types/common.type";
import type { FolderList } from "@/types/folder.type";
import type { HistoryList } from "@/types/history.type";
import {
  updateFolderNameInCache,
  updateHistoryNameInCache,
} from "@/utils/sidebarCache";

/** optimistic update context */
type Ctx<T> = { prev?: InfiniteData<T, number> };

const useEditFolderAndHistoryName = (service?: ServiceCode) => {
  const qc = useQueryClient();

  /** service가 뮤테이션 클로저에 고정되지 않도록 ref로 보관 */
  const serviceRef = useRef<ServiceCode | undefined>(service);
  useEffect(() => {
    serviceRef.current = service;
  }, [service]);

  /** ───────────── 폴더 이름 변경 ───────────── */
  const { mutateAsync: editFolderNameAsync } = useMutation<
    void,
    Error,
    { folderId: number; name: string },
    Ctx<FolderList>
  >({
    mutationKey: ["editFolderName", service],
    retry: 0, // 실패 시 재시도 금지 (alert/blur 루프 방지)
    mutationFn: async ({ folderId, name }) => {
      const svc = serviceRef.current;
      if (!svc) throw new Error("서비스가 설정되지 않았습니다.");
      await editFolderName({ service: svc, folderId, name });
    },
    onMutate: async ({ folderId, name }) => {
      const svc = serviceRef.current;
      if (!svc) return {};

      await qc.cancelQueries({ queryKey: ["sidebar-folder", svc] });

      const prev = qc.getQueryData<InfiniteData<FolderList, number>>([
        "sidebar-folder",
        svc,
      ]);

      qc.setQueryData(
        ["sidebar-folder", svc],
        (old: InfiniteData<FolderList, number> | undefined) =>
          updateFolderNameInCache(old, folderId, name)
      );

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      // 조용히 롤백만. 사용자 알림은 호출부에서 1회 처리.
      const svc = serviceRef.current;
      if (svc && ctx?.prev) {
        qc.setQueryData(["sidebar-folder", svc], ctx.prev);
      }
    },
    onSettled: () => {
      const svc = serviceRef.current;
      if (svc) qc.invalidateQueries({ queryKey: ["sidebar-folder", svc] });
    },
  });

  /** ───────────── 히스토리 이름 변경 ───────────── */
  const { mutateAsync: editHistoryNameAsync } = useMutation<
    void,
    Error,
    { historyId: number; name: string },
    Ctx<HistoryList>
  >({
    mutationKey: ["editHistoryName", service],
    retry: 0,
    mutationFn: async ({ historyId, name }) => {
      const svc = serviceRef.current;
      if (!svc) throw new Error("서비스가 설정되지 않았습니다.");
      await editHistoryName({ service: svc, historyId, name });
    },
    onMutate: async ({ historyId, name }) => {
      const svc = serviceRef.current;
      if (!svc) return {};

      await qc.cancelQueries({ queryKey: ["sidebar-history", svc] });

      const prev = qc.getQueryData<InfiniteData<HistoryList, number>>([
        "sidebar-history",
        svc,
      ]);

      qc.setQueryData(
        ["sidebar-history", svc],
        (old: InfiniteData<HistoryList, number> | undefined) =>
          updateHistoryNameInCache(old, historyId, name)
      );

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      const svc = serviceRef.current;
      if (svc && ctx?.prev) {
        qc.setQueryData(["sidebar-history", svc], ctx.prev);
      }
    },
    onSettled: () => {
      const svc = serviceRef.current;
      if (svc) qc.invalidateQueries({ queryKey: ["sidebar-history", svc] });
    },
  });

  return { editFolderNameAsync, editHistoryNameAsync };
};

export default useEditFolderAndHistoryName;
