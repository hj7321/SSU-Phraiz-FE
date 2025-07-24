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
    <div className="w-1/2 border-r p-[16px] flex flex-col gap-[20px]">
      <div className="flex flex-col gap-[5px]">
        <h1 className="text-[18px]">변환할 인용문을 입력하세요</h1>
        <Input
          type="text"
          value={citationValue}
          onChange={(e) => setCitationValue(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-[5px]">
        <h1 className="text-[18px]">변환할 인용 형식을 선택하세요</h1>
        <SelectScrollable
          selectedForm={selectedForm}
          setSelectedForm={setSelectedForm}
        />
      </div>
      <div className="mt-[20px]">
        <button
          onClick={handleChangeCitation}
          disabled
          className="bg-main/40 text-white py-[10px] px-[16px] rounded-[6px]"
        >
          인용문 변환하기
        </button>
      </div>
    </div>
  );
};

export default ChangeExistedCitationBox;
