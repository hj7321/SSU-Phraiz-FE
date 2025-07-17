"use client";

import { usePathname } from "next/navigation";
import TreeNode from "./TreeNode";
// import { useQuery } from "@tanstack/react-query";

const dummy = [
  { id: 1, name: "레포트 작성", children: [] },
  { id: 2, name: "보수사항미완료내기", children: [] },
  {
    id: 3,
    name: "발표 자료",
    children: [
      { id: 31, name: "자바 2장 본문 발표" },
      { id: 32, name: "AI 윤리와 사회적 영향 발표" },
    ],
  },
];

const FolderTree = () => {
  const pathname = usePathname();
  console.log(pathname);

  // const {data} = useQuery({
  //   queryKey: ["sidebar-history", pathname],
  //   queryFn: () =>
  // })

  return (
    <ul className="space-y-1 text-sm">
      {dummy.map((n) => (
        <TreeNode key={n.id} node={n} />
      ))}
    </ul>
  );
};

export default FolderTree;
