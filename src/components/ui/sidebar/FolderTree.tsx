"use client";

import { usePathname } from "next/navigation";
import TreeNode from "./TreeNode";
import { SERVICE_PATH } from "@/constants/servicePath";
import useFindFolderAndHistory from "@/hooks/useFindFolderAndHistory";

const FolderTree = () => {
  const pathname = usePathname();
  const matched = SERVICE_PATH.find((p) => pathname.includes(p.path));
  const service = matched ? matched.service : undefined;

  const { folderInfiniteQuery, historyInfiniteQuery } =
    useFindFolderAndHistory(service);

  console.log(folderInfiniteQuery.data);
  console.log(historyInfiniteQuery.data);

  return (
    <ul className="space-y-1 text-sm">
      {(historyInfiniteQuery.data ?? []).map((h) => (
        <TreeNode key={h.id} node={{ id: h.id, name: h.name }} />
      ))}
    </ul>
  );
};

export default FolderTree;
