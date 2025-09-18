"use client";

import { readLatestHistory } from "@/apis/history.api";
import { SERVICE_PATH } from "@/constants/servicePath";
import { useHistoryStore } from "@/stores/history.store";
import { HistoryContent } from "@/types/history.type";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { EllipsisVertical, MoveRight, Pencil, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import useEditFolderAndHistoryName from "@/hooks/useEditFolderAndHistoryName";
import useFindHistoryInFolder from "@/hooks/useFindHistoryInFolder";

interface TreeNodeData {
  id: string | number;
  name: string;
  children?: TreeNodeData[]; // 있으면 폴더
}

interface TreeNodeProps {
  node: TreeNodeData;
  onRequestDelete?: () => void;
  onRequestMove?: () => void;
}

const TreeNode = ({ node, onRequestDelete, onRequestMove }: TreeNodeProps) => {
  const isFolder = Array.isArray(node.children);

  const [openChild, setOpenChild] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(node.name);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const pathname = usePathname();
  const matched = SERVICE_PATH.find((p) => pathname.includes(p.path));
  const service = matched ? matched.service : undefined;

  const setSelected = useHistoryStore((state) => state.setSelectedHistory);

  const { editFolderNameAsync, editHistoryNameAsync } =
    useEditFolderAndHistoryName(service);

  const {
    items: folderHistories,
    total: folderCount,
    isFetchingHistoryInFolder,
    hasNextPage,
    fetchNextPage,
    refetchHistoryInFolder,
  } = useFindHistoryInFolder({
    service,
    folderId: isFolder ? Number(node.id) : undefined,
    enabled: openChild, // 폴더 펼칠 때만 불러오기
  });

  // 히스토리 라인 클릭 시 최신 내용 로드
  const { refetch } = useQuery({
    queryKey: ["readLatestHistory", service, node.id],
    queryFn: () =>
      readLatestHistory({ service: service!, historyId: Number(node.id) }),
    enabled: false,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  const handleClickLine = async () => {
    if (isFolder) {
      setOpenChild((prev) => !prev);
      if (!openChild) await refetchHistoryInFolder();
      return;
    }
    if (!service) return;
    const result = await refetch();
    const data = result.data as HistoryContent | undefined;
    if (data) {
      setSelected({
        id: Number(data.id),
        content: data.content,
        lastUpdate: data.lastUpdate,
      });
    }
  };

  const alertShowRef = useRef<boolean>(false);

  const startEdit = () => {
    setTempName(node.name);
    setIsEditing(true);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const finishEdit = async (source: "blur" | "submit") => {
    const trimmed = (tempName ?? "").trim();
    if (!trimmed) {
      if (source === "submit") {
        if (!alertShowRef.current) {
          alertShowRef.current = true;
          alert("이름을 입력해 주세요.");
          setTimeout(() => {
            alertShowRef.current = false;
            inputRef.current?.focus();
          }, 0);
        } else {
          setTempName(node.name);
          setIsEditing(false);
        }
      }
      return;
    }

    if (!service) return;
    if (isFolder)
      await editFolderNameAsync({ folderId: Number(node.id), name: trimmed });
    else
      await editHistoryNameAsync({ historyId: Number(node.id), name: trimmed });

    setIsEditing(false);
  };

  useEffect(() => {
    if (!isEditing) return;
    const id = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(id);
  }, [isEditing]);

  return (
    <li>
      {/* 행 전체가 hover 트리거가 되도록 group + relative */}
      <div
        className={clsx(
          "group relative flex w-full items-center gap-2 px-1 py-1 rounded hover:bg-accent/40 cursor-pointer",
          !isFolder && "pl-1"
        )}
        onClick={handleClickLine}
        role="button"
        aria-expanded={isFolder ? openChild : undefined}
      >
        <span className="shrink-0">{isFolder ? "📂" : "📄"}</span>

        {isEditing ? (
          <input
            ref={inputRef}
            autoFocus
            className="flex-1 min-w-0 bg-transparent outline-none border-b border-muted-foreground/30 text-sm py-[1px]"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={() => finishEdit("blur")}
            onKeyDown={(e) => {
              if (e.key === "Enter") finishEdit("submit");
              if (e.key === "Escape") {
                setTempName(node.name);
                setIsEditing(false);
              }
            }}
          />
        ) : (
          // 제목 영역이 남은 공간을 모두 차지 → hover 누락 지대 제거
          <span className="flex-1 min-w-0 truncate">
            {node.name}
            {isFolder && (
              <span className="ml-1 text-[11px] text-muted-foreground">
                ({folderCount})
              </span>
            )}
          </span>
        )}

        {/* ▼ 절대 위치: 히트박스 항상 유지, 시각만 희미→선명 전환 */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={clsx(
              "absolute right-1 top-1/2 -translate-y-1/2 z-10 p-1 rounded",
              "opacity-50 transition-opacity",
              "group-hover:opacity-100 group-focus-within:opacity-100 hover:opacity-100 focus:opacity-100"
            )}
            onClick={(e) => e.stopPropagation()}
            aria-label="열기"
          >
            <EllipsisVertical className="w-4 h-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            onClick={(e) => e.stopPropagation()}
            onCloseAutoFocus={(e) => e.preventDefault()} // 포커스 튐 방지
          >
            <DropdownMenuItem onSelect={startEdit}>
              <Pencil className="w-4 h-4 mr-2" /> 이름 바꾸기
            </DropdownMenuItem>

            {!isFolder && (
              <DropdownMenuItem onSelect={onRequestMove}>
                <MoveRight className="w-4 h-4 mr-2" /> 폴더 이동하기
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onSelect={onRequestDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" /> 삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isFolder && openChild && (node.children?.length ?? 0) > 0 && (
        <ul className="ml-4 mt-1 space-y-1">
          {node.children!.map((c) => (
            <TreeNode
              key={c.id}
              node={c}
              onRequestDelete={onRequestDelete}
              onRequestMove={onRequestMove}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
