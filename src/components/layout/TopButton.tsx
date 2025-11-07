"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function TopButton() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 90)
        setIsVisible(true); // 스크롤이 90px을 넘으면 버튼을 보이도록 설정
      else setIsVisible(false); // 그렇지 않으면 버튼을 숨김
    };

    window.addEventListener("scroll", toggleVisibility); // 스크롤 이벤트 리스너 추가

    return () => window.removeEventListener("scroll", toggleVisibility); // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
  }, []);
  // isVisible 상태를 useEffect의 의존성 배열에 넣는 것은 불필요할 수 있다.
  // scroll 이벤트 리스너에서 직접 상태를 업데이트하고 있기 때문에, isVisible을 의존성 배열에 포함시키는 대신 빈 배열 []을 사용하는 것이 성능상 더 효율적일 수 있다.

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={clsx(
        isVisible ? "flex" : "hidden",
        "fixed bottom-[20px] right-[20px] w-[40px] h-[40px] bg-main/50 hover:bg-button-hover rounded-full justify-center items-center"
      )}
      onClick={scrollToTop}
    >
      <Image src="/icons/up-arrow.svg" alt="up" width={20} height={20} />
    </button>
  );
}
