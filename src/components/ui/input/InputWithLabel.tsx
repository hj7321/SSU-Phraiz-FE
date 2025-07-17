import React from "react";
import { Label } from "../label/label";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface InputWithLabelProps extends React.ComponentProps<typeof Input> {
  label: string;
}

const InputWithLabel = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  ({ id, label, className, ...inputProps }, ref) => {
    return (
      <div className="relative w-[250px]">
        <Input
          ref={ref}
          id={id}
          className={cn(
            "peer pt-[26px] pb-[24px] pl-[16px] placeholder:text-[14px] placeholder:text-[#dcdcdc] text-[15.5px]",
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
      </div>
    );
  }
);

InputWithLabel.displayName = "InputWithLabel";

export default InputWithLabel;
