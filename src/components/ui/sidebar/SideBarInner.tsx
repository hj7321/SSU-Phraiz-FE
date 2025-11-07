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
import { useEffect, useState } from "react";
import CreateFolderDialog from "../dialog/CreateFolderDialog";
import { useAuthStore } from "@/stores/auth.store";
import { useSidebarBridge } from "@/stores/sidebarBridge.store";
import { useWorkHistory } from "@/stores/workHistory.store";
import { useAiHistoryStore } from "@/stores/aiHistory.store";
import { useHistorySessionStore } from "@/stores/historySession.store";

interface SideBarInnerProps {
  activeTab: TabKey | null;
  setActiveTab: (k: TabKey | null) => void;
}

const SideBarInner = ({ activeTab, setActiveTab }: SideBarInnerProps) => {
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { open, setOpen } = useSidebar();
  const bridge = useSidebarBridge();
  const openDialog = useSearchDialogStore((s) => s.openDialog);

  const pathname = usePathname();
  const matched = SERVICE_PATH.find((p) => pathname.includes(p.path));
  const service = matched ? matched.service : undefined;

  const planTier = useAuthStore((s) => s.planTier);
  const isLogin = useAuthStore((s) => s.isLogin);
  const folderDisabled = !isLogin || planTier === "Free";

  const queryClient = useQueryClient();
  const { mutateAsync: createFolderMutate } = useMutation({
    mutationKey: ["createFolder", service],
    mutationFn: (name: string) => createFolder({ service: service!, name }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sidebar-folder", service] }),
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const closeIfMobile = () => {
    if (isMobile) {
      setOpen(false);
      bridge.close();
    }
  };

  const handleSelect = async (k: TabKey) => {
    if (k === "new-folder" && folderDisabled) return;

    switch (k) {
      case "usage-history":
        if (isMobile) setOpen(true);
        else setOpen(!open);
        break;
      case "history-search":
        openDialog();
        closeIfMobile();
        break;
      case "new-work":
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "new_work_start",
          feature: "workspace",
        });
        if (service === "cite") {
          useCiteHistoryStore.getState().clearCiteHistory?.();
          useHistorySessionStore.getState().resetSession("cite");
          useWorkHistory.getState().resetCiteWork();
        } else if (service === "summary") {
          useAiHistoryStore.getState().clearAiHistory?.();
          useHistorySessionStore.getState().resetSession("summary");
          useWorkHistory.getState().resetSummarizeWork();
        } else if (service === "paraphrase") {
          useAiHistoryStore.getState().clearAiHistory?.();
          useHistorySessionStore.getState().resetSession("paraphrase");
          useWorkHistory.getState().resetParaphraseWork();
        }

        useNewWorkStore.getState().trigger();
        closeIfMobile();
        break;
      case "new-folder":
        if (!service) return;
        setFolderModalOpen(true);
        closeIfMobile();
        break;
    }
    setActiveTab(k);
  };

  useEffect(() => {
    if (!open || !isMobile) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-mobile-history-icon]")) return;
      const panel = document.querySelector("[data-sidebar-panel]");
      if (panel && !panel.contains(t)) {
        setOpen(false);
        bridge.close();
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open, isMobile, setOpen, bridge]);

  return (
    <Sidebar
      side="right"
      variant="floating"
      collapsible={isMobile ? undefined : "icon"}
      className="h-full max-lg:w-[min(88vw,320px)] z-50 bg-transparent border-0 shadow-none rounded-none"
    >
      <div
        data-sidebar-panel
        className="h-full w-full bg-[#f9f6ff] border-l border-gray-200 shadow-md rounded-none lg:rounded-2xl"
      >
        <SidebarMenu className="mt-2">
          {(Object.keys(TABS) as TabKey[]).map((key) => {
            const Icon = TABS[key].icon;
            const disabled = key === "new-folder" && folderDisabled;

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
                  <div
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    aria-disabled={disabled || undefined}
                    onClick={() => !disabled && handleSelect(key)}
                    // ✅ 모바일에서 보이던 검은 포커스 박스 제거
                    className={clsx(
                      "w-full h-full flex items-center",
                      "hover:bg-sidebar-accent/80",
                      "focus:outline-none focus-visible:outline-none",
                      disabled && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <Icon
                      className={clsx("size-4 shrink-0", !open && "mx-auto")}
                    />
                    {open && (
                      <span className="ml-1 text-[12px] truncate leading-none">
                        {TABS[key].label}
                      </span>
                    )}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

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
      </div>
    </Sidebar>
  );
};

export default SideBarInner;
