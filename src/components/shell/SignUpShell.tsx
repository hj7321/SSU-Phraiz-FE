import React from "react";
import clsx from "clsx";
import { Input } from "../ui/input/input";
import { Label } from "../ui/label/label";

const SignUpShell = () => {
  return (
    <div className="flex flex-col gap-[25px] items-center">
      {/* 이메일 섹션 */}
      <div className="flex flex-col gap-[5px] w-[255px]">
        <div className="relative peer w-[255px]">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="phraiz@gmail.com"
            className={clsx(
              "pt-[26px] pb-[24px] pl-[16px] placeholder:text-[14px] placeholder:text-[#dcdcdc] text-[15.5px] pr-[16px] border-input"
            )}
          />
          <Label className="absolute top-[-8px] left-[12px] bg-background px-[4px] text-[12px] text-muted-foreground peer-focus:text-foreground peer-disabled:opacity-50">
            이메일
          </Label>
        </div>
        <button
          type="button"
          className={clsx(
            "text-[11.5px] w-[255px] text-white py-[6px] rounded-[4px] bg-main/40 cursor-not-allowed"
          )}
          disabled
        >
          인증번호 전송
        </button>
      </div>
      {/* 이메일 인증번호 섹션 */}
      <div className="grid grid-cols-[190px_60px] gap-[5px] w-[255px]">
        <div className="relative peer w-[190px]">
          <Input
            id="email-code"
            name="email-code"
            type="text"
            className={clsx(
              "pt-[26px] pb-[24px] pl-[16px] placeholder:text-[14px] placeholder:text-[#dcdcdc] text-[15.5px] pr-[16px] border-input"
            )}
          />
          <Label className="absolute top-[-8px] left-[12px] bg-background px-[4px] text-[12px] text-muted-foreground peer-focus:text-foreground peer-disabled:opacity-50">
            이메일 인증번호
          </Label>
        </div>
        <div className="relative flex flex-col">
          <button
            type="button"
            className={clsx(
              "text-[11.5px] w-[60px] text-white py-[6px] rounded-[4px] bg-main/40 cursor-not-allowed"
            )}
            disabled
          >
            확인
          </button>
          <p className="absolute top-[32px] left-[10px] text-[15px]">05:00</p>
        </div>
      </div>
      {/* 아이디 섹션 */}
      <div className="flex flex-col">
        <div className="grid grid-cols-[190px_60px] gap-[5px] w-[255px]">
          <div className="relative peer w-[190px]">
            <Input
              id="id"
              name="id"
              type="text"
              className={clsx(
                "pt-[26px] pb-[24px] pl-[16px] placeholder:text-[14px] placeholder:text-[#dcdcdc] text-[15.5px] pr-[16px] border-input"
              )}
            />
            <Label className="absolute top-[-8px] left-[12px] bg-background px-[4px] text-[12px] text-muted-foreground peer-focus:text-foreground peer-disabled:opacity-50">
              아이디
            </Label>
          </div>
          <button
            type="button"
            className={clsx(
              "text-[11.5px] w-[60px] text-white py-[6px] rounded-[4px] bg-main/40 cursor-not-allowed"
            )}
            disabled
          >
            <>
              <p>중복</p>
              <p>확인</p>
            </>
          </button>
        </div>
      </div>
      {/* 비밀번호 및 비밀번호 확인 섹션 */}
      <div className="flex flex-col w-[255px]">
        <div className="relative peer w-[255px]">
          <Input
            id="pw"
            name="pw"
            type="password"
            className={clsx(
              "pt-[26px] pb-[24px] pl-[16px] placeholder:text-[14px] placeholder:text-[#dcdcdc] text-[15.5px] pr-[16px] border-input"
            )}
          />
          <Label className="absolute top-[-8px] left-[12px] bg-background px-[4px] text-[12px] text-muted-foreground peer-focus:text-foreground peer-disabled:opacity-50">
            비밀번호
          </Label>
        </div>
      </div>
      <div className="flex flex-col w-[255px]">
        <div className="relative peer w-[255px]">
          <Input
            id="pw-check"
            name="pw-check"
            type="password"
            className={clsx(
              "pt-[26px] pb-[24px] pl-[16px] placeholder:text-[14px] placeholder:text-[#dcdcdc] text-[15.5px] pr-[16px] border-input"
            )}
          />
          <Label className="absolute top-[-8px] left-[12px] bg-background px-[4px] text-[12px] text-muted-foreground peer-focus:text-foreground peer-disabled:opacity-50">
            비밀번호 확인
          </Label>
        </div>
      </div>
      {/* 회원가입 버튼 */}
      <button
        type="submit"
        className={clsx(
          "text-[14px] w-[255px] text-white py-[10px] rounded-[4px] bg-main/40 cursor-not-allowed"
        )}
        disabled
      >
        회원가입
      </button>
    </div>
  );
};

export default SignUpShell;
