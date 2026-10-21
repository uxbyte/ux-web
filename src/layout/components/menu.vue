<template>
  <template v-for="menu in listMenuTree">
    <template v-if="menu.type == 'DIR' || (menu.children && menu.children.length > 0)">
      <template v-if="mode == 'submenu'">
        <el-sub-menu :index="menu.routeName || menu.name">
          <template #title>
            <template v-if="showIcon">
              <template v-if="menu.iconfont">
                <ux-iconfont :name="menu.iconfont" size="16px" />
              </template>
              <template v-else>
                <el-icon :size="16">
                  <Operation />
                </el-icon>
              </template>
            </template>
            <span>{{ menu.name }}</span>
          </template>
          <layout-menu :mode="mode" :show-icon="showIcon" :list-menu-tree="menu.children"
            @click="handleClickMenuItem" />
        </el-sub-menu>
      </template>
      <template v-else-if="mode == 'groups'">
        <el-menu-item-group :index="menu.routeName || menu.name" :title="menu.name">
          <layout-menu mode="submenu" :list-menu-tree="menu.children" @click="handleClickMenuItem" />
        </el-menu-item-group>
      </template>
      <template v-else>
        <el-menu-item :index="menu.routeName || menu.name" @click="handleClickMenuItem(menu)">
          <template v-if="showIcon">
            <template v-if="menu.iconfont">
              <ux-iconfont :name="menu.iconfont" size="16px" />
            </template>
            <template v-else>
              <el-icon :size="16">
                <Operation />
              </el-icon>
            </template>
          </template>
          <span>{{ menu.name }}</span>
        </el-menu-item>
      </template>
    </template>
    <template v-else>
      <el-menu-item :index="menu.routeName || menu.name" @click="handleClickMenuItem(menu)">
        <template v-if="showIcon">
          <template v-if="menu.iconfont">
            <ux-iconfont :name="menu.iconfont" size="16px" />
          </template>
          <template v-else>
            <el-icon :size="16">
              <Operation />
            </el-icon>
          </template>
        </template>
        <span>{{ menu.name }}</span>
      </el-menu-item>
    </template>
  </template>
</template>

<script setup lang="ts">

import { ElMenuItem, ElMenuItemGroup } from 'element-plus';
import { Operation } from '@element-plus/icons-vue'

import type { MenuTree } from "../types";

const {
  mode = 'groups', showIcon = false,
  listMenuTree = []
} = defineProps<{
  mode?: 'submenu' | 'groups'
  listMenuTree: MenuTree[]
  showIcon?: boolean
}>()

const emits = defineEmits<{
  (e: 'click', value: MenuTree): void
}>()

const handleClickMenuItem = (menu: MenuTree) => emits('click', menu)

defineOptions({ name: 'layout-menu' })

</script>

<style lang="css">
/* @unocss-placeholder */
</style>

<style lang="scss">
.el-menu {
  .el-menu-item-group {
    .el-menu-item {
      span {
        padding-left: 10px;
      }
    }
  }

  .el-menu-item {
    &.is-active {
      background: var(--el-menu-hover-bg-color);

      &:after {
        content: "";
        top: 50%;
        right: 0;
        bottom: 0;
        width: 2px;
        height: 38px;
        display: block;
        position: absolute;
        transform: translateY(-50%);
        background: var(--el-menu-active-color);
      }
    }
  }

}
</style>