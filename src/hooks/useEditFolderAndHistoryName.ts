import { editFolderName } from "@/apis/folder.api";
import { editHistoryName } from "@/apis/history.api";
import { ServiceCode } from "@/types/common.type";
import { FolderList } from "@/types/folder.type";
import { HistoryList } from "@/types/history.type";
import {
  updateFolderNameInCache,
  updateHistoryNameInCache,
} from "@/utils/sidebarCache";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";

type EditFolderVars = { folderId: number; name: string };
type EditHistoryVars = { historyId: number; name: string };
type Ctx<T> = { prev?: InfiniteData<T, number> };

const useEditFolderAndHistoryName = (service?: ServiceCode) => {
  const queryClient = useQueryClient();

  const serviceRef = useRef<ServiceCode | undefined>(service);
  useEffect(() => {
    serviceRef.current = service;
  }, [service]);

  const { mutateAsync: editFolderNameAsync } = useMutation<
    void,
    Error,
    EditFolderVars,
    Ctx<FolderList>
  >({
    mutationKey: ["editFolderName", service],
    mutationFn: async ({ folderId, name }) => {
      const svc = serviceRef.current;
      if (!svc) throw new Error("서비스가 설정되지 않았습니다.");
      await editFolderName({ service: svc, folderId, name });
    },
    onMutate: async ({ folderId, name }) => {
      const svc = serviceRef.current;
      if (!svc) return {};
      await queryClient.cancelQueries({ queryKey: ["sidebar-folder", svc] });

      const prev = queryClient.getQueryData<InfiniteData<FolderList, number>>([
        "sidebar-folder",
        svc,
      ]);

      queryClient.setQueryData(
        ["sidebar-folder", svc],
        (old: InfiniteData<FolderList, number> | undefined) =>
          updateFolderNameInCache(old, folderId, name)
      );

      return { prev };
    },
    onError: (_e, _v, ctx) => {
      const svc = serviceRef.current;
      if (svc && ctx?.prev)
        queryClient.setQueryData(["sidebar-folder", svc], ctx.prev);
      alert("폴더 이름 변경 중 오류가 발생했습니다.");
    },
    onSettled: () => {
      const svc = serviceRef.current;
      if (!svc) return;
      queryClient.invalidateQueries({ queryKey: ["sidebar-folder", svc] });
    },
  });

  const { mutateAsync: editHistoryNameAsync } = useMutation<
    void,
    Error,
    EditHistoryVars,
    Ctx<HistoryList>
  >({
    mutationKey: ["editHistoryName", service],
    mutationFn: async ({ historyId, name }) => {
      const svc = serviceRef.current;
      if (!svc) throw new Error("서비스가 설정되지 않았습니다.");
      await editHistoryName({ service: svc, historyId, name });
    },
    onMutate: async ({ historyId, name }) => {
      const svc = serviceRef.current;
      if (!svc) return {};
      await queryClient.cancelQueries({ queryKey: ["sidebar-history", svc] });

      const prev = queryClient.getQueryData<InfiniteData<HistoryList, number>>([
        "sidebar-history",
        svc,
      ]);

      queryClient.setQueryData(
        ["sidebar-history", svc],
        (old: InfiniteData<HistoryList, number> | undefined) =>
          updateHistoryNameInCache(old, historyId, name)
      );

      return { prev };
    },
    onError: (_e, _v, ctx) => {
      const svc = serviceRef.current;
      if (svc && ctx?.prev)
        queryClient.setQueryData(["sidebar-history", svc], ctx.prev);
      alert("히스토리 이름 변경 중 오류가 발생했습니다.");
    },
    onSettled: () => {
      const svc = serviceRef.current;
      if (!svc) return;
      queryClient.invalidateQueries({ queryKey: ["sidebar-history", svc] });
    },
  });

  return { editFolderNameAsync, editHistoryNameAsync };
};

export default useEditFolderAndHistoryName;
