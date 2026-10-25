<template>
    <el-container class="ux_layout_mix ux-size-full">
        <el-aside :width="`${navbarWidth}px`" :style="[
            `--bg-color:${styles?.navbar?.bgColor || '#252935'}`,
            `--box-shadow-color:${styles?.navbar?.shadowColor || '#555555'}`
        ]">
            <template v-if="appLogo !== false">
                <div :style="`height:${styles?.header?.height || 56}px`">
                    <p-logo :show-name="false" color="white" />
                </div>
            </template>
            <div class="navbar" :style="[
                { '--width': styles?.navbar?.width || '68px' },
                { '--bg-color': styles?.navbar?.bgColor || 'transparent' },
                { '--direction': styles?.navbar?.direction || 'column' },
                { '--shadow-color': styles?.navbar?.shadowColor || 'none' }
            ]">
                <p-navbar />
            </div>
            <div :class="[`ux-h-14 ux-flex-center ux-cursor-pointer`, {
                'ux-shadow-[0px_-4px_20px_var(--box-shadow-color)]': styles?.navbar?.shadowColor !== false
            }]" @click="showPage.setting = true">
                <el-tooltip content="设置" placement="right">
                    <el-icon :size="24" color="#ffffff">
                        <Setting />
                    </el-icon>
                </el-tooltip>
            </div>
        </el-aside>
        <el-container>
            <el-header :height="styles?.header?.height || '56px'">
                <p-header :show-logo="false">
                    <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
                        <slot :name="name" v-bind="slotProps ?? {}"></slot>
                    </template>
                </p-header>
            </el-header>
            <el-container class="ux-h-0">
                <template v-if="listNavbarMenu.length > 0">
                    <el-aside :width="`${menuAsideWidth}px`" :style="{
                        '--bg-color': styles?.menu?.bgColor
                    }">
                        <el-scrollbar noresize>
                            <layout-menus :autoHome="false" :list-menu-tree="listNavbarMenu" :menu-active="menuActive"
                                :is-collapse="showMenubar" :menu-openeds="listMenuOpens" @click="handleClickMenuItem" />
                        </el-scrollbar>
                    </el-aside>
                </template>
                <el-container>
                    <el-main>
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
    </el-container>
</template>

<script setup lang="ts">

import { onMounted, computed, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Setting } from '@element-plus/icons-vue'

import type { LayoutProps, LayoutEmits } from '../../types'

import * as layoutManager from '../../lib/manager'
import { getListMenu, listMenuOpens, listNavbarMenu, menuActive, handleClickMenuItem } from '../../lib/menu'
import { showNavbar, showMenubar, showPage } from '../../lib/mixin'


import pLogo from './../block/logo.vue'
import pNavbar from './../block/navbar.vue'
import pHeader from './../block/header.vue'
import pMain from './../block/main.vue'
import pFooter from './../block/footer.vue'

const layoutMenus = defineAsyncComponent(() => import('../../components/menus.vue'))

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
    name: 'ux-layout-mix'
})

</script>

<style lang="css">
/* @unocss-placeholder */
</style>

<style lang="scss">
.ux_layout_mix {

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
            overflow: hidden;
            width: var(--width);
            background: var(--bg-color);
            flex-direction: var(--direction);
            box-shadow: var(--shadow-color);
        }
    }

    &>.el-container {
        &>.el-header {
            --border-color: #e5ecf0;
            padding: 0 0 0 20px;
            box-shadow: inset 0 -1px 0 0 var(--border-color);
        }

        &>.el-container {
            &>.el-aside {
                --bg-color: var(--el-bg-color-overlay);
                overflow-x: hidden;
                transition: width 0.5s;
                background-color: var(--bg-color);
            }

            &>.el-container {
                &>.el-main {
                    padding: 0;
                    overflow: hidden;
                }

                &>.el-footer {
                    --color: #000;
                    --bg-color: #fff;
                    color: var(--color);
                    background-color: var(--bg-color);
                }
            }
        }
    }
}

:is(.dark .ux_layout_mix) {
    &>.el-aside {
        --bg-color: var(--el-bg-color-overlay);
        --border-color: var(--el-bg-color);
    }

    &>.el-container {
        &>.el-header {
            --border-color: var(--el-bg-color);
            background-color: var(--el-bg-color-overlay);
        }

        &>.el-container {
            &>.el-container {
                &>.el-main {
                    .main-body {
                        background-color: var(--el-bg-color);
                    }
                }

                &>.el-footer {
                    --color: #fff !important;
                    --bg-color: var(--el-bg-color-overlay) !important;
                }
            }
        }
    }
}
</style>