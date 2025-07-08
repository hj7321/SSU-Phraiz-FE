import { LucideHistory, LucideSearch, LucideMessageCircle } from "lucide-react";

export type TabKey = "usage-history" | "history-search" | "new-chat";

export const TABS: Record<TabKey, { label: string; icon: React.ElementType }> =
  {
    "usage-history": { label: "사용 기록", icon: LucideHistory },
    "history-search": { label: "기록 검색", icon: LucideSearch },
    "new-chat": { label: "새 채팅", icon: LucideMessageCircle },
  };
