import { cn } from "../lib/utils";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ type, startIcon, endIcon, className = "", ...props }, ref) => {
    return (
        <div className="relative flex items-center">
            {startIcon && (<span className="absolute left-3">{startIcon}</span>)}
            <input
                type={type}
                className={cn(`flex w-full text-sm py-[10px] text-neutral-800 bg-[#F5F5F5] dark:text-neutral-300 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-300 placeholder:text-neutral-800 dark:placeholder:text-neutral-300 focus:border-neutral-800 outline-none disabled:cursor-not-allowed disabled:opacity-80 shadow ${startIcon && "pl-8"} ${endIcon && "pr-8"} ${className}`, className)}
                ref={ref}
                {...props}
            />
            {endIcon && (<span className="absolute right-3">{endIcon}</span>)}
        </div>
    )
});

export { Input };