

export interface Pagination {
    page: number,
    limit: number
}

type Change = {
    type: 'page' | 'size'
} & Pagination

export interface UxPaginationProps {
    page?: number,
    limit?: number,
    total?: number,
    size?: 'small' | 'large' | 'default'
}

export interface UxPaginationEmits {
    (e: 'update:page', val: number): void,
    (e: 'update:limit', val: number): void,
    (e: 'change', val: Change): void,
}