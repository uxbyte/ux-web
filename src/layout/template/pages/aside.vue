<template>
  <p-layout @update_pwd="emits('update_pwd')">
    <el-container class="ux_layout_aside ux-size-full">
      <el-aside :width="`${navbarWidth}px`" class="ux-flex ux-flex-col">
        <template v-if="appLogo !== false">
          <div class="header ux-z-1" :style="`--height:${styles?.header?.height || 56}px`">
            <p-logo class="ux-size-full" />
          </div>
        </template>
        <div class="wrapper ux-h-0 ux-flex ux-flex-row ux-flex-1">
          <div class="navbar ux-flex ux-flex-col ux-w-17 light:ux-bg-[#f5f6f8]" :style="[
            { '--bg-color': styles?.navbar?.bgColor }
          ]">
            <div class="list ux-h-0 ux-flex-1">
              <p-navbar />
            </div>
            <div class="tail">
              <el-popover placement="right" width="300px" :popper-style="{
                padding: '0px', margin: '0px'
              }" :show-arrow="false" :offset="2">
                <template #reference>
                  <div class="ux-w-full ux-h-14.5 ux-flex ux-items-center ux-justify-center">
                    <el-avatar :size="32" fit="cover" :src="userInfo?.avatar" />
                  </div>
                </template>
                <div class="tail-panel">
                  <div class="header">
                    <el-avatar :size="32" fit="cover" :src="userInfo?.avatar" />
                    <span class="ux-font-size-4 ux-ml-2.5 dark:ux-color-white">
                      {{ userInfo?.nickname || '佚名' }}
                    </span>
                  </div>
                  <div class="tail-item">
                    <slot name="tail-item"></slot>
                  </div>
                  <div class="tail-item" @click="showPage.updatePassword = true">
                    <div class="ux-flex ux-items-center ux-h-13">
                      <el-icon size="22" class="dark:ux-color-white">
                        <Lock />
                      </el-icon>
                      <span class="ux-flex-1 ux-w-0 ux-color-[#333] ux-ml-2.5 dark:ux-color-white">修改密码</span>
                    </div>
                  </div>
                  <div class="tail-item" @click="handleEvent('logout')">
                    <div class="ux-flex ux-items-center ux-h-13">
                      <el-icon size="22" class="dark:ux-color-white">
                        <SwitchButton />
                      </el-icon>
                      <span class="ux-flex-1 ux-w-0 ux-color-[#333] ux-ml-2.5 dark:ux-color-white">退出系统</span>
                    </div>
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
          <el-divider direction="vertical" style="margin: 0;height: 100%;" />
          <div class="menu ux-flex-1 light:ux-bg-[#fafafb] ux-flex ux-flex-col" :style="[
            { '--bg-color': styles?.menu?.bgColor }
          ]">
            <div class="ux-flex-1 ux-h-0">
              <el-scrollbar noresize>
                <layout-menus :autoHome="false" :list-menu-tree="listNavbarMenu" :menu-active="menuActive"
                  :is-collapse="showMenubar" :menu-openeds="listMenuOpens" @click="handleClickMenuItem" />
              </el-scrollbar>
            </div>
            <el-divider style="margin: 0;" />
            <div class="ux-p-2.5 ux-flex ux-items-center ux-justify-center">
              <el-tooltip content="设置" placement="top">
                <el-icon :size="24" class="ux-cursor-pointer" @click="showPage.setting = true">
                  <Setting />
                </el-icon>
              </el-tooltip>
            </div>
          </div>
        </div>
      </el-aside>
      <el-main style="--el-main-padding: 0;">
        <p-main>
          <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps ?? {}"></slot>
          </template>
        </p-main>
      </el-main>
    </el-container>
  </p-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Lock, SwitchButton, Setting } from '@element-plus/icons-vue'

import type { LayoutEvent, LayoutProps, LayoutEmits } from '../../types'

import * as layoutManager from '../../lib/manager'
import { getListMenu, listMenuOpens, listNavbarMenu, menuActive, handleClickMenuItem } from '../../lib/menu'
import { showNavbar, showMenubar, showPage } from '../../lib/mixin'

import pLayout from '../../components/layout.vue'

import pLogo from './../block/logo.vue'
import pNavbar from './../block/navbar.vue'
import pMain from './../block/main.vue'

const layoutMenus = defineAsyncComponent(() => import('../../components/menus.vue'))

const {
  styles, userInfo,
  appLogo = layoutManager.props.value?.appLogo
} = defineProps<LayoutProps>()

const emits = defineEmits<LayoutEmits>()

const route = useRoute();
const router = useRouter();

const navbarWidth = computed(() => {
  let w = (styles?.navbar?.width || 0) + (styles?.menu?.width || 0)
  return showNavbar.value ? (w || 220) : (styles?.navbar?.width || 68)
})

const handleEvent = (command: LayoutEvent) => {
  if (command == 'update_pwd') {
    showPage.value.updatePassword = true
  } else {
    emits('click', command)
  }
}

onMounted(() => getListMenu(route, router))

defineOptions({
  name: 'ux-layout-aside'
})

type MainSlots = InstanceType<typeof pMain>['$slots']

defineSlots<MainSlots & {
  'tail-item'?: () => any
}>()

</script>

<style lang="css">
/* @unocss-placeholder */
</style>

<style lang="scss">
.ux_layout_aside {

  &>.el-aside {

    .header {
      width: 100%;
      height: var(--height);
      border-bottom: 1px solid var(--el-border-color);

      .ux-layout-logo {
        span {
          color: var(--el-text-color-primary);
        }
      }
    }

    .navbar {
      .item:not(.active) {
        .el-icon {
          --color: var(--el-text-color-primary) !important;
        }

        .text {
          color: var(--el-text-color-primary);
        }
      }
    }

    .tail {
      cursor: pointer;
    }
  }

}

.tail-panel {
  padding-bottom: 12px;

  .header {
    --bg-color: #ddd;
    width: 100%;
    height: 60px;
    display: flex;
    padding: 0 16px;
    background: #ddd;
    margin-bottom: 12px;
    align-items: center;
    box-sizing: border-box;
    background-color: var(--bg-color);
  }

  .tail-item {
    padding: 0 20px;
    cursor: pointer;

    &:not(:last-child) {
      .flex {
        border-bottom: 1px solid var(--el-border-color);
      }
    }

    &:hover {
      background-color: var(--el-color-primary);

      .el-icon,
      span {
        color: #fff;
      }
    }
  }
}

:is(.dark) {
  .tail-panel {
    .header {
      --bg-color: var(--el-bg-color-overlay);
    }
  }
}
</style>