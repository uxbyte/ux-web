<template>
  <div class="ux_table ux-flex-1 ux-w-full ux-h-full ux-flex ux-flex-col">
    <div class="ux-flex-1 ux-h-0 ux-overflow-hidden">
      <component v-loading="listResp.loading" :is="h(ElTable, {
        ...$attrs, border, data: listData, height: '100%', ref: componentRef
      }, $slots)" />
    </div>
    <div class="ux-p-2.5 ux-box-border ux-bg-[var(--el-bg-color-overlay)]" v-if="pagination">
      <ux-pagination v-model:page="listResp.page" v-model:limit="listResp.limit" :total="listTotal" v-bind="$attrs"
        @change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed, onMounted, ref, watch, useAttrs, h, getCurrentInstance } from "vue";
import { ElTable } from "element-plus";
import lodash from 'lodash'
import { uxUtils, uxRequest, type ApiRespList } from "../../utils";
import { UxPagination, type Pagination } from "../ux-pagination";

import type { UxTableProps, UxTableEmits, ListResp } from './types'

const vm = getCurrentInstance()

const attrs = useAttrs()

const {
  url,
  border = true,
  data = [],
  limit = 20,
  queryParams = {},
  pagination = true,
  total = 0,
  loading = false,
  beforeRender,
  loadtime = 'onready'
} = defineProps<UxTableProps>()

const emits = defineEmits<UxTableEmits>()

const componentRef = (instance: any) => {
  if (!vm) return false;
  const exposed = lodash.merge(instance, {
    request: handleRequest,
    getListData
  })
  vm.exposed = exposed;
  vm.exposeProxy = exposed;
}

const listResp = ref<ListResp<any>>({
  loading: loading,
  page: 1,
  limit: limit,
  list: [],
  total: 0
})

const listTotal = computed(() => url ? listResp.value.total : total)
const listData = computed(() => data.length > 0 ? data : listResp.value.list)

const getListData = async <R>(force = false) => {
  return new Promise<R>(async (resolve) => {
    if (force) {
      handleRequest<R>(() => {
        resolve(listData.value as R)
      })
    } else {
      resolve(listData.value as R)
    }
  })
}

const handleRequest = <R extends unknown>(callback?: () => void) => {
  if (!url) return false;
  const { page, limit } = listResp.value
  listResp.value.loading = true;
  emits('update:loading', listResp.value.loading)
  const params = pagination ? Object.assign({}, { page, limit }, queryParams) : { ...queryParams }
  uxRequest.get<ApiRespList<R>>(url, params).then((apiResp) => {
    const response = apiResp.data.value.data
    listResp.value.list = []
    if (beforeRender && typeof beforeRender === 'function') {
      beforeRender(response).then((resp) => {
        handleRender<R>(resp)
      })
    } else {
      handleRender<R>(response)
    }
    if (typeof callback === 'function') {
      callback();
    }
  }).finally(() => {
    listResp.value.loading = false;
    emits('update:loading', listResp.value.loading)
  })
}

const handleRender = <T extends unknown>(response: ApiRespList<T>) => {
  if (Object.prototype.toString.call(response) === '[object Object]') {
    let { list, total } = response
    if (!list) {
      list = [response as T]
      total = 1;
    }
    if (attrs.rowKey) {
      listResp.value.list = uxUtils.listToTree(list);
    } else {
      listResp.value.list = list;
    }
    listResp.value.total = total;
  } else if (Array.isArray(response)) {
    listResp.value.list = response;
    listResp.value.total = response.length;
  }
  emits('complete', listResp.value.list)
}

const handlePageChange = ({ page, limit }: Pagination) => {
  if (url) {
    handleRequest();
  } else {
    emits('pageChange', { page, limit })
  }
}

watch(() => [url, queryParams], () => {
  if (loadtime === 'onready') {
    getListData<any>(true)
  }
}, { deep: true })


onMounted(() => {
  if (loadtime == 'onready') {
    getListData(true)
  }
})

defineExpose<{
  request: typeof handleRequest,
  getListData: typeof getListData
}>()

defineOptions({
  name: 'UxTable'
})

</script>

<style lang="css">
  /* @unocss-placeholder */
</style>

<style lang="scss">
.ux_table {

  .el-table__border-left-patch {
    display: none;
  }

  .el-pagination {
    display: flex;
    align-items: center;
  }
}
</style>