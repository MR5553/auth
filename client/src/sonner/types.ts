import { ReactNode, MouseEvent, CSSProperties, Dispatch, SetStateAction } from "react";

export type ToastType = "normal" | "action" | "success" | "info" | "warning" | "error" | "loading" | "default";

export type PromiseT<Data = unknown> = Promise<Data> | (() => Promise<Data>);

export type PromiseTResult<Data = unknown> = | string | ReactNode | ((data: Data) => ReactNode | string | Promise<ReactNode | string>);

export type PromiseExternalToast = Omit<ExternalToast, "description">;

export type PromiseData<ToastData = unknown> = PromiseExternalToast & {
    laoding?: string | ReactNode;
    succcess?: PromiseTResult<ToastData>;
    error?: PromiseTResult;
    description?: PromiseTResult;
    finally: () => void | Promise<void>;
}

export interface ToastClasses {
    taost?: string;
    title?: string;
    description?: string;
    loader?: string;
    closseBtn?: string;
    cancelBtn?: string;
    actionBtn?: string;
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
    loading?: string;
    default?: string;
    content?: string;
    icon?: string;
}

export interface ToastIcon {
    success?: ReactNode;
    info?: ReactNode;
    warning?: ReactNode;
    error?: ReactNode;
    loading?: ReactNode;
    close?: ReactNode;
}

export interface action {
    label: ReactNode;
    onClick: (e: MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    actionBtnStyle: CSSProperties
}

export interface ToastT {
    id: number | string;
    title?: string | ReactNode;
    type?: ToastType;
    icon?: ReactNode;
    richColors?: boolean;
    invert?: boolean;
    closeButton?: boolean;
    dismissible?: boolean;
    description?: ReactNode;
    duration?: number;
    delete?: boolean;
    important?: boolean;
    action?: action | ReactNode;
    cancel?: action | ReactNode;
    onDismiss?: (sonner: ToastT) => void;
    onAutoClose?: (sonner: ToastT) => void;
    promise?: PromiseT;
    cancelButtonStyle?: CSSProperties;
    actionButtonStyle?: CSSProperties;
    style?: CSSProperties;
    unstyled?: boolean;
    className?: string;
    classNames?: ToastClasses;
    descriptionClassName?: string;
    position?: Position;
}

export function isAction(action: action | ReactNode): action is action {
    return (action as action).label !== undefined;
}

export type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";

export interface HeightT {
    height: number;
    toastId: number | string;
    position: Position
}

interface ToastOptions {
    className?: string;
    closeButton?: boolean;
    descriptionClassName?: string;
    style?: CSSProperties;
    cancelButtonStyle?: CSSProperties;
    actionButtonStyle?: CSSProperties;
    duration?: number;
    unstyled?: boolean;
    classNames?: ToastClasses;
}

type CnFunction = (...classes: Array<string | undefined>) => string;

export interface ToasterProps {
    invert?: boolean;
    theme?: "light" | "dark" | "system";
    position?: Position;
    hotkey?: string[];
    richColors?: boolean;
    expand?: boolean;
    duration?: number;
    gap?: number;
    visibleToasts?: number;
    closeButton?: boolean;
    toastOptions?: ToastOptions;
    ClassName?: string;
    style?: CSSProperties;
    offset?: number;
    dir: "rtl" | "ltr" | "auto";
    loadingIcon?: ReactNode;
    Icons?: ToastIcon;
    containerAriaLabel?: string;
    pauseWhenPageIsHidden?: boolean;
    cn?: CnFunction;
}


export interface ToastProps {
    toast: ToastT;
    toasts: ToastT[];
    index: number;
    expanded: boolean;
    invert: boolean;
    heights: HeightT[];
    setHeights: Dispatch<SetStateAction<HeightT[]>>;
    removeToast: (toast: ToastT) => void;
    gap?: number;
    position: Position;
    visibleToasts: number;
    expandByDefault: boolean;
    closeButton: boolean;
    interacting: boolean;
    style?: CSSProperties;
    cancelButtonStyle?: CSSProperties;
    actionButtonStyle?: CSSProperties;
    duration?: number;
    className?: string;
    unstyled?: boolean;
    descriptionClassName?: string;
    loadingIcon?: ReactNode;
    classNames?: ToastClasses;
    icons?: ToastIcon;
    closeButtonAriaLabel?: string;
    pauseWhenPageIsHidden: boolean;
    cn: CnFunction;
    defaultRichColors?: boolean;
}

export enum swipeState {
    swipeOut = "swipeOut",
    swipeBack = "swipeBack",
    notSwipe = "notSwipe"
}

export type Theme = "light" | "dark";

export interface ToastToDismiss {
    id: number | string;
    dismiss: boolean;
}

export type ExternalToast = Omit<ToastT, "id" | "type" | "title" | "delete" | "promise"> & {
    id?: number | string;
}