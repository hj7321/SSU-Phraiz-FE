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
  const hasChild = node.children?.length;
  return (
    <li>
      <div className="flex items-center gap-1">
        {hasChild ? "📂" : "📄"} {node.name}
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
