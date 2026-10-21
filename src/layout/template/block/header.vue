<template>
    <div class="ux_layout_header">
        <div class="left">
            <p-logo v-if="showLogo" />
            <span class="name" v-else>
                {{ appName || $UxWeb.app?.name }}
            </span>
        </div>
        <div class="center">
            <slot name="top">
                <div class="action">
                    <div class="show-navbar">
                        <el-tooltip :content="`${showNavbar ? '关闭' : '展开'}`">
                            <div :class="[
                                'ux-flex ux-items-center ux-justify-center ux-rounded-[50%]',
                                'ux-size-6 ux-bg-#f5f6f8'
                            ]">
                                <el-icon :size="16" color="#999999" class="ux-cursor-pointer"
                                    @click="showNavbar = !showNavbar">
                                    <Close v-if="showNavbar" />
                                    <Operation v-else />
                                </el-icon>
                            </div>
                        </el-tooltip>
                    </div>
                    <div class="show-menubar" v-if="listNavbarMenu.length > 0">
                        <el-icon :size="20" color="#999" class="ux-cursor-pointer" @click="showMenubar = !showMenubar">
                            <Fold v-if="showMenubar" />
                            <Expand v-else />
                        </el-icon>
                    </div>
                    <div class="refresh">
                        <el-icon :size="20" color="#999" @click="handleRefreshRouterView()"
                            :class="[`ux-cursor-pointer`, { 'is-loading': !bodyPageViewAlive }]">
                            <Refresh />
                        </el-icon>
                    </div>
                </div>
                <slot name="top-center">
                </slot>
            </slot>
        </div>
        <div class="right">
            <div class="tail">
                <slot name="top-tail">
                    <component :is="layoutManager.slots.value?.['top-tail']" />
                </slot>
            </div>
            <el-dropdown @command="handleEvent">
                <div class="el-dropdown-link">
                    <el-avatar :size="24" fit="cover" :src="userInfo?.avatar" />
                    <span class="username">{{ userInfo?.nickname || '佚名' }}</span>
                    <span class="icon-down"></span>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="userinfo">
                            <span class="ml-1">个人中心</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="update_pwd">
                            <span class="ml-1">修改密码</span>
                        </el-dropdown-item>
                        <el-dropdown-item command="logout" divided>
                            <span class="ml-1">退出登录</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">

import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Close, Refresh, Fold, Expand, Operation } from '@element-plus/icons-vue'

import type { LayoutEvent, LayoutProps, LayoutEmits } from '../../types'

import * as layoutManager from '../../lib/manager'
import { getListMenu, listNavbarMenu } from '../../lib/menu'
import { showNavbar, showMenubar, bodyPageViewAlive, handleRefreshRouterView, showPage } from '../../lib/mixin'

import pLogo from './logo.vue'

const {
    showLogo = true,
    appName = layoutManager.props.value?.appName,
    userInfo = layoutManager.props.value?.userInfo
} = defineProps<LayoutProps & { showLogo?: boolean }>()

const emits = defineEmits<LayoutEmits>()

const route = useRoute();
const router = useRouter();

const handleEvent = (command: LayoutEvent) => {
    if (command == 'update_pwd') {
        showPage.value.updatePassword = true
    } else {
        emits('click', command)
        layoutManager.emits.value?.('click', command)
    }
}

const handleLoadListMenu = () => getListMenu(route, router)

onMounted(() => {
    handleLoadListMenu()
})

defineSlots<{
    'top': () => any,
    'top-center': () => any,
    'top-tail': () => any
}>()

</script>

<style lang="css">
/* @unocss-placeholder */
</style>

<style lang="scss">
.ux_layout_header {
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
        gap: 10px;
        display: flex;
        align-items: center;

        .ux-layout-logo {
            span {
                color: var(--el-text-color-primary);
            }
        }

        .name {
            font-size: 20px;
            font-weight: 600;
            letter-spacing: 1px;
            font-family: 'AlimamaFangYuanTiVF-Thin', system-ui;
        }
    }

    .center {
        flex: 1;
        width: 0;
        height: 100%;
        display: flex;

        .action {
            display: flex;
            height: 100%;
            margin: 0 10px;
            align-items: center;

            .show-navbar,
            .show-menubar,
            .refresh {
                width: 42px;
                height: 100%;
                display: flex;
                margin-right: 1px;
                align-items: center;
                justify-content: center;
            }
        }

        .navbar {
            flex: 1;
            width: 0;
            display: flex;
        }
    }

    .right {
        height: 100%;
        display: flex;
        grid-gap: 15px;
        align-items: center;
        margin-right: 32px;

        .el-dropdown-link {
            display: flex;
            outline: none;
            cursor: pointer;
            align-items: center;

            .username {
                margin: 0 6px;
            }

            .icon-down {
                content: '';
                width: 0;
                height: 0;
                top: 50%;
                right: -10px;
                margin-top: -3px;
                border-width: 6px;
                overflow: hidden;
                cursor: pointer;
                position: absolute;
                transition: all .3s;
                -webkit-transition: all .3s;
                border-style: solid dashed dashed;
                border-color: #999999 transparent transparent;
            }

            &:hover {
                .icon-down {
                    margin-top: -9px;
                    border-style: dashed dashed solid;
                    border-color: transparent transparent #999999;
                }
            }
        }
    }
}

.ux_layout_side {
    .ux_layout_header {
        .left {
            width: 220px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}

:is(.dark .ux_layout_header) {
    --border-color: var(--el-bg-color);
    background-color: var(--el-bg-color-overlay);

    .center {
        .toggle {
            --bg-color: var(--el-bg-color) !important;
        }
    }
}
</style>
