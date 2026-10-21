<template>
  <div class="ux_pagination">
    <el-pagination :default-current-page="page" :default-page-size="limit" :total="total" background :size="size"
      layout="total, prev, pager, next, sizes, jumper" v-bind="$attrs" @current-change="handlePageChange"
      @size-change="handlePageSizeChange" />
  </div>
</template>

<script setup lang="ts">

import { ElPagination } from "element-plus";
import type { UxPaginationProps, UxPaginationEmits } from './types'

const {
  page = 1, limit = 10, total = 0, size = 'small'
} = defineProps<UxPaginationProps>()

const emits = defineEmits<UxPaginationEmits>()

const handlePageChange = (page: number) => {
  emits('update:page', page)
  emits('change', {
    type: 'page',
    page, limit
  })
}

const handlePageSizeChange = (size: number) => {
  emits('update:page', 1)
  emits('update:limit', size)
  emits('change', {
    type: 'size',
    page, limit: size
  })
}

defineOptions({
  name: 'ux-pagination'
})

</script>

<style lang="css">
  /* @unocss-placeholder */
</style>