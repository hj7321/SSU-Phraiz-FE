"use client";

import { useState } from "react";
import { Input } from "../ui/input/input";
import SelectScrollable from "../ui/select/SelectScrollable";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendCitation, sendUrl } from "@/apis/citation.api";
import { v7 as uuidv7 } from "uuid";
import clsx from "clsx";
import { generateCitation } from "@/utils/citation";
import { useCitationStore } from "@/stores/citation.store";
import { createHistory } from "@/apis/history.api";

const CreateNewCitationBox = () => {
  const [urlValue, setUrlValue] = useState<string>("");
  const [selectedForm, setSelectedForm] = useState<string | undefined>(
    undefined
  );
  const [citationResult, setCitationResult] = useState<string>("");

  const isLogin = useAuthStore((s) => s.isLogin);
  const setCitation = useCitationStore((s) => s.setCitation);
  const router = useRouter();
  const queryClient = useQueryClient();

  // CSL-JSON 생성 뮤테이션
  const { mutateAsync: sendUrlAsync, isPending: isSendingUrl } = useMutation({
    mutationKey: ["sendUrl"],
    mutationFn: sendUrl,
  });

  // 인용문 전송 뮤테이션
  const { mutateAsync: sendCitationAsync } = useMutation({
    mutationKey: ["sendCitation"],
    mutationFn: sendCitation,
  });

  // CSL-JSON 생성 핸들러
  const handleCreateCitation = async () => {
    if (!isLogin) {
      alert("로그인 후에 이용해주세요.");
      router.push("/login");
      return;
    }
    if (!urlValue || !urlValue.trim()) {
      alert("URL 또는 DOI를 입력해주세요.");
      return;
    }
    if (!selectedForm) {
      alert("인용 형식을 선택해주세요.");
      return;
    }

    try {
      const sessionId = uuidv7();

      // 1) URL 처리
      const data = await sendUrlAsync({ url: urlValue, session: sessionId });
      console.log("✅ CSL-JSON 생성 성공", data);

      // 2) 인용문 생성
      const result = generateCitation(data.csl, selectedForm!);
      if (!result) return;
      setCitationResult(result);
      setCitation(result);

      // 3) 인용문 전송
      const res = await sendCitationAsync({
        citeId: data.citeId,
        citation: result,
        style: selectedForm!,
      });
      console.log("✅ 인용문 전달 성공");

      // 4) 사이드바 업데이트
      queryClient.invalidateQueries({
        queryKey: ["sidebar-history", "cite"],
      });
    } catch (err: any) {
      console.error("❌ 인용 생성/전송 실패:", err?.message ?? err);
      alert(err?.message ?? "요청 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-[16px] flex flex-col gap-[10px] md:gap-[15px] w-full">
      <div className="flex flex-col gap-[2px] md:gap-[5px]">
        <h1 className="text-[14px] sm:text-[16px] md:text-[18px]">
          URL 또는 DOI를 입력하세요
        </h1>
        <Input
          type="text"
          value={urlValue}
          onChange={(e) => setUrlValue(e.target.value)}
          className="text-[12px] sm:text-[14px] md:text-[16px] h-[26px] sm:h-[30px] md:h-[36px] px-[6px] sm:px-[8px] md:px-[12px]"
        />
      </div>
      <div className="flex flex-col gap-[2px] md:gap-[5px]">
        <h1 className="text-[14px] sm:text-[16px] md:text-[18px]">
          인용 형식을 선택하세요
        </h1>
        <SelectScrollable
          selectedForm={selectedForm}
          setSelectedForm={setSelectedForm}
        />
      </div>
      <div className="mt-[5px]">
        <button
          onClick={handleCreateCitation}
          disabled={!urlValue || !selectedForm || isSendingUrl}
          className={clsx(
            "text-white py-[6px] px-[10px] md:py-[10px] md:px-[16px] rounded-[6px] text-[10px] sm:text-[13px] md:text-[16px]",
            !urlValue || !selectedForm || isSendingUrl
              ? "bg-main/40"
              : "bg-main/70 hover:bg-main"
          )}
        >
          {isSendingUrl ? "인용 생성 중..." : "인용 생성하기"}
        </button>
      </div>
    </div>
  );
};

export default CreateNewCitationBox;
