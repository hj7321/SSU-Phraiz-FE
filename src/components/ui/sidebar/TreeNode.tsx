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
  return (
    <li>
      <div className="flex items-center gap-1">
        <p>
          {hasChild ? "📂" : "📄"} {node.name}
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
