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

interface SideBarInnerProps {
  activeTab: TabKey | null;
  setActiveTab: (k: TabKey) => void;
}

const SideBarInner = ({ activeTab, setActiveTab }: SideBarInnerProps) => {
  const { open, setOpen } = useSidebar();

  const handleSelect = (k: TabKey) => {
    if (!open && k === "usage-history") setOpen(true); // 닫혀 있으면 열기

    switch (k) {
      case "usage-history":
        /* 패널 이미 usage-history 트리를 보여주고 있으므로 액션 없음 */
        break;
      case "history-search":
        //openSearchModal(); // [TODO] 로직 구현: 검색 모달 열기
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
