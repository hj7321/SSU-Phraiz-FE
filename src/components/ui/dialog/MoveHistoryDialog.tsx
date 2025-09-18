"use client";

import { moveFolder } from "@/apis/history.api";
import { createFolder, findFolderList } from "@/apis/folder.api";
import { Folder } from "@/types/folder.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Folder as FolderIcon } from "lucide-react";
import React, { useMemo, useState } from "react";
import CreateFolderDialog from "./CreateFolderDialog";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  service: "paraphrase" | "summary" | "cite";
  historyId: number;
}

const MoveHistoryDialog = ({
  open,
  onOpenChange,
  service,
  historyId,
}: Props) => {
  const queryClient = useQueryClient();

  // 폴더 목록 (간단히 1페이지만)
  const { data: folderList } = useQuery({
    queryKey: ["move-dialog-folders", service],
    queryFn: async () => {
      const res = await findFolderList({ service, page: 0, size: 100 });
      // API 타입: { content: [{folders: Folder[]} ...] }
      const folders = res.content.flatMap((w) => w.folders);
      return folders as Folder[];
    },
    staleTime: 60_000,
  });

  const names = useMemo(
    () => (folderList ?? []).map((f) => f.name),
    [folderList]
  );

  // 새 폴더 만들기 모달
  const [nameModalOpen, setNameModalOpen] = useState(false);

  const { mutateAsync: mutateCreateFolder } = useMutation({
    mutationKey: ["createFolderInDialog", service],
    mutationFn: (name: string) => createFolder({ service, name }),
    onSuccess: () => {
      // 사이드바 및 다이얼로그 목록 동기화
      queryClient.invalidateQueries({ queryKey: ["sidebar-folder", service] });
      queryClient.invalidateQueries({
        queryKey: ["move-dialog-folders", service],
      });
    },
  });

  // 폴더 이동
  const { mutateAsync: mutateMove } = useMutation({
    mutationKey: ["moveHistory", service, historyId],
    mutationFn: (folderId: number) =>
      moveFolder({ service, historyId, folderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebar-folder", service] });
      queryClient.invalidateQueries({ queryKey: ["sidebar-history", service] });
    },
  });

  const validateName = (v: string) => {
    if (!v.trim()) return "이름을 입력해주세요.";
    if (names.includes(v.trim())) return "중복되는 폴더 이름이 존재합니다.";
    return null;
  };

  const handleSelectFolder = async (folderId: number) => {
    try {
      await mutateMove(folderId);
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      alert("이동 중 오류가 발생했습니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>폴더로 이동</DialogTitle>
          <DialogDescription>
            히스토리를 저장할 폴더를 선택하세요.
          </DialogDescription>
        </DialogHeader>

        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setNameModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />새 폴더 생성하기
        </Button>

        <Separator className="my-2" />

        <div className="max-h-[260px] overflow-auto space-y-1">
          {(folderList ?? []).map((f) => (
            <button
              key={f.id}
              onClick={() => handleSelectFolder(f.id)}
              className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-accent/40"
            >
              <span className="text-yellow-500">
                <FolderIcon className="w-4 h-4" />
              </span>
              <span className="truncate">{f.name}</span>
            </button>
          ))}
          {(!folderList || folderList.length === 0) && (
            <div className="text-sm text-muted-foreground py-4 text-center">
              폴더가 없습니다.
            </div>
          )}
        </div>
      </DialogContent>

      {/* 새 폴더 이름 입력 모달 */}
      <CreateFolderDialog
        open={nameModalOpen}
        onOpenChange={setNameModalOpen}
        validateName={validateName}
        onSubmit={async (name) => {
          await mutateCreateFolder(name); // 성공 시 invalidate는 onSuccess에서 처리됨
        }}
      />
    </Dialog>
  );
};

export default MoveHistoryDialog;
