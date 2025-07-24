"use client";

import { CITATION_FORM } from "@/constants/citationForm";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

const itemStyle =
  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px]";

interface SelectScrollableProps {
  selectedForm: string | undefined;
  setSelectedForm: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const SelectScrollable = ({
  selectedForm,
  setSelectedForm,
}: SelectScrollableProps) => {
  const currentForm = CITATION_FORM.find((form) => form.value === selectedForm);

  return (
    <Select value={selectedForm} onValueChange={setSelectedForm}>
      <SelectTrigger
        className={cn(
          // shadcn Input과 유사한 스타일 적용
          "flex h-9 rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors",
          "placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "justify-between items-center" // 아이콘과 값 사이 정렬을 위해 추가
        )}
      >
        <SelectValue asChild placeholder="인용 형식 선택">
          <span className="block truncate">
            {" "}
            {/* 텍스트 잘림 방지 및 블록 요소 */}
            {currentForm && (
              <>
                <strong className="font-nanum-bold">{currentForm.name}</strong>
                {currentForm.fullName && ` (${currentForm.fullName})`}
              </>
            )}
          </span>
        </SelectValue>
        <ChevronDown className="h-4 w-4 opacity-50" /> {/* 드롭다운 아이콘 */}
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          position="popper" // 드롭다운 목록이 트리거 아래로 나오도록 설정
          side="bottom"
          avoidCollisions={false}
          sideOffset={5} // 트리거 아래로 5px 간격 두기 (조절 가능)
          className={cn(
            // 드롭다운 목록 컨테이너 스타일 적용
            "w-[var(--radix-select-trigger-width)] relative z-50 max-h-96 min-w-[8rem] overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          <SelectViewport className="p-1">
            {CITATION_FORM.map((form) => (
              <SelectItem
                key={form.value}
                className={itemStyle}
                value={form.value}
              >
                <div className="flex w-full items-center justify-between">
                  <p>
                    <strong className="font-nanum-bold">{form.name}</strong>{" "}
                    {form.fullName && `(${form.fullName})`}
                  </p>
                  <span className="ml-2 whitespace-nowrap rounded-md bg-accent px-2 py-0.5 text-xs text-muted-foreground">
                    {form.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export default SelectScrollable;
