<template>
    <svg class="ux_iconfont" aria-hidden="true" :style="`--size:${size}; --color:${color}`">
        <use :xlink:href="`#${name}`"></use>
    </svg>
</template>

<script lang="ts" setup>

import { configManager } from '../../config'

const config = configManager.get('IconFont')

const name = defineModel<string>('name', { required: true })
const size = defineModel<string>('size', { default: '1em' })
const color = defineModel<string>('color', { default: 'currentColor' })

if (config?.jsURL) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = config.jsURL
    document.head.appendChild(script)
}

defineOptions({
    name: 'UxIconfont'
})

</script>


<style lang="css">
  /* @unocss-placeholder */
</style>

<style lang="scss" scoped>
.ux_iconfont {
    --size: 1em;
    --color: currentColor;
    width: var(--size);
    height: var(--size);
    vertical-align: -0.15em;
    color: var(--color);
    fill: currentColor;
    overflow: hidden;
}
</style>