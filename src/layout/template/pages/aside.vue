<template>
  <el-container class="ux_layout_aside ux-size-full">
    <el-aside :width="`${navbarWidth}px`" class="ux-flex ux-flex-col">
      <div class="header ux-z-1" :style="`--height:${styles?.header?.height || 56}px`">
        <p-logo class="ux-size-full" />
      </div>
      <div class="wrapper ux-h-0 ux-flex ux-flex-row ux-flex-1">
        <div class="navbar" :style="[
          { '--width': styles?.navbar?.width || '68px' },
          { '--bg-color': styles?.navbar?.bgColor || 'transparent' },
          { '--direction': styles?.navbar?.direction || 'column' },
          { '--shadow-color': styles?.navbar?.shadowColor || 'none' }
        ]">
          <div class="ux-h-0 ux-flex-1">
            <p-navbar />
          </div>
          <div class="ux-cursor-pointer">
            <p-nav-tail />
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
</template>

<script setup lang="ts">
import { computed, onMounted, defineAsyncComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Setting } from '@element-plus/icons-vue'

import type { LayoutEvent, LayoutProps, LayoutEmits } from '../../types'

import { getListMenu, listMenuOpens, listNavbarMenu, menuActive, handleClickMenuItem } from '../../lib/menu'
import { showNavbar, showMenubar, showPage } from '../../lib/mixin'

import pLogo from './../block/logo.vue'
import pNavbar from './../block/navbar.vue'
import pNavTail from './../block/nav_tail.vue'
import pMain from './../block/main.vue'

const layoutMenus = defineAsyncComponent(() => import('../../components/menus.vue'))

const {
  styles
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
      display: flex;
      gap: 10px;
      padding: 0 10px;
      align-items: center;
      height: var(--height);
      border-bottom: 1px solid var(--el-border-color);

      .ux-layout-logo {
        span {
          color: var(--el-text-color-primary);
        }
      }

      .name {
        flex: 1;
        width: 0;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 1px;
        font-family: 'AlimamaFangYuanTiVF-Thin', system-ui;
      }

    }

    .navbar {
      height: 100%;
      display: flex;
      width: var(--width);
      background: var(--bg-color);
      flex-direction: var(--direction);
      box-shadow: var(--shadow-color);


      .item:not(.active) {
        .el-icon {
          --color: var(--el-text-color-primary) !important;
        }

        .text {
          color: var(--el-text-color-primary);
        }
      }
    }
  }

}
</style>