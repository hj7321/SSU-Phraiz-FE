import React from "react";
import clsx from "clsx";

const SignUpShell = () => {
  // 폼 UI 구성 요소를 대체하는 공통 스타일 (이전 답변과 동일)
  const inputBaseStyle =
    "h-[50px] w-full rounded-md border border-input bg-white disabled:cursor-not-allowed";
  const buttonSmStyle =
    "text-[11.5px] w-[60px] text-white py-[6px] rounded-[4px] bg-main/40 flex justify-center items-center h-[30px]";
  const buttonLgStyle =
    "text-[11.5px] w-[255px] text-white py-[6px] rounded-[4px] bg-main/40 flex justify-center items-center h-[30px]";
  const labelStyle =
    "absolute top-[-8px] left-[12px] bg-white px-[4px] text-[12px] text-muted-foreground w-fit h-[15px] select-none";
  const labelTextStyle = "text-muted-foreground";

  return (
    // **SignUpPage와 동일하게 overflow-hidden을 추가합니다.**
    <section className="bg-gradient-to-b from-main to-main/20 h-[100vh] w-full flex flex-col gap-[20px] justify-center items-center overflow-hidden">
      <div className="flex flex-col gap-[25px] bg-white px-[50px] py-[60px] rounded-[12px] [filter:drop-shadow(0px_0px_10px_rgba(0,0,0,0.4))] mt-[-90px]">
        <form className="flex flex-col gap-[25px]">
          {/* 1. 이메일 섹션 */}
          <div className="flex flex-col gap-[5px]">
            <div className="relative w-[255px]">
              <div className={inputBaseStyle} />
              <div className={labelStyle}>
                <span className={labelTextStyle}>이메일</span>
              </div>
            </div>
            <div className={clsx(buttonLgStyle, "w-[255px] h-[30px]")}>
              인증번호 전송
            </div>
          </div>

          {/* 2. 이메일 인증번호 섹션 */}
          <div className="flex justify-between items-start">
            <div className="relative w-[190px]">
              <div className={inputBaseStyle} />
              <div className={labelStyle}>
                <span className={labelTextStyle}>이메일 인증번호</span>
              </div>
            </div>
            <div className="relative flex flex-col">
              <div className={buttonSmStyle}>확인</div>
              <p className="absolute top-[32px] left-[10px] text-[15px] text-transparent select-none">
                00:00
              </p>
            </div>
          </div>

          {/* 3. 아이디 섹션 */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              <div className="relative w-[190px]">
                <div className={inputBaseStyle} />
                <div className={labelStyle}>
                  <span className={labelTextStyle}>아이디</span>
                </div>
              </div>
              <div className={clsx(buttonSmStyle, "flex-col")}>
                <p>중복</p>
                <p>확인</p>
              </div>
            </div>
            <small className="text-[11.5px] mt-[1.5px] mb-[-10px] h-[15px] text-transparent select-none">
              &nbsp;
            </small>
          </div>

          {/* 4. 비밀번호 섹션 1 */}
          <div className="flex flex-col">
            <div className="relative w-[255px]">
              <div className={clsx(inputBaseStyle, "pr-[42px]")} />
              <div className={labelStyle}>
                <span className={labelTextStyle}>비밀번호</span>
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1 w-[26px] h-[26px] bg-white" />
            </div>
            <small className="text-[11.5px] mt-[1.5px] mb-[-10px] h-[15px] text-transparent select-none">
              &nbsp;
            </small>
          </div>

          {/* 5. 비밀번호 섹션 2 */}
          <div className="flex flex-col">
            <div className="relative w-[255px]">
              <div className={clsx(inputBaseStyle, "pr-[42px]")} />
              <div className={labelStyle}>
                <span className={labelTextStyle}>비밀번호 확인</span>
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1 w-[26px] h-[26px] bg-white" />
            </div>
            <small className="text-[11.5px] mt-[1.5px] mb-[-10px] h-[15px] text-transparent select-none">
              &nbsp;
            </small>
          </div>

          {/* 6. 회원가입 버튼 */}
          <div
            className={clsx(
              "text-[14px] w-[255px] text-white py-[10px] rounded-[4px] bg-main/40 flex justify-center items-center h-[40px]"
            )}
          >
            회원가입
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignUpShell;
