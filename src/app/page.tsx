"use client";

import { SERVICE_LINK } from "@/constants/serviceLink";
import useHoverStates from "@/hooks/useHoverStates";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { hoverStates, handleMouseEnter, handleMouseLeave } = useHoverStates(
    SERVICE_LINK.length
  );

  return (
    <>
      <div className="flex min-h-[calc(100dvh-75px)] flex-col items-center justify-center gap-[30px]">
        <h1 className="text-[30px] tracking-[5px]">
          Phraiz로 더 정확하고 빠르게 인용하고 리라이팅하세요
        </h1>
        <div className="flex flex-wrap justify-center gap-[50px]">
          {SERVICE_LINK.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              className={clsx(
                "rounded-[10px] px-[90px] py-[40px] [box-shadow:8px_8px_16px_rgba(0,0,0,0.25)] flex flex-col items-center",
                hoverStates[index] ? "bg-[#D0A2F7]" : "bg-[#E5D4FF]"
              )}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <Image
                src={link.src}
                alt={link.alt}
                width={150}
                height={100}
                className={clsx(
                  hoverStates[index]
                    ? "[filter:drop-shadow(4px_4px_4px_rgba(0,0,0,0.5))]"
                    : "[filter:drop-shadow(4px_4px_4px_rgba(0,0,0,0.25))]"
                )}
              />
              <p
                className={clsx(
                  "text-[24px] mt-[-5px] [text-shadow:2px_2px_4px_rgba(0,0,0,0.25)]",
                  hoverStates[index] && "font-nanum-bold"
                )}
              >
                {link.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
