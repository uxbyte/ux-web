import { ref, h, defineAsyncComponent } from 'vue'
import type { AsyncComponentLoader, Component } from 'vue'
import { uxTable } from './ux-table/utils'

const uxLoader = <T>(loader: AsyncComponentLoader<T>, delay = 0, timeout = 3000): T => {
  const retryCount = ref<number>(0)
  const errMessage = ref<string>('Error...')
  const loadingComponent = h('div', {
    class: 'size-full flex items-center justify-center'
  }, 'Loading...')
  const errorComponent = h('div', {
    class: 'size-full flex items-center justify-center'
  }, errMessage.value)

  return defineAsyncComponent({
    loader: loader as AsyncComponentLoader<Component>,
    delay: delay,
    timeout: timeout,
    errorComponent,
    loadingComponent,
    onError: (error, retry) => {
      errMessage.value = error.message;
      if (retryCount.value < 3) {
        retryCount.value++
        retry()
      } else {
        retryCount.value = 0;
      }
    }
  }) as T
}

export const uxComponent = {
  table: uxTable,
  loader: uxLoader
}
