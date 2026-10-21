import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

export const showNavbar = ref<boolean>(true)
export const showMenubar = ref<boolean>(false)

// 路由是否活跃
export const bodyPageViewAlive = ref<boolean>(true)
// 刷新路由页面
export const handleRefreshRouterView = (alert: string | false = '页面刷新成功') => {
    bodyPageViewAlive.value = false
    nextTick(() => {
        if (alert !== false) {
            ElMessage.success({ message: alert, grouping: true })
        }
        bodyPageViewAlive.value = true;
    })
}

export type PageType = 'updatePassword' | 'setting'
export const showPage = ref<{ [key in PageType]: boolean }>({
    updatePassword: false,
    setting: false
})
