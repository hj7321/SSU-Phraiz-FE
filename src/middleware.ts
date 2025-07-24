import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 로그인 후에 이동을 막고 싶은 경로들 (로그인 페이지, 회원가입 페이지)
const AUTH_PATHS = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  // 1. 사용자 인증 상태를 확인하는 로직 (토큰, 세션 등)
  // 이 예시에서는 'loggedIn'이라는 쿠키를 사용합니다.
  // 실제 프로젝트에서는 JWT 토큰이나 세션 ID 등을 확인해야 합니다.
  const isLoggedIn = request.cookies.has("loggedIn"); // 'loggedIn' 쿠키 존재 여부로 판단

  const { pathname } = request.nextUrl;

  // 2. 로그인 상태이고, 접근하려는 페이지가 인증 관련 페이지라면
  if (isLoggedIn && AUTH_PATHS.includes(pathname)) {
    // 홈 페이지지로 리다이렉트
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. 로그인 상태가 아니거나, 다른 페이지로의 접근은 허용함
  return NextResponse.next();
}

// AUTH_PATHS에 정의된 경로에 대해서만 미들웨어를 적용함
export const config = {
  matcher: AUTH_PATHS,
};
