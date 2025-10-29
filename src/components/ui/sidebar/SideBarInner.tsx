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
import { useCiteHistoryStore } from "@/stores/citeHistory.store";
import { useState } from "react";
import CreateFolderDialog from "../dialog/CreateFolderDialog";
import { useAuthStore } from "@/stores/auth.store";

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

  const planTier = useAuthStore((s) => s.planTier);
  const isFree = planTier === "Free";

  const queryClient = useQueryClient();

  const { mutateAsync: createFolderMutate } = useMutation({
    mutationKey: ["createFolder", service],
    mutationFn: (name: string) => createFolder({ service: service!, name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebar-folder", service] });
    },
  });

  const handleSelect = async (k: TabKey) => {
    if (k === "new-folder" && isFree) return;

    switch (k) {
      case "usage-history": {
        if (open) {
          setOpen(false);
          setActiveTab(null);
          return;
        }
        setOpen(true);
        break;
      }
      case "history-search":
        openDialog();
        break;
      case "new-work":
        useCiteHistoryStore.getState().clearCiteHistory?.();
        useNewWorkStore.getState().trigger();
        break;
      case "new-folder": {
        if (!service) return;
        setFolderModalOpen(true);
        break;
      }
    }
    setActiveTab(k);
  };

  return (
    <Sidebar
      side="right"
      variant="floating"
      collapsible="icon"
      className="max-lg:w-[min(88vw,320px)]"
    >
      {/*──────── 메뉴 (아이콘 + 라벨) ────────*/}
      <SidebarMenu className="mt-2">
        {(Object.keys(TABS) as TabKey[]).map((key) => {
          const Icon = TABS[key].icon;

          const disabled = key === "new-folder" && isFree;

          return (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                asChild
                data-active={activeTab === key}
                className={clsx(
                  "w-full h-11 rounded-md transition",
                  open ? "px-3" : "px-0",
                  "data-[active=true]:bg-bg-sidebar-accent data-[active=true]:font-medium",
                  !open && "justify-center"
                )}
              >
                {/* ⬇️ div를 루트로 사용 (button 금지) */}
                <div
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  aria-disabled={disabled || undefined}
                  onClick={() => {
                    if (disabled) return;
                    handleSelect(key);
                  }}
                  className={clsx(
                    "w-full h-full flex items-center",
                    "hover:bg-sidebar-accent/80",
                    disabled && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <Icon
                    className={clsx("size-4 shrink-0", !open && "mx-auto")}
                  />
                  {open && (
                    <span className="ml-1 text-[11px] sm:text-[12px] md:text-[14px] truncate leading-none">
                      {TABS[key].label}
                    </span>
                  )}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>

      {/*──────── 탭 내용 ────────*/}
      {open && (
        <SidebarContent className="border-t-0 min-w-0">
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
