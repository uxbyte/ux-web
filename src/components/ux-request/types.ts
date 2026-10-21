
export interface UxRequestProps {
    url: string,
    method?: 'GET' | 'POST',
    cache?: boolean | number | string,
    queryParams?: Record<string, any>,
    load?: (data: any) => any,
}

export interface UxRequestEmits {
    (e: 'success', val: any): void,
}