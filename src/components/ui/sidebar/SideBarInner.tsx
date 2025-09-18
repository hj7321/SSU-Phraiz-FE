"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/sidebar/Sidebar";
import clsx from "clsx";
import { TABS, TabKey } from "./sidebar.tabs";
import SidebarPanel from "./SidebarPanel";
import { useSearchDialogStore } from "@/stores/searchDialog.store";
import { usePathname } from "next/navigation";
import { SERVICE_PATH } from "@/constants/servicePath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder } from "@/apis/folder.api";
import { useNewWorkStore } from "@/stores/newWork.store";
import { useHistoryStore } from "@/stores/history.store";
import { useState } from "react";
import CreateFolderDialog from "../dialog/CreateFolderDialog";

interface SideBarInnerProps {
  activeTab: TabKey | null;
  setActiveTab: (k: TabKey | null) => void;
}

const SideBarInner = ({ activeTab, setActiveTab }: SideBarInnerProps) => {
  const [folderModalOpen, setFolderModalOpen] = useState<boolean>(false);
  const { open, setOpen } = useSidebar();
  const openDialog = useSearchDialogStore((s) => s.openDialog);
  const pathname = usePathname();
  const matched = SERVICE_PATH.find((p) => pathname.includes(p.path));
  const service = matched ? matched.service : undefined;

  const queryClient = useQueryClient();

  const { mutateAsync: createFolderMutate } = useMutation({
    mutationKey: ["createFolder", service],
    mutationFn: (name: string) => createFolder({ service: service!, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebar-folder", service] });
    },
  });

  const handleSelect = async (k: TabKey) => {
    switch (k) {
      case "usage-history": {
        if (open) {
          setOpen(false);
          setActiveTab(null); // 아이콘 활성화 해제
          return;
        }
        // 열려 있지 않으면 열어 주기
        setOpen(true);
        break;
      }
      case "history-search":
        openDialog();
        break;
      case "new-work":
        useHistoryStore.getState().clearHistory?.();
        useNewWorkStore.getState().trigger();
        break;
      case "new-folder": {
        if (!service) return;
        setFolderModalOpen(true);
        break;
      }
    }
    setActiveTab(k); // 아이콘 활성화만 변경
  };

  return (
    <Sidebar side="right" variant="floating" collapsible="icon">
      {/*──────── 메뉴 (아이콘 + 라벨) ────────*/}
      <SidebarMenu className="mt-2">
        {(Object.keys(TABS) as TabKey[]).map((key) => {
          const Icon = TABS[key].icon;
          return (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                data-active={activeTab === key}
                onClick={() => handleSelect(key)}
                className={clsx(
                  "w-full h-11 flex items-center rounded-md px-3 transition",
                  "hover:bg-sidebar-accent/80",
                  "data-[active=true]:bg-bg-sidebar-accent data-[active=true]:font-medium",
                  !open && "justify-center"
                )}
              >
                <Icon className="size-5 shrink-0" />
                {open && (
                  <span className="ml-1 truncate leading-none">
                    {TABS[key].label}
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>

      {/*──────── 탭 내용 ────────*/}
      {open && (
        <SidebarContent className="">
          <SidebarPanel />
        </SidebarContent>
      )}

      <CreateFolderDialog
        open={folderModalOpen}
        onOpenChange={setFolderModalOpen}
        validateName={(v) => (v.trim() ? null : "이름을 입력해주세요.")}
        onSubmit={async (name) => {
          await createFolderMutate(name);
          setOpen(true);
          setActiveTab("usage-history");
        }}
      />
    </Sidebar>
  );
};

export default SideBarInner;
