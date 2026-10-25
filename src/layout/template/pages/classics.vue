<template>
    <el-container class="ux_layout_classics ux-size-full">
        <el-header :height="styles?.header?.height || '56px'" style="--el-header-padding:0;">
            <p-header>
                <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
                    <slot :name="name" v-bind="slotProps ?? {}"></slot>
                </template>
            </p-header>
        </el-header>
        <el-container class="ux-flex-1 ux-h-0">
            <el-aside :width="`${menuAsideWidth}px`" class="ux-flex ux-flex-col">
                <el-scrollbar class="ux-flex-1 ux-h-0">
                    <layout-menus :autoHome="false" show-icon :list-menu-tree="listMenuTree" menu-mode="submenu"
                        :menu-active="menuActive" :is-collapse="showMenubar" :menu-openeds="listMenuOpens"
                        @click="handleClickMenuItem" />
                </el-scrollbar>
                <div :class="['ux-h-10.5 ux-flex ux-items-center ux-justify-center', {
                    'ux-shadow-[0px_-4px_20px_var(--el-border-color)]': styles?.navbar?.shadowColor !== false
                }]">
                    <el-tooltip content="设置" placement="right">
                        <el-icon-setting class="ux-size-6 ux-cursor-pointer" @click="showPage.setting = true" />
                    </el-tooltip>
                </div>
            </el-aside>
            <el-container class="ux-flex-1 ux-w-0">
                <el-main style="--el-main-padding: 0;" class="ux-overflow-hidden">
                    <p-main>
                        <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
                            <slot :name="name" v-bind="slotProps ?? {}"></slot>
                        </template>
                    </p-main>
                </el-main>
                <el-footer height="42px">
                    <p-footer>
                        <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
                            <slot :name="name" v-bind="slotProps ?? {}"></slot>
                        </template>
                    </p-footer>
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">

import { computed, defineAsyncComponent } from 'vue';

import { listMenuOpens, listMenuTree, menuActive, handleClickMenuItem } from '../../lib/menu'
import { showMenubar, showNavbar, showPage } from '../../lib/mixin'

import type { LayoutProps, LayoutEmits } from '../../types'

import pMain from './../block/main.vue'
import pHeader from './../block/header.vue'
import pFooter from './../block/footer.vue'

const layoutMenus = defineAsyncComponent(() => import('../../components/menus.vue'))

const { styles } = defineProps<LayoutProps>()

const emits = defineEmits<LayoutEmits>()

const menuAsideWidth = computed(() => {
    if (!showNavbar.value) {
        return 0;
    }
    if (showMenubar.value) {
        return 68;
    }
    return styles?.menu?.width || 220
})

type HeaderSlots = InstanceType<typeof pHeader>['$slots']
type MainSlots = InstanceType<typeof pMain>['$slots']
type FooterSlots = InstanceType<typeof pFooter>['$slots']

defineSlots<HeaderSlots & MainSlots & FooterSlots>()

defineOptions({
    name: 'ux-layout-side'
})

</script>

<style lang="css">
/* @unocss-placeholder */
</style>

<style lang="scss" scoped>
.ux_layout_classics {
    display: flex;
    flex-direction: column;

    .el-header {
        border-bottom: 1px solid var(--el-border-color);
    }
}
</style>
