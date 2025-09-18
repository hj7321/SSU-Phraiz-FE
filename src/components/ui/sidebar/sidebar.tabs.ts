import {
  LucideHistory,
  LucideSearch,
  LucideMessageCircle,
  LucideFolderPlus,
} from "lucide-react";

export type TabKey =
  | "usage-history"
  | "history-search"
  | "new-work"
  | "new-folder";

export const TABS: Record<TabKey, { label: string; icon: React.ElementType }> =
  {
    "usage-history": { label: "사용 기록", icon: LucideHistory },
    "history-search": { label: "기록 검색", icon: LucideSearch },
    "new-work": { label: "새 작업", icon: LucideMessageCircle },
    "new-folder": { label: "폴더 생성", icon: LucideFolderPlus },
  };
