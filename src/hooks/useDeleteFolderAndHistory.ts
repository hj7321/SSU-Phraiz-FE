import { deleteFolder } from "@/apis/folder.api";
import { deleteHistory } from "@/apis/history.api";
import { ServiceCode } from "@/types/common.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteFolderAndHistory = (service?: ServiceCode) => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteFolderAsync, isPending: isDeletingFolder } =
    useMutation({
      mutationKey: ["deleteFolder", service],
      mutationFn: async (folderId: number) => {
        if (!service) throw new Error("서비스가 설정되지 않았습니다.");
        return deleteFolder({ service, folderId });
      },
      onSuccess: () => {
        if (!service) return;
        queryClient.invalidateQueries({
          queryKey: ["sidebar-folder", service],
        });
      },
    });

  const { mutateAsync: deleteHistoryAsync, isPending: isDeletingHistory } =
    useMutation({
      mutationKey: ["deleteHistory", service],
      mutationFn: async (historyId: number) => {
        if (!service) throw new Error("서비스가 설정되지 않았습니다");
        return deleteHistory({ service, historyId });
      },
      onSuccess: () => {
        if (!service) return;
        queryClient.invalidateQueries({
          queryKey: ["sidebar-history", service],
        });
      },
    });

  return {
    deleteFolderAsync,
    deleteHistoryAsync,
    isDeletingFolder,
    isDeletingHistory,
  };
};

export default useDeleteFolderAndHistory;
