<template>
    <router-link :to="{ path: '/' }" :class="[`ux-layout-logo ux-size-full`, {
        'ux-shadow-[0px_4px_20px_var(--box-shadow-color)]': styles?.navbar?.shadowColor !== false
    }]">
        <el-tooltip placement="right" :content="appName || $UxWeb.app?.name">
            <div class="ux-flex-center ux-size-full ux-gap-2.5">
                <template v-if="showLogo">
                    <template v-if="uxVerify.isImg(appLogo || '')">
                        <img :src="appLogo || $UxWeb.app?.logo" alt="logo" class="ux-h-10.5" />
                    </template>
                    <template v-else>
                        <div class="ux-font-bold ux-truncate ux-text-xl">
                            <span class="name" :style="{ color: color }">
                                {{ appLogo || $UxWeb.app?.logo }}
                            </span>
                        </div>
                    </template>
                </template>
                <div class="name" v-if="showName">
                    {{ appName || $UxWeb.app?.name || '' }}
                </div>
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
    showLogo = true,
    showName = true,
    color = 'var(--el-text-color-primary)',
    appName = layoutManager.props.value?.appName,
    appLogo = layoutManager.props.value?.appLogo,
} = defineProps<LayoutProps & {
    color?: string
    showLogo?: boolean
    showName?: boolean
}>()

const emits = defineEmits<LayoutEmits>()

</script>

<style lang="css">
/* @unocss-placeholder */
</style>

<style lang="scss">
.ux-layout-logo {
    .name {
        flex: 1;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 1px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: "AlimamaFangYuanTiVF-Thin", system-ui;
    }
}

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