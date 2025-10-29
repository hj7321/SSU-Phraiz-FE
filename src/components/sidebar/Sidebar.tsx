"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import clsx from "clsx";

type SidebarCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  panelW: number; // 펼친 폭
  railW: number; // 접힌 폭(아이콘 레일)
};
const Ctx = createContext<SidebarCtx | null>(null);

export function SidebarProvider({
  defaultOpen = false,
  panelWidth = 270,
  railWidth = 56,
  children,
}: {
  defaultOpen?: boolean;
  panelWidth?: number;
  railWidth?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  // 전역 CSS 변수 --sb-w 를 갱신해서 본문이 사이드바 폭만큼 항상 줄어들도록
  useEffect(() => {
    const w = open ? panelWidth : railWidth;
    document.documentElement.style.setProperty("--sb-w", `${w}px`);
  }, [open, panelWidth, railWidth]);

  const value = useMemo(
    () => ({ open, setOpen, panelW: panelWidth, railW: railWidth }),
    [open, panelWidth, railWidth]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSidebar() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSidebar must be used within <SidebarProvider>");
  return ctx;
}

export function Sidebar({
  side = "right",
  variant = "floating",
  collapsible = "icon",
  className,
  children,
  panelBgClass = "bg-[#f8f6ff]",
}: {
  side?: "right" | "left";
  variant?: "floating" | "inline";
  collapsible?: "icon" | "none";
  className?: string;
  children: React.ReactNode;
  panelBgClass?: string;
}) {
  const { open, panelW, railW } = useSidebar();
  const isRight = side === "right";

  // 디자인: 연보라 보더 + 라운딩 + 얇은 그림자
  return (
    <aside
      data-open={open}
      data-side={side}
      data-collapsible={collapsible}
      className={clsx(
        "z-40 pointer-events-auto",
        variant === "floating" &&
          "fixed top-[calc(var(--header-offset,72px))] bottom-0",
        isRight ? "right-0" : "left-0",
        className
      )}
      style={{
        width: `var(--sb-w, ${open ? panelW : railW}px)`,
        transition: "width 320ms cubic-bezier(.22,.8,.22,1)", // ⬅️ 더 길고 스프링감
        willChange: "width",
      }}
    >
      <div
        className={clsx(
          "h-full w-full",
          panelBgClass,
          "border border-[#d7d1f8] rounded-l-2xl",
          isRight && "rounded-l-2xl rounded-r-none",
          !isRight && "rounded-r-2xl rounded-l-none",
          "shadow-[0_0_0_1px_rgba(0,0,0,0.02)]"
        )}
      >
        {children}
      </div>
    </aside>
  );
}

export function SidebarMenu({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  // 상단 메뉴 영역
  return (
    <div
      className={clsx(
        "flex flex-col px-2 py-2",
        "border-b border-[#d7d1f8]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarMenuItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={clsx("w-full", className)}>{children}</div>;
}

export function SidebarMenuButton({
  asChild,
  onClick,
  className,
  "data-active": dataActive,
  children,
}: {
  asChild?: boolean;
  onClick?: () => void;
  className?: string;
  "data-active"?: boolean;
  children: React.ReactNode;
}) {
  const content = (
    <button
      type="button"
      onClick={onClick}
      data-active={!!dataActive}
      className={clsx(
        "w-full flex items-center gap-[8px] py-[14px] px-3 rounded-md transition text-[15px]",
        "hover:bg-[#f4f1ff]",
        "data-[active=true]:bg-[#efeaff] data-[active=true]:font-medium",
        className
      )}
    >
      {children}
    </button>
  );
  return asChild ? <>{content}</> : content;
}

export function SidebarContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useSidebar();

  return (
    <div
      aria-hidden={!open}
      className={clsx(
        "h-[calc(100%-56px)] min-h-0 transition-all duration-300",
        open
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-1 pointer-events-none", // 닫힐 때 살짝 밀리며 숨김
        className
      )}
    >
      {children}
    </div>
  );
}
