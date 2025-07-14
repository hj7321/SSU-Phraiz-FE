"use client";

import { useRef } from "react";

import { useSearchDialogStore } from "@/stores/searchDialog.store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

const SearchDialog = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isOpenDialog = useSearchDialogStore((s) => s.isOpenDialog);
  const closeDialog = useSearchDialogStore((s) => s.closeDialog);

  return (
    <Dialog open={isOpenDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>기록 검색</DialogTitle>
        </DialogHeader>
        <input
          type="text"
          ref={inputRef}
          placeholder="검색어를 입력하세요"
          className="w-full border px-3 py-2 rounded-md outline-none"
          autoFocus
        />
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
