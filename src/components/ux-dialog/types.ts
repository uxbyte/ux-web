
export interface UxDialogProps {
    modelValue: boolean,
    top?: string,
    showLoading?: boolean,
    showHeader?: boolean,
    showFooter?: boolean,
}

export interface UxDialogEmits {
    (e: 'update:modelValue', val: any): void,
    (e: 'ok', done: () => void): void,
    (e: 'close'): void,
    (e: 'cancel'): void
}
