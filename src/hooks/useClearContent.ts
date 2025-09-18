import { useHistoryStore } from "@/stores/history.store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const useClearContent = () => {
  const pathname = usePathname();
  const clearHistory = useHistoryStore((s) => s.clearHistory);

  // 이 페이지가 "마운트될 때"도 비우고
  useEffect(() => {
    clearHistory();
  }, [clearHistory]);

  // "경로가 바뀔 때마다"도 무조건 비움
  useEffect(() => {
    clearHistory();
  }, [pathname, clearHistory]);
};

export default useClearContent;
