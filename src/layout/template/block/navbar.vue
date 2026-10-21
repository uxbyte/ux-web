<template>
    <el-scrollbar view-class="ux-layout-navbar">
        <template v-for="(menu, index) in navbar.list" :key="menu.name">
            <el-tooltip placement="right">
                <template #content>{{ menu.name }}</template>
                <div :key="index" @click="handleClickNavbar(menu, index)" :class="['item', {
                    active: navbar.active === index
                }, styles?.navbar?.direction == 'row' ? 'row' : 'column']">
                    <template v-if="menu.iconfont">
                        <ux-iconfont :name="menu.iconfont" size="24px"
                            :color="navbar.active === index ? '#ffffff' : '#F2F2F2'" />
                    </template>
                    <template v-else>
                        <el-icon :size="24" :color="navbar.active === index ? '#ffffff' : '#F2F2F2'">
                            <Operation />
                        </el-icon>
                    </template>
                    <div class="text ux-text-sm/4.5 ux-color-white">
                        {{ menu.name }}
                    </div>
                </div>
            </el-tooltip>
        </template>
    </el-scrollbar>
</template>

<script setup lang="ts">


import { Operation } from '@element-plus/icons-vue'

import type { LayoutProps } from '../../types'

import { navbar, handleClickNavbar } from '../../lib/menu'

const { styles } = defineProps<LayoutProps>()

</script>

<style lang="css">
/* @unocss-placeholder */
</style>

<style scoped lang="scss">
.ux-layout-navbar {

    .item {
        gap: 8px;
        display: flex;
        cursor: pointer;
        margin-bottom: 2px;

        &.row {
            height: 56px;
            padding: 0px 12px;
            align-items: center;
        }

        &.column {
            height: 72px;
            align-items: center;
            flex-direction: column;
            justify-content: center;
        }

        &.active {
            color: #FFFFFF;
            background: var(--el-color-primary);
        }
    }
}
</style>
