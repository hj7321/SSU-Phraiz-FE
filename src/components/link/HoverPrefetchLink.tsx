"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef } from "react";

type HoverPrefetchLinkProps = React.ComponentProps<typeof Link>;

const HoverPrefetchLink = ({
  href,
  onMouseEnter,
  onFocus,
  ...rest
}: HoverPrefetchLinkProps) => {
  const router = useRouter();
  const didPrefetch = useRef<boolean>(false);

  useEffect(() => {
    didPrefetch.current = false;
  }, [href]);

  // 공용 프리패치 로직
  const prefetchOnce = useCallback(() => {
    if (!didPrefetch.current && typeof href === "string") {
      router.prefetch(href);
      didPrefetch.current = true;
    }
  }, [href, router]);

  // 이벤트별 래퍼
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      prefetchOnce();
      onMouseEnter?.(e);
    },
    [prefetchOnce, onMouseEnter]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLAnchorElement>) => {
      prefetchOnce();
      onFocus?.(e);
    },
    [prefetchOnce, onFocus]
  );

  return (
    <Link
      href={href}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      {...rest}
    />
  );
};

export default HoverPrefetchLink;
