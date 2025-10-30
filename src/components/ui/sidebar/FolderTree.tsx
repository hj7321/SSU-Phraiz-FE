"use client";

import { usePathname } from "next/navigation";
import TreeNode from "./TreeNode";
import { SERVICE_PATH } from "@/constants/servicePath";
import useFindFolderAndHistory from "@/hooks/useFindFolderAndHistory";
import { useState } from "react";
import useDeleteFolderAndHistory from "@/hooks/useDeleteFolderAndHistory";
import MoveHistoryDialog from "../dialog/MoveHistoryDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const FolderTree = () => {
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "folder" | "history";
    id: number;
  } | null>(null);
  const [moveTarget, setMoveTarget] = useState<number | null>(null);
  const pathname = usePathname();
  const matched = SERVICE_PATH.find((p) => pathname.includes(p.path));
  const service = matched ? matched.service : undefined;

  const { folderInfiniteQuery, historyInfiniteQuery } =
    useFindFolderAndHistory(service);

  const { deleteFolderAsync, deleteHistoryAsync } =
    useDeleteFolderAndHistory(service);

  const folders = folderInfiniteQuery.data ?? [];
  const Histories = historyInfiniteQuery.data ?? [];

  const onRequestDelete = (payload: {
    type: "folder" | "history";
    id: number;
  }) => setDeleteTarget(payload);

  const onRequestMove = (historyId: number) => setMoveTarget(historyId);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "folder")
        await deleteFolderAsync(deleteTarget.id);
      else await deleteHistoryAsync(deleteTarget.id);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="text-sm">
      {/* 폴더 목록 */}
      <ul className="space-y-[2px] pb-2">
        {folders.map((f) => (
          <TreeNode
            key={f.id}
            node={{ id: f.id, name: f.name, children: [] }}
            onRequestDelete={() =>
              onRequestDelete({ type: "folder", id: Number(f.id) })
            }
            onRequestMove={undefined}
          />
        ))}
      </ul>

      {/* 히스토리 목록 (간격 좁게) */}
      <ul className="space-y-[1px]">
        {Histories.map((h) => (
          <TreeNode
            key={h.id}
            node={{ id: h.id, name: h.name }}
            onRequestDelete={() =>
              onRequestDelete({ type: "history", id: Number(h.id) })
            }
            onRequestMove={() => onRequestMove(Number(h.id))}
          />
        ))}
      </ul>

      {/* 이동 모달 */}
      <MoveHistoryDialog
        open={moveTarget !== null}
        onOpenChange={(o) => !o && setMoveTarget(null)}
        service={service!}
        historyId={moveTarget ?? 0}
      />

      {/* 삭제 확인 모달 */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠어요?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FolderTree;
