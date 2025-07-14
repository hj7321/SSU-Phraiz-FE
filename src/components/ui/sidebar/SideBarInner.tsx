"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "./sidebar";
import clsx from "clsx";
import { TABS, TabKey } from "./sidebar.tabs";
import SidebarPanel from "./SidebarPanel";
import { useSearchDialogStore } from "@/stores/searchDialog.store";

interface SideBarInnerProps {
  activeTab: TabKey | null;
  setActiveTab: (k: TabKey | null) => void;
}

const SideBarInner = ({ activeTab, setActiveTab }: SideBarInnerProps) => {
  const { open, setOpen } = useSidebar();
  const openDialog = useSearchDialogStore((s) => s.openDialog);

  const handleSelect = (k: TabKey) => {
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
      case "new-chat":
        //resetTextarea(); // [TODO] 로직 구현: 중앙 textarea 리셋
        break;
    }
    setActiveTab(k); // 아이콘 활성화만 변경
  };

  return (
    <Sidebar side="right" variant="floating" collapsible="icon">
      {/*──────── 메뉴 (아이콘 + 라벨) ────────*/}
      <SidebarMenu className={clsx("mt-[10px] flex", !open && "items-center")}>
        {(Object.keys(TABS) as TabKey[]).map((key) => {
          const Icon = TABS[key].icon;
          return (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                asChild
                data-active={activeTab === key}
                onClick={() => handleSelect(key)}
                className="w-full flex items-center gap-[5px] py-[18px] rounded-none px-3 transition hover:bg-muted/70
   data-[active=true]:bg-muted data-[active=true]:font-medium"
              >
                <button>
                  <Icon className="size-5 shrink-0" />
                  <span className="truncate">{TABS[key].label}</span>
                </button>
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
    </Sidebar>
  );
};

export default SideBarInner;
