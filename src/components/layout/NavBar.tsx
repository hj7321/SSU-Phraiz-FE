"use client";

import { SERVICE_LINK } from "@/constants/serviceLink";
import useHoverStates from "@/hooks/useHoverStates";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  const { hoverStates, handleMouseEnter, handleMouseLeave } = useHoverStates(
    SERVICE_LINK.length
  );

  return (
    <aside className="bg-main min-h-screen h-full py-[20px] px-[10px] flex flex-col gap-[30px] w-[110px] flex-shrink-0">
      {SERVICE_LINK.map((link, index) => {
        const currentPage = pathname === link.href;
        const highlight = hoverStates[index] || currentPage;

        return (
          <Link
            key={link.href}
            href={link.href}
            className="flex flex-col items-center"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          >
            <Image
              src={link.icon}
              alt={link.alt}
              width={90}
              height={60}
              priority
              className={clsx(
                highlight
                  ? "[filter:drop-shadow(4px_4px_4px_rgba(0,0,0,0.5))]"
                  : "[filter:drop-shadow(4px_4px_4px_rgba(0,0,0,0.25))]"
              )}
            />
            <p
              className={clsx(
                "mt-[-8px] text-[15px]",
                highlight &&
                  "font-nanum-extrabold [text-shadow:2px_2px_4px_rgba(0,0,0,0.25)]"
              )}
            >
              {link.label}
            </p>
          </Link>
        );
      })}
    </aside>
  );
};

export default NavBar;
