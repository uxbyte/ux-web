<template>
  <slot name="default" :loading="loading" :response="response" :error="error"></slot>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Qs from 'qs'

import type { UxRequestProps, UxRequestEmits } from './types'
import { uxCached, uxCrypto, uxRequest } from '../../utils'

const {
  url,
  method = 'GET',
  cache = true,
  queryParams = {},
  load
} = defineProps<UxRequestProps>()

const emits = defineEmits<UxRequestEmits>()

const loading = ref<boolean>(false)
const error = ref<Error>()
const response = ref<any>()

const handleRequest = <T>() => {
  loading.value = true;
  uxRequest.request<T>(url, method, queryParams).then(apiResp => {
    if (load && typeof load === 'function') {
      response.value = load(apiResp.data.value.data)
    } else {
      response.value = apiResp.data.value.data
    }

    if (cache === true || Number(cache) > 0) {
      const random = uxCrypto.md5(Qs.stringify(queryParams, { arrayFormat: 'brackets' }));
      const key = `uxRequest:${url}?${random})}`
      const expired = typeof cache === 'boolean' ? -1 : Number(cache) * 1000
      uxCached.set(key, response.value, expired, true)
    }

    emits('success', response.value)
  }).catch(e => {
    error.value = e;
  }).finally(() => {
    loading.value = false
  })
}

const handleCacheRequest = <T>(clear = false) => {
  loading.value = true
  if (clear) {
    response.value = {}
  }
  if (cache === true || Number(cache) > 0) {
    loading.value = true;
    const key = `uxRequest:${url}?${Qs.stringify(queryParams, {
      arrayFormat: 'brackets'
    })}`
    uxCached.get(key, true).then(result => {
      if (result) {
        if (load && typeof load === 'function') {
          response.value = load(result)
        } else {
          response.value = result
        }
        emits('success', response.value)
      } else {
        handleRequest<T>()
      }
    }).finally(() => {
      loading.value = false
    })
  } else {
    handleRequest<T>()
  }
}

watch([() => url, () => queryParams], () => {
  handleCacheRequest<any>()
}, { deep: true, immediate: true })

defineExpose<{
  data: any,
  request: typeof handleCacheRequest
}>({
  data: response,
  request: handleCacheRequest,
})

defineOptions({
  name: "ux-request"
})
</script>

<style lang="css">
  /* @unocss-placeholder */
</style>