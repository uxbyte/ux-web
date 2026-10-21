<template>
    <div class="ux-layout-footer">
        <div class="left">
            <slot name="bottom-left">
                <template v-if="route.meta.uxLayout && (typeof route.meta.uxLayout) !== 'string'">
                    <el-breadcrumb separator="/" v-if="route.meta.uxLayout.menu?.breadcrumb !== false">
                        <template v-for="breadCrumb in breadCrumbs" :key="breadCrumb.text">
                            <el-breadcrumb-item :to="breadCrumb.routePath">
                                {{ breadCrumb.text }}
                            </el-breadcrumb-item>
                        </template>
                    </el-breadcrumb>
                </template>
            </slot>
        </div>
        <div class="right">
            <div class="theme">
                <ux-theme local />
            </div>
            <div class="tail">
                <slot name="bottom-tail">
                    <component :is="layoutManager.slots.value?.['bottom-tail']" />
                </slot>
            </div>
            <div class="app-name">{{ $UxWeb.app?.name }} {{ $UxWeb.app?.version }}</div>
            <div class="copyright">
                © 2021-{{ new Date().getFullYear() }} bytegeek.cn 技术支持
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">

import { useRoute } from 'vue-router';

import * as layoutManager from '../../lib/manager'
import { breadCrumbs } from '../../lib/menu'

const route = useRoute();

defineSlots<{
    'bottom-left'?: () => any
    'bottom-tail'?: () => any
}>()

</script>

<style lang="css">
/* @unocss-placeholder */
</style>


<style scoped lang="scss">
.ux-layout-footer {
    width: 100%;
    height: 100%;
    display: flex;
    font-size: 14px;
    line-height: 42px;
    text-align: center;
    align-items: center;
    border-top: 1px solid rgb(0 0 0 / 5%);
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 5%);

    .left {
        flex: 1;
        display: flex;
        overflow: hidden;
        align-items: center;
        box-sizing: border-box;
    }

    .right {
        display: flex;
        align-items: center;

        &>div {
            margin-left: 12px;
        }

        .license {
            .wrapper {
                display: flex;
                cursor: pointer;
                align-items: center;

                .text {
                    margin-left: 6px;
                }
            }
        }
    }
}

:is(.dark .ux-layout-footer) {
    --color: #fff !important;
    --bg-color: var(--el-bg-color-overlay) !important;
}
</style>