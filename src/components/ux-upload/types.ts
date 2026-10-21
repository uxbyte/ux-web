
import type { UploadFile } from 'element-plus'
import type { ApiRespReturn } from '../../types'

export type UxFileResp = {
    uuid?: string
    name?: string
    url: string
    size?: number
    type?: string
    ext?: string
}

export type UploadType = "file" | "image" | "video" | "audio"

export type Upload = {
    baseURL: string
    urls: { [keyof in UploadType]?: string } | string
    maxSize?: { [keyof in UploadType]?: number } | number
}

export type UploadResp = ApiRespReturn<UxFileResp>


export type UxUploadProps = {
    urls?: string | string[],
    action?: string,
    tips?: string | boolean,
    size?: number,
    multiple?: boolean,
    disabled?: boolean,
    type?: UploadType,
    showFileList?: boolean,
}

export interface UxUploadEmits {
    (e: 'update:modelValue', val: any): void
    (e: 'update:urls', val: string | string[]): void
    (e: 'success', val: UxFileResp): void
    (e: 'remove', val: UploadFile): void
}
