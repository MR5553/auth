import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, ReactNode } from "react";

const ButtonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors outline-2 shadow-md dark:outline-blue-500 disabled:cursor-not-allowed select-none",
    {
        variants: {
            variant: {
                defualt: "text-white dark:text-black bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-300",
                destructive: "bg-red-500 text-white hover:bg-red-600",
                outline: "border border-2 border-zinc-800 text-zinc-800 hover:bg-zinc-800 hover:text-white",
                secondry: "bg-zinc-800 text-white hover:bg-zinc-900",
                ghost: "bg-transparent hover:bg-zinc-800 hover:text-white dark:text-white",
                link: "underline-offset-4 hover:underline text-zinc-800 hover:text-zinc-900 dark:text-white dark:hover:text-white",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
            defualtVariant: {
                variant: "defualt",
                size: "default"
            }
        },
    }
);

interface btn extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof ButtonVariants> {
    children: ReactNode;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}

export const Button = ({ children, startIcon, endIcon, className, variant, size, ...props }: btn) => {
    return (
        <button
            className={cn(ButtonVariants({ variant, size, className }))}
            {...props}
        >
            {startIcon && startIcon}
            {children}
            {endIcon && endIcon}
        </button>
    )
};

export { ButtonVariants };