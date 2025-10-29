"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (name: string) => Promise<void> | void; // 실제 생성 로직 주입
  validateName?: (name: string) => string | null; // 중복/빈 값 등 커스텀 검증
};

const CreateFolderDialog = ({
  open,
  onOpenChange,
  onSubmit,
  validateName,
}: Props) => {
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setErr(null);
      setPending(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    const trimmed = name.trim();
    const msg =
      validateName?.(trimmed) ?? (trimmed ? null : "이름을 입력해주세요.");
    if (msg) {
      setErr(msg);
      return;
    }

    try {
      setPending(true);
      await onSubmit(trimmed);
      onOpenChange(false);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message);
      } else {
        setErr("폴더 생성 중 오류가 발생했습니다.");
      }
    } finally {
      setPending(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>새 폴더 만들기</DialogTitle>
        </DialogHeader>

        <input
          className="w-full border rounded px-2 py-2 text-sm"
          placeholder="폴더 이름"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (err) setErr(null);
          }}
          onKeyDown={onKeyDown}
          disabled={pending}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
        {err && <p className="text-red-500 text-xs mt-1">{err}</p>}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={pending}>
            {pending ? "만드는 중..." : "폴더 만들기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;
