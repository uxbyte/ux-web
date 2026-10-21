<template>
  <div class="ux_theme">
    <div class="capsule" v-if="mode === 'capsule'" @click="toggleDark()">
      <div class="check">
        <img src="../../assets/theme_capsule_light.svg" />
        <img src="../../assets/theme_capsule_dark.svg" />
      </div>
    </div>

    <div class="tabs" v-else-if="mode === 'tab'">
      <div class="tab light" @click="toggleDark()">
        <div class="icon">
          <img src="../../assets/theme_light.svg" />
          <img src="../../assets/check.svg" class="checked" v-if="!isDark" />
        </div>
        <p class="txt">明亮</p>
      </div>
      <div class="tab dark" @click="toggleDark()">
        <div class="icon">
          <img src="../../assets/theme_dark.svg" />
          <img src="../../assets/check.svg" class="checked" v-if="isDark" />
        </div>
        <p class="txt">暗黑</p>
      </div>
      <div class="tab auto" @click="toggleDark()" v-if="false">
        <div class="icon">
          <img src="../../assets/theme_auto.svg" />
          <img src="../../assets/check.svg" class="checked" v-if="!isDark" />
        </div>
        <p class="txt">跟随系统</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useDark, useToggle } from '@vueuse/core'
import type { UxThemeProps } from './types'

const {
  mode = 'capsule'
} = defineProps<UxThemeProps>()

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: 'light'
})
const toggleDark = useToggle(isDark)

defineOptions({
  name: 'ux-theme'
})
</script>

<style lang="css">
/* @unocss-placeholder */
</style>

<style scoped lang="scss">
.ux_theme {
  .capsule {
    width: 40px;
    height: 22px;
    cursor: pointer;
    position: relative;
    border-radius: 11px;
    background-color: #F1F1F1;
    border: 1px solid rgba(60, 60, 60, .29);
    transition: border-color .25s, background-color .25s;

    .check {
      top: 1px;
      left: 2px;
      width: 18px;
      height: 18px;
      position: absolute;
      border-radius: 50%;
      background-color: white;
      transition: background-color .25s, transform .25s;
      box-shadow: 0 1px 2px rgba(0, 0, 0, .04), 0 1px 2px rgba(0, 0, 0, .06);

      img {
        top: 3px;
        left: 3px;
        width: 12px;
        height: 12px;
        position: absolute;
      }
    }
  }

  .tabs {
    display: flex;
    grid-gap: 10px;
    grid-template-columns: repeat(3, 1fr);

    .tab {
      cursor: pointer;
      max-width: 92px;
      min-height: 32px;
      overflow: hidden;

      .icon {
        position: relative;
        border-radius: 10px;
        overflow: hidden;

        svg {
          display: block;
        }

        .checked {
          right: 0;
          bottom: 0;
          position: absolute;
        }
      }

      .txt {
        margin-block-start: 0;
        margin-block-end: 0;
        text-align: center;
        margin-top: 6px;
        font-size: 14px;
      }
    }
  }

}

:is(.dark .g-switch-theme) {
  .capsule {
    background-color: #2F2F2F;
    border: 1px solid rgba(84, 84, 84, .65);

    .check {
      background-color: #2F2F2F;
      transform: translate(18px);
    }
  }
}
</style>