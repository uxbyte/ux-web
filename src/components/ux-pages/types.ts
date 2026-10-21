export type UxPageProps = {
    showQuery?: boolean
    showAction?: boolean
    bgColor?: string
    mode?: 'table' | 'custom' | 'body'
    bodyClass?: string
    bodyViewClass?: string
    bodyWrapClass?: string
    customClass?: string
}

export interface UxPageEmits {
    (e: 'refresh'): void,
    (e: 'update:showQuery', val: boolean): void,
}
