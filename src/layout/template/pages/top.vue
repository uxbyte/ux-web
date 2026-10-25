<template>
    <el-container class="ux_layout_top ux-size-full">
        <el-header :height="styles?.header?.height || '56px'" style="--el-header-padding:0 0 0 16px;">
            <p-header>
                <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
                    <slot :name="name" v-bind="slotProps ?? {}"></slot>
                </template>
                <template #top-center>
                    <layout-menus mode="horizontal" :autoHome="false" :list-menu-tree="listMenuTree"
                        :menu-active="menuActive" :is-collapse="showMenubar" :menu-openeds="listMenuOpens"
                        menu-mode="submenu" @click="handleClickMenuItem" />
                </template>
            </p-header>
        </el-header>
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
</template>

<script setup lang="ts">

import { defineAsyncComponent } from 'vue';

import { listMenuOpens, listMenuTree, menuActive, handleClickMenuItem } from '../../lib/menu'
import { showMenubar } from '../../lib/mixin'

import type { LayoutProps, LayoutEmits } from '../../types'

import pMain from './../block/main.vue'
import pHeader from './../block/header.vue'
import pFooter from './../block/footer.vue'

const layoutMenus = defineAsyncComponent(() => import('../../components/menus.vue'))

const { styles } = defineProps<LayoutProps>()

const emits = defineEmits<LayoutEmits>()

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
.ux_layout_top {}
</style>
