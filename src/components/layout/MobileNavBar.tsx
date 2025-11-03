"use client";

import { logout } from "@/apis/logout.api";
import { SERVICE_LINK } from "@/constants/serviceLink";
import { useAuthStore } from "@/stores/auth.store";
import { useNavbarStore } from "@/stores/navbar.store";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNavBar = () => {
  const pathname = usePathname();

  const isLogin = useAuthStore((s) => s.isLogin);
  const authLogout = useAuthStore((s) => s.logout);
  const userName = useAuthStore((s) => s.userName);
  const planTier = useAuthStore((s) => s.planTier);

  const isOpenNavbar = useNavbarStore((s) => s.isOpenNavbar);
  const closeNavbar = useNavbarStore((s) => s.closeNavbar);

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onMutate: () => {
      closeNavbar();
    },
    onSuccess: () => {
      // ✅ GTM 이벤트 푸시
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "logout_click",
        feature: "auth",
      });
      authLogout();
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  return (
    <div
      className={clsx(
        "fixed inset-0 z-[9998] flex transition-opacity duration-300",
        isOpenNavbar ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div onClick={closeNavbar} className="flex-1 bg-black/50" />
      <aside
        className={clsx(
          "absolute inset-0 z-[9999] bg-main min-h-screen h-full py-[20px] px-[25px] flex flex-col gap-[50px] w-[240px] flex-shrink-0",
          "transform transition-transform duration-300 ease-in-out",
          isOpenNavbar ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {isLogin ? (
          <Link
            onClick={closeNavbar}
            href="/pricing-plan"
            className="flex items-center gap-[4px]"
          >
            {planTier && (
              <Image
                src={`/icons/grade_${planTier.toLowerCase()}.png`}
                alt=""
                width={50}
                height={50}
              />
            )}
            <p className="text-white text-[18px] font-nanum-bold">
              {userName!} 님
            </p>
          </Link>
        ) : (
          <div className="flex ml-[7px] gap-[30px] text-white text-[14px]">
            <Link
              onClick={closeNavbar}
              href="/login"
              className="font-nanum-bold"
            >
              로그인
            </Link>
            <Link
              onClick={closeNavbar}
              href="/sign-up"
              className="font-nanum-bold"
            >
              회원가입
            </Link>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-[20px]">
          {SERVICE_LINK.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeNavbar}
              className="flex items-center gap-[5px]"
            >
              <Image
                src={link.icon}
                alt={link.alt}
                width={69}
                height={46}
                priority
                className={clsx(
                  pathname === link.href
                    ? "[filter:drop-shadow(4px_4px_4px_rgba(0,0,0,0.5))]"
                    : "[filter:drop-shadow(4px_4px_4px_rgba(0,0,0,0.25))]",
                  link.label === "AI 요약" && "ml-[-4px]"
                )}
              />
              <p
                className={clsx(
                  "font-nanum-extrabold mt-[6px]",
                  pathname === link.href &&
                    "font-nanum-extrabold [text-shadow:2px_2px_4px_rgba(0,0,0,0.25)]",
                  link.label === "AI 요약" && "ml-[4px]"
                )}
              >
                {link.label}
              </p>
            </Link>
          ))}
        </div>
        {isLogin && (
          <button
            onClick={() => logoutMutate()}
            className="text-white text-[12px] font-nanum-extrabold self-start"
          >
            로그아웃
          </button>
        )}
      </aside>
    </div>
  );
};

export default MobileNavBar;
