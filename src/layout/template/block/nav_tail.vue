<template>
    <el-popover placement="right" width="300px" :popper-style="{
        padding: '0px', margin: '0px'
    }" :show-arrow="false" :offset="2">
        <template #reference>
            <div class="ux-w-full ux-h-14.5 ux-flex ux-items-center ux-justify-center">
                <el-avatar :size="32" fit="cover" :src="userInfo?.avatar" />
            </div>
        </template>
        <div class="tail-panel">
            <div class="header">
                <el-avatar :size="32" fit="cover" :src="userInfo?.avatar" />
                <span class="ux-font-size-4 ux-ml-2.5 dark:ux-color-white">
                    {{ userInfo?.nickname || '佚名' }}
                </span>
            </div>
            <div class="tail-item">
                <slot name="tail-item"></slot>
            </div>
            <div class="tail-item" @click="showPage.updatePassword = true">
                <div class="ux-flex ux-items-center ux-h-13">
                    <el-icon size="22" class="dark:ux-color-white">
                        <Lock />
                    </el-icon>
                    <span class="ux-flex-1 ux-w-0 ux-color-[#333] ux-ml-2.5 dark:ux-color-white">修改密码</span>
                </div>
            </div>
            <div class="tail-item" @click="handleEvent('logout')">
                <div class="ux-flex ux-items-center ux-h-13">
                    <el-icon size="22" class="dark:ux-color-white">
                        <SwitchButton />
                    </el-icon>
                    <span class="ux-flex-1 ux-w-0 ux-color-[#333] ux-ml-2.5 dark:ux-color-white">退出系统</span>
                </div>
            </div>
        </div>
    </el-popover>

</template>

<script setup lang="ts">

import { Lock, SwitchButton } from '@element-plus/icons-vue'
import type { LayoutProps, LayoutEmits, LayoutEvent } from '../../types'

import { showPage } from '../../lib/mixin'

const {
    userInfo
} = defineProps<LayoutProps>()

const emits = defineEmits<LayoutEmits>()

const handleEvent = (command: LayoutEvent) => {
    if (command == 'update_pwd') {
        showPage.value.updatePassword = true
    } else {
        emits('click', command)
    }
}


</script>

<style scoped lang="scss">
.tail-panel {
    padding-bottom: 12px;

    .header {
        --bg-color: #ddd;
        width: 100%;
        height: 60px;
        display: flex;
        padding: 0 16px;
        background: #ddd;
        margin-bottom: 12px;
        align-items: center;
        box-sizing: border-box;
        background-color: var(--bg-color);
    }

    .tail-item {
        padding: 0 20px;
        cursor: pointer;

        &:not(:last-child) {
            .flex {
                border-bottom: 1px solid var(--el-border-color);
            }
        }

        &:hover {
            background-color: var(--el-color-primary);

            .el-icon,
            span {
                color: #fff;
            }
        }
    }
}

:is(.dark) {
    .tail-panel {
        .header {
            --bg-color: var(--el-bg-color-overlay);
        }
    }
}
</style>