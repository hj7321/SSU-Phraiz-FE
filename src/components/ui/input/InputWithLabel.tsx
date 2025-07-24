import React, { useState } from "react";
import { Label } from "../label/label";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface InputWithLabelProps extends React.ComponentProps<typeof Input> {
  label: string;
  width?: number;
  isInvalid?: boolean;
}

const InputWithLabel = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  (
    { id, label, width, isInvalid = false, className, type, ...inputProps },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div
        className={cn("relative peer", !width && "w-[255px]", className)}
        style={width ? { width } : undefined}
      >
        <Input
          ref={ref}
          id={id}
          type={inputType} // 동적으로 타입 설정
          className={cn(
            "pt-[26px] pb-[24px] pl-[16px] placeholder:text-[14px] placeholder:text-[#dcdcdc] text-[15.5px]",
            label.includes("비밀번호") ? "pr-[42px]" : "pr-[16px]",
            isInvalid
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-input",
            inputProps.disabled && "opacity-100",
            className
          )}
          {...inputProps}
        />
        <Label
          htmlFor={id}
          className="absolute top-[-8px] left-[12px] bg-background px-[4px] text-[12px] text-muted-foreground peer-focus:text-foreground peer-disabled:opacity-50"
        >
          {label}
        </Label>
        {type === "password" && (
          <button
            type="button" // 폼 제출 방지
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground z-10"
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            {showPassword ? (
              <Image
                src="/icons/eye-closed.svg"
                alt=""
                width={18}
                height={18}
              />
            ) : (
              <Image src="/icons/eye-open.svg" alt="" width={18} height={18} />
            )}
          </button>
        )}
      </div>
    );
  }
);

InputWithLabel.displayName = "InputWithLabel";

export default InputWithLabel;
