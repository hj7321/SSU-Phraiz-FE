"use client";

import { readLatestHistory } from "@/apis/history.api";
import { SERVICE_PATH } from "@/constants/servicePath";
import { useCiteHistoryStore } from "@/stores/citeHistory.store";
import { HistoryAIContent, HistoryCiteContent } from "@/types/history.type";
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
import useFolderHistoryCount from "@/hooks/useFolderHistoryCount";
import { useAiHistoryStore } from "@/stores/aiHistory.store";
import { useSidebarStore } from "@/stores/sidebar.store";
import { useSidebarBridge } from "@/stores/sidebarBridge.store";

interface TreeNodeData {
  id: string | number;
  name: string;
  children?: TreeNodeData[]; // 있으면 폴더
}

interface TreeNodeProps {
  node: TreeNodeData;
  onRequestDelete?: () => void;
  onRequestMove?: () => void;
  compact?: boolean;
  depth?: number;
  selectedId?: number | null;
}

const TreeNode = ({
  node,
  onRequestDelete,
  onRequestMove,
  depth = 0,
  selectedId = null,
}: TreeNodeProps) => {
  const isFolder = Array.isArray(node.children);

  const [openChild, setOpenChild] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(node.name);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const savingRef = useRef<boolean>(false);

  const pathname = usePathname();
  const matched = SERVICE_PATH.find((p) => pathname.includes(p.path));
  const service = matched ? matched.service : undefined;

  const setSelectedAiHistory = useAiHistoryStore(
    (state) => state.setSelectedAiHistory
  );
  const clearAi = useAiHistoryStore((s) => s.clearAiHistory);
  const setSelectedCiteHistory = useCiteHistoryStore(
    (state) => state.setSelectedCiteHistory
  );
  const clearCite = useCiteHistoryStore((s) => s.clearCiteHistory);

  const { editFolderNameAsync, editHistoryNameAsync } =
    useEditFolderAndHistoryName(service);

  const { data: initialCount } = useFolderHistoryCount(
    service,
    isFolder ? Number(node.id) : undefined,
    true
  );

  const {
    items: folderHistories,
    total: folderTotalFromList,
    hasNextPage,
    fetchNextPage,
    refetchHistoryInFolder,
  } = useFindHistoryInFolder({
    service,
    folderId: isFolder ? Number(node.id) : undefined,
    enabled: openChild,
  });

  const folderCount = openChild
    ? folderTotalFromList ?? initialCount ?? 0
    : initialCount ?? 0;

  type UiLatest =
    | { kind: "cite"; data: HistoryCiteContent }
    | { kind: "ai"; service: "paraphrase" | "summary"; data: HistoryAIContent };

  const { refetch } = useQuery<
    HistoryAIContent | HistoryCiteContent,
    Error,
    UiLatest
  >({
    queryKey: ["readLatestHistory", service, node.id],
    queryFn: () => {
      if (!service) throw new Error("service 없음");
      if (service === "cite") {
        return readLatestHistory({
          service: "cite",
          historyId: Number(node.id),
        });
      }
      return readLatestHistory({
        service: service as "paraphrase" | "summary",
        historyId: Number(node.id),
      });
    },
    enabled: false,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    select: (raw) => {
      if (service === "cite") {
        return { kind: "cite", data: raw as HistoryCiteContent } as const;
      }
      return {
        kind: "ai",
        service: service as "paraphrase" | "summary",
        data: raw as HistoryAIContent,
      } as const;
    },
  });

  const isMobileViewport = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 1024px)").matches;

  const closeSidebarPersist = useSidebarStore((s) => s.closeSidebar);
  const closeSidebarBridge = useSidebarBridge((s) => s.close);
  const closeSidebarIfMobile = () => {
    if (isMobileViewport()) {
      closeSidebarPersist();
      closeSidebarBridge();
    }
  };

  const alertShowRef = useRef<boolean>(false);

  const handleClickLine = async () => {
    if (isFolder) {
      setOpenChild((prev) => !prev);
      if (!openChild) await refetchHistoryInFolder();
      return;
    }
    if (!service) return;

    const { data } = await refetch();
    if (!data) return;

    if (data.kind === "cite") {
      setSelectedCiteHistory(data.data);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "history_item_click",
        feature: "history",
        service: data.kind,
        history_id: data.data.id,
      });
      clearAi();
      closeSidebarIfMobile();
    } else {
      setSelectedAiHistory(data.data);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "history_item_click",
        feature: "history",
        service: data.kind,
        history_id: data.data.historyId,
      });
      clearCite();
      closeSidebarIfMobile();
    }
  };

  const startEdit = () => {
    setTempName(node.name);
    setIsEditing(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const finishEdit = async (source: "blur" | "submit") => {
    if (savingRef.current) return;
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
    try {
      savingRef.current = true;
      if (isFolder) {
        await editFolderNameAsync({ folderId: Number(node.id), name: trimmed });
      } else {
        await editHistoryNameAsync({
          historyId: Number(node.id),
          name: trimmed,
        });
      }
      setIsEditing(false);
    } catch (err) {
      alert(
        isFolder
          ? `폴더 이름 변경 실패: ${err}`
          : `히스토리 이름 변경 실패: ${err}`
      );
      requestAnimationFrame(() => inputRef.current?.focus());
    } finally {
      savingRef.current = false;
    }
  };

  useEffect(() => {
    if (!isEditing) return;
    const id = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(id);
  }, [isEditing]);

  // ✅ 현재 행이 선택된 히스토리인가?
  const isSelected =
    !isFolder && selectedId !== null && Number(node.id) === selectedId;

  return (
    <li>
      {/* 행 전체 클릭 가능 */}
      <div
        className={clsx(
          "group relative flex w-full items-center justify-between min-w-0 rounded-md transition-all cursor-pointer",
          "px-2 py-[6px] hover:bg-[#f6f3ff] hover:text-[#6c55f6]",
          openChild && isFolder
            ? "bg-[#f5f3ff]/70 text-[#6c55f6]"
            : isSelected
            ? "bg-[#EEE9FF] text-[#6c55f6] shadow-inner"
            : "text-gray-700",
          depth > 0 && "pl-4"
        )}
        onClick={handleClickLine}
        role="button"
        aria-expanded={isFolder ? openChild : undefined}
        aria-selected={isSelected || undefined}
        data-selected={isSelected ? "true" : "false"}
      >
        {/* 좌측 선택 바 */}
        <span
          aria-hidden
          className={clsx(
            "absolute left-0 top-0 bottom-0 w-[3px] rounded-l-md transition-colors",
            isSelected ? "bg-[#6c55f6]" : "bg-transparent"
          )}
        />

        {/* 왼쪽 아이콘 + 이름 */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isFolder ? (
            <span className="text-[#a294f9]">{openChild ? "📂" : "📁"}</span>
          ) : (
            <span
              className={clsx("text-gray-400", isSelected && "text-[#6c55f6]")}
            >
              📄
            </span>
          )}

          {isEditing ? (
            <input
              ref={inputRef}
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") finishEdit("submit");
                if (e.key === "Escape") {
                  setTempName(node.name);
                  setIsEditing(false);
                }
              }}
              className="flex-1 min-w-0 bg-transparent border-b border-[#a294f9]/40 focus:border-[#a294f9] outline-none text-sm py-[2px]"
            />
          ) : (
            <span
              className={clsx(
                "flex-1 truncate text-sm font-medium",
                isSelected && "font-semibold"
              )}
              title={node.name}
            >
              {node.name}
              {isFolder && (
                <span className="ml-1 text-[11px] text-gray-400 font-normal">
                  ({folderCount})
                </span>
              )}
            </span>
          )}
        </div>

        {/* 우측 메뉴 버튼 */}
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100"
            aria-label="열기"
          >
            <EllipsisVertical className="w-4 h-4 text-gray-500" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
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
              onSelect={onRequestDelete}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" /> 삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 하위 폴더/히스토리 */}
      {isFolder && openChild && (
        <ul
          className={clsx(
            "mt-1 border-l border-[#E3E0FF] ml-3 space-y-[1px]",
            depth === 0 ? "pl-2" : "pl-3"
          )}
        >
          {folderHistories.map((h) => (
            <TreeNode
              key={h.id}
              node={{ id: h.id, name: h.name }}
              onRequestDelete={onRequestDelete}
              onRequestMove={onRequestMove}
              compact
              depth={depth + 1}
              selectedId={selectedId} // ✅ 하위에도 선택 id 전파
            />
          ))}

          {hasNextPage && (
            <li>
              <button
                className="text-[12px] text-[#6c55f6] px-2 py-[3px] rounded hover:bg-[#f3f0ff]"
                onClick={(e) => {
                  e.stopPropagation();
                  fetchNextPage();
                }}
              >
                더 보기
              </button>
            </li>
          )}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
