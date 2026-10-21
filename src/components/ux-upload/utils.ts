
import type { UploadFile } from 'element-plus'
export const isImg = (file: UploadFile) => {
    if (file.raw?.type.startsWith('image/')) {
        return true
    }
    return /\.(gif|jpg|jpeg|png|webp|apng|svg)$/.test(file?.url || '')
}