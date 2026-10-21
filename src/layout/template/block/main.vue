<template>
    <div class="ux-layout-main">
        <div class="main-container">
            <div class="main-body" v-loading="!bodyPageViewAlive">
                <slot name="default">
                    <router-view v-slot="{ Component }" :key="$route.name" v-if="bodyPageViewAlive">
                        <keep-alive>
                            <component :is="Component" />
                        </keep-alive>
                    </router-view>
                </slot>
            </div>
        </div>
        <div class="main-extend">
            <slot name="main-extend">
                <component :is="layoutManager.slots.value?.['main-extend']" />
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">

import * as layoutManager from '../../lib/manager'
import { bodyPageViewAlive } from '../../lib/mixin'

defineSlots<{
    'default'?: () => any
    'main-extend'?: () => any
}>()

</script>

<style lang="css">
/* @unocss-placeholder */
</style>

<style scoped lang="scss">
.ux-layout-main {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;

    .main-container {
        flex: 1;
        width: 0;
        display: flex;
        overflow: hidden;
        position: relative;
        flex-direction: column;

        .main-body {
            flex: 1;
            height: 0;
            overflow: hidden;
            --bg-color: #e9eef3;
            display: flex;
            flex-direction: column;
            background-color: var(--bg-color);
        }
    }
}

:is(.dark .ux-layout-main) {
    .main-body {
        --bg-color: var(--el-bg-color);
    }
}
</style>
