"use client";

import { useState } from "react";
import { Input } from "../ui/input/input";
import SelectScrollable from "../ui/select/SelectScrollable";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

const ChangeExistedCitationBox = () => {
  const [citationValue, setCitationValue] = useState<string>("");
  const [selectedForm, setSelectedForm] = useState<string | undefined>(
    undefined
  );

  const isLogin = useAuthStore((s) => s.isLogin);
  const router = useRouter();

  // 인용문 변환 뮤테이션
  // const {
  //   mutate
  // } = useMutation({
  //   mutationKey: ["api 함수명", citationValue, selectedForm],
  //   mutationFn: api 함수,
  //   onSuccess: (response) => {
  //     console.log("✅ 인용문 변환 성공", response);
  //   },
  //   onError: (err) => {
  //     console.error("❌ 인용문 변환 실패: ", err.message);
  //     alert(err.message);
  //   },
  // });

  // 인용문 변환 핸들러
  const handleChangeCitation = () => {
    if (!isLogin) {
      alert("로그인 후에 이용해주세요.");
      router.push("/login");
      return;
    }
  };

  return (
    <div className="p-[16px] flex flex-col gap-[10px] md:gap-[15px] w-full">
      <div className="flex flex-col gap-[2px] md:gap-[5px]">
        <h1 className="text-[14px] sm:text-[16px] md:text-[18px]">
          변환할 인용문을 입력하세요
        </h1>
        <Input
          type="text"
          value={citationValue}
          onChange={(e) => setCitationValue(e.target.value)}
          className="text-[12px] sm:text-[14px] md:text-[16px] h-[26px] sm:h-[30px] md:h-[36px] px-[6px] sm:px-[8px] md:px-[12px]"
        />
      </div>
      <div className="flex flex-col gap-[2px] md:gap-[5px]">
        <h1 className="text-[14px] sm:text-[16px] md:text-[18px]">
          변환할 인용 형식을 선택하세요
        </h1>
        <SelectScrollable
          selectedForm={selectedForm}
          setSelectedForm={setSelectedForm}
        />
      </div>
      <div className="mt-[5px]">
        <button
          onClick={handleChangeCitation}
          disabled
          className="bg-main/40 text-white py-[6px] px-[10px] md:py-[10px] md:px-[16px] rounded-[6px] text-[10px] sm:text-[13px] md:text-[16px]"
        >
          인용문 변환하기
        </button>
      </div>
    </div>
  );
};

export default ChangeExistedCitationBox;
