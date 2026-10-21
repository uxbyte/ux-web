<template>
    <router-link :to="{ path: '/' }" :class="[`ux-layout-logo ux-size-full`, {
        'ux-shadow-[0px_4px_20px_var(--box-shadow-color)]': styles?.navbar?.shadowColor !== false
    }]">
        <el-tooltip placement="right" :content="appName || $UxWeb.app?.name">
            <div class="ux-flex-center ux-size-full">
                <template v-if="uxVerify.isImg(appLogo || '')">
                    <img :src="appLogo || $UxWeb.app?.logo" alt="logo" class="ux-h-10.5" />
                </template>
                <template v-else>
                    <div class="ux-font-bold ux-truncate ux-text-xl">
                        <span class="ux-color-white">{{ appLogo || $UxWeb.app?.logo }}</span>
                    </div>
                </template>
            </div>
        </el-tooltip>
    </router-link>
</template>


<script setup lang="ts">

import { uxVerify } from '../../../utils'

import type { LayoutProps, LayoutEmits } from '../../types'

import * as layoutManager from '../../lib/manager'

const {
    styles,
    appName = layoutManager.props.value?.appName,
    appLogo = layoutManager.props.value?.appLogo,
} = defineProps<LayoutProps>()

const emits = defineEmits<LayoutEmits>()

</script>

<style lang="css">
/* @unocss-placeholder */
</style>

<style lang="scss">
:is(.dark .ux-layout-logo) {

    .logo {
        --bg-color: var(--el-bg-color);
        --box-shadow-color: var(--el-bg-color);
    }

    .tail {
        --box-shadow-color: var(--el-bg-color);
    }
}
</style>