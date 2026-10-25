<template>
    <el-container class="ux_layout_nav ux-size-full">
        <el-aside :width="`${navbarWidth}px`" :style="[
            `--bg-color:${styles?.navbar?.bgColor || '#252935'}`,
            `--box-shadow-color:${styles?.navbar?.shadowColor || '#555555'}`
        ]" class="ux-flex ux-flex-col">
            <template v-if="appLogo !== false">
                <div class="header" :style="`height:${styles?.header?.height || 56}px`">
                    <p-logo :show-name="false" color="white" />
                </div>
            </template>
            <div class="navbar" :style="[
                { '--width': styles?.navbar?.width || '68px' },
                { '--direction': styles?.navbar?.direction || 'column' }
            ]">
                <div class="ux-h-0 ux-flex-1">
                    <p-navbar />
                </div>
                <div :class="[`ux-h-14 ux-flex-center ux-cursor-pointer`, {
                    'ux-shadow-[0px_-4px_20px_var(--box-shadow-color)]': styles?.navbar?.shadowColor !== false
                }]">
                    <p-nav-tail />
                </div>
            </div>
        </el-aside>
        <el-main>
            <p-main>
                <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
                    <slot :name="name" v-bind="slotProps ?? {}"></slot>
                </template>
            </p-main>
        </el-main>
    </el-container>
</template>

<script setup lang="ts">

import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import type { LayoutProps, LayoutEmits } from '../../types'

import * as layoutManager from '../../lib/manager'
import { getListMenu, listNavbarMenu } from '../../lib/menu'
import { showNavbar, showMenubar } from '../../lib/mixin'

import pLogo from './../block/logo.vue'
import pNavbar from './../block/navbar.vue'
import pNavTail from './../block/nav_tail.vue'
import pHeader from './../block/header.vue'
import pMain from './../block/main.vue'
import pFooter from './../block/footer.vue'

const {
    styles,
    appLogo = layoutManager.props.value?.appLogo,
} = defineProps<LayoutProps>()

const emits = defineEmits<LayoutEmits>()

const route = useRoute();
const router = useRouter();

const navbarWidth = computed(() => {
    return showNavbar.value ? (styles?.navbar?.width || 68) : 0
})

const menuAsideWidth = computed(() => {
    if (!listNavbarMenu.value || listNavbarMenu.value.length < 1) return 0
    return showMenubar.value ? 0 : (styles?.menu?.width || 138)
})

const handleLoadListMenu = () => getListMenu(route, router)

onMounted(() => handleLoadListMenu())

type HeaderSlots = InstanceType<typeof pHeader>['$slots']
type MainSlots = InstanceType<typeof pMain>['$slots']
type FooterSlots = InstanceType<typeof pFooter>['$slots']

defineSlots<HeaderSlots & MainSlots & FooterSlots>()

defineOptions({
    name: 'ux-layout-nav'
})

</script>

<style lang="css">
/* @unocss-placeholder */
</style>

<style lang="scss">
.ux_layout_nav {

    &>.el-aside {
        display: flex;
        overflow: hidden;
        transition: width .5s;
        flex-direction: column;
        background: var(--bg-color);

        .navbar {
            flex: 1;
            height: 0;
            display: flex;
            width: var(--width);
            background: var(--bg-color);
            flex-direction: var(--direction);
            box-shadow: var(--shadow-color);
        }

    }

    &>.el-main {
        padding: 0;
        overflow: hidden;
    }

}
</style>