import { readLatestHistory } from "@/apis/history.api";
import { SERVICE_PATH } from "@/constants/servicePath";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import React from "react";

interface TreeNodeData {
  id: string | number;
  name: string;
  children?: TreeNodeData[];
}

interface TreeNodeProps {
  node: TreeNodeData;
}

const TreeNode = ({ node }: TreeNodeProps) => {
  const hasChild = node.children && node.children?.length > 0;

  const pathname = usePathname();
  const matched = SERVICE_PATH.find((p) => pathname.includes(p.path));
  const service = matched ? matched.service : undefined;

  const { data, refetch } = useQuery({
    queryKey: ["readLatestHistory", service, node.id],
    queryFn: () =>
      readLatestHistory({ service: service!, historyId: Number(node.id) }),
    enabled: false,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  // 특정 항목 호버 시 미리 가져와서 체감 속도 향상
  const queryClient = useQueryClient();
  const handleHistoryMouseEnter = () => {
    if (!service) return;
    queryClient.prefetchQuery({
      queryKey: ["readLatestHistory", service, node.id],
      queryFn: () =>
        readLatestHistory({ service: service!, historyId: Number(node.id) }),
    });
  };

  const handleHistoryClick = async () => {
    if (!service) return;
    await refetch();
  };

  return (
    <li>
      <div className="flex items-center gap-1">
        <p className="hover:cursor-pointer">
          {hasChild ? "📂" : "📄"}{" "}
          <span
            onClick={handleHistoryClick}
            onMouseEnter={handleHistoryMouseEnter}
          >
            {node.name}
          </span>
        </p>
        {hasChild && (
          <p className="ml-[2px] text-[12px] text-[#565656]">
            {node.children!.length}
          </p>
        )}
      </div>
      {hasChild && (
        <ul className="ml-4 mt-1 space-y-1">
          {node.children!.map((c) => (
            <TreeNode key={c.id} node={c} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
