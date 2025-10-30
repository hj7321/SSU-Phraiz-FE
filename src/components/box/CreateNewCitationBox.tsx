"use client";

import {
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
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
import { useCiteHistoryStore } from "@/stores/citeHistory.store";
import useResetOnNewWork from "@/hooks/useResetOnNewWork";
import { useHistorySessionStore } from "@/stores/historySession.store";
import { Sparkles } from "lucide-react";

const CreateNewCitationBox = () => {
  const [urlValue, setUrlValue] = useState<string>("");
  const [selectedForm, setSelectedForm] = useState<string | undefined>(
    undefined
  );
  const inFlightRef = useRef<boolean>(false); // 연속 클릭/중복 호출 방지

  const isLogin = useAuthStore((s) => s.isLogin);
  const setNewCitation = useCitationStore((s) => s.setNewCitation);
  const clearHistory = useCiteHistoryStore((state) => state.clearCiteHistory);
  const citeSessionId = useHistorySessionStore(
    (s) => s.sessions.cite.currentSessionId
  );
  const canAppendHistory = useHistorySessionStore((s) => s.canAppendHistory);
  const startNewSession = useHistorySessionStore((s) => s.startNewSession);
  const appendOneHistory = useHistorySessionStore((s) => s.appendOneHistory);
  const resetSession = useHistorySessionStore((s) => s.resetSession);

  const router = useRouter();
  const queryClient = useQueryClient();
  const [, startTransition] = useTransition();

  useResetOnNewWork(() => {
    setUrlValue("");
    setSelectedForm(undefined);
    setNewCitation("");
    clearHistory();
    resetSession("cite");
  });

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

  const trimmedUrl = useMemo(() => urlValue.trim(), [urlValue]);
  const isSubmitDisabled = useMemo(
    () => !trimmedUrl || !selectedForm || isSendingUrl,
    [trimmedUrl, selectedForm, isSendingUrl]
  );

  const handleChangeUrl = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setUrlValue(e.target.value),
    []
  );

  // CSL-JSON 생성 핸들러
  const handleCreateCitation = useCallback(async () => {
    if (!isLogin) {
      router.prefetch("/login");
      alert("로그인 후에 이용해주세요.");
      router.push("/login");
      return;
    }
    if (isSubmitDisabled || inFlightRef.current) return;

    if (citeSessionId && !canAppendHistory("cite")) {
      alert(
        "히스토리 내용은 10개까지만 저장됩니다.\n'새 작업'을 눌러 새로운 작업을 시작해 주세요."
      );
      return;
    }

    inFlightRef.current = true;

    try {
      clearHistory();
      const sessionId = uuidv7();

      // 1) URL 처리
      const data = await sendUrlAsync({ url: urlValue, session: sessionId });

      // 2) 인용문 생성
      const result = await generateCitation(data.csl, selectedForm!);
      if (!result) return;
      setNewCitation(result);

      // 3) 인용문 전송
      const response = await sendCitationAsync({
        citeId: data.citeId,
        citation: result,
        style: selectedForm!,
        folderId: null,
        historyId: citeSessionId ?? null,
      });
      console.log(response);

      // ✅ GTM 이벤트 푸시 (API 호출 직전)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "cite_start",
        feature: "citation",
        cite_style: selectedForm,
      });

      // TODO: 여기에서 response.historyId를 currentSessionId에 저장해야 함
      const hid = Number(response.historyId);
      if (!citeSessionId) {
        startNewSession("cite", hid);
      } else {
        appendOneHistory("cite");
      }

      // 4) 사이드바 업데이트
      startTransition(() => {
        queryClient.invalidateQueries({
          queryKey: ["sidebar-history", "cite"],
        });
        queryClient.refetchQueries({
          queryKey: ["sidebar-history", "cite"],
        });
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("요청 처리 중 오류가 발생했습니다.");
      }
    } finally {
      inFlightRef.current = false;
    }
  }, [
    urlValue,
    isLogin,
    router,
    isSubmitDisabled,
    clearHistory,
    sendUrlAsync,
    selectedForm,
    setNewCitation,
    sendCitationAsync,
    queryClient,
    startTransition,
    appendOneHistory,
    canAppendHistory,
    citeSessionId,
    startNewSession,
  ]);

  return (
    <div className="p-[16px] flex flex-col gap-[10px] md:gap-[15px] w-full">
      <div className="flex flex-col gap-[2px] md:gap-[5px]">
        <h1 className="text-gray-700 text-[12px] sm:text-[14px] md:text-[16px]">
          URL 또는 DOI를 입력하세요
        </h1>
        <Input
          type="text"
          value={urlValue}
          onChange={handleChangeUrl}
          className="text-[12px] sm:text-[14px] md:text-[16px] h-[26px] sm:h-[30px] md:h-[36px] px-[6px] sm:px-[8px] md:px-[12px]"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-col gap-[2px] md:gap-[5px]">
        <h1 className="text-gray-700 text-[12px] sm:text-[14px] md:text-[16px]">
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
          disabled={isSubmitDisabled}
          className={clsx(
            "flex items-center text-white py-[6px] px-[10px] md:py-[10px] md:px-[16px] rounded-[6px] text-[10px] sm:text-[13px] md:text-[15px]",
            isSubmitDisabled
              ? "bg-main/40 cursor-not-allowed"
              : "bg-main/70 hover:bg-main"
          )}
          aria-disabled={isSubmitDisabled}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isSendingUrl ? "인용 생성 중..." : "인용 생성하기"}
        </button>
      </div>
    </div>
  );
};

export default memo(CreateNewCitationBox);
