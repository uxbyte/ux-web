
export interface UxDrawerProps {
    modelValue: boolean,
    title?: string,
    backText?: string,
    size?: string,
    full?: boolean,
    showLoading?: boolean,
    showHeader?: boolean,
    showFooter?: boolean
}

export interface UxDrawerEmits {
    (e: 'update:modelValue', val: boolean): void,
    (e: 'ok', done: () => void): void,
    (e: 'close'): void,
    (e: 'cancel'): void
}
