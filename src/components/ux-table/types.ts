
import type { Pagination } from '../ux-pagination/types'
import type { ApiRespList } from "../../utils";

export type LoadTime = 'onready' | 'manual'

export type ListResp<T> = {
    loading: boolean,
    list: T[],
    total: number
} & Pagination


export interface UxTableProps {
    url?: string,
    data?: Record<any, any>[],
    limit?: number,
    queryParams?: Record<string, any>,
    border?: boolean,
    pagination?: boolean,
    total?: number,
    loading?: boolean,
    loadtime?: LoadTime,
    beforeRender?: (list: ApiRespList<any>) => Promise<ApiRespList<any>>,
}

export interface UxTableEmits {
    (e: 'update:loading', val: boolean): void,
    (e: 'pageChange', val: { page: number, limit: number }): void,
    (e: 'complete', val: any[]): void,
}

