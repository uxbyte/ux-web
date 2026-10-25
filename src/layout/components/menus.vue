<template>
    <el-menu class="ux-layout-menu" unique-opened :default-active="menuActive" :default-openeds="menuOpeneds"
        :collapse="isCollapse" style="border-right: 0;--el-menu-level-padding:14px;" v-bind="$attrs">
        <el-menu-item index="home" @click="emits('click', {
            uuid: '', name: '', routeName: '', routePath: '/',
            type: 'MENU', visible: 'Y', usable: 'Y', parentId: '0'
        })" v-if="autoHome">
            <HomeFilled class="ux-size-4.5" />
            <span class="ux-ml-1.5">首页</span>
        </el-menu-item>
        <layout-menu v-bind="$attrs" :show-icon="showIcon" :mode="menuMode ?? (level > 16 ? 'submenu' : 'groups')"
            :list-menu-tree="listMenuTree" @click="emits('click', $event)" />
    </el-menu>
</template>

<script setup lang="ts">

import { computed } from 'vue'
import { ElMenuItem } from 'element-plus';
import { HomeFilled } from '@element-plus/icons-vue'
import { uxUtils } from '../../utils/index'
import type { MenuTree, MenuItem } from "../types";

import layoutMenu from "./menu.vue";

interface Props {
    autoHome?: boolean,
    isCollapse?: boolean,
    menuOpeneds?: Array<String>,
    menuActive?: string,
    showIcon?: boolean,
    menuMode?: 'submenu' | 'groups',
    listMenuTree?: Array<MenuTree>
}

const {
    autoHome = true,
    isCollapse = false,
    menuOpeneds = [],
    menuActive = '',
    menuMode,
    showIcon = false,
    listMenuTree = [],
} = defineProps<Props>()

const emits = defineEmits<(e: 'click', item: MenuItem) => void>()

const level = computed(() => uxUtils.treeToList(listMenuTree).length)

defineOptions({ name: 'layout-menus' })

</script>

<style lang="css">
/* @unocss-placeholder */
</style>

<style lang="scss" scoped>
.ux-layout-menu {
    border: none;
    background-color: transparent;
}
</style>
