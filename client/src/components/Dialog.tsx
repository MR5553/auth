import { DialogHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "../lib/utils";

interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement> {
    children: ReactNode;
}

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(({ children, className, ...props }: DialogProps, ref) => {

    return (
        <>
            <dialog
                ref={ref}
                aria-haspopup="dialog"
                className={cn(
                    "p-4 backdrop-blur-lg w-full h-full",
                    className
                )}
                {...props}
            >
                {children}
            </dialog>
        </>
    )
})