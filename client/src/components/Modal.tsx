import { HTMLAttributes, ReactNode, forwardRef, useRef } from "react";

interface dialogProps extends HTMLAttributes<HTMLDialogElement> {
    children: ReactNode;
}

export const Modal = forwardRef<HTMLDialogElement, dialogProps>(({ children, ...props }) => {
    const ref = useRef<HTMLDialogElement>(null);

    return (
        <dialog
            className="items-center justify-center z-[999]"
            aria-haspopup="dialog"
            {...props}
            ref={ref}
        >
            <div>
                {children}
            </div>
        </dialog >
    );
});

