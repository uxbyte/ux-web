<template>
  <div class="ux_upload" :style="`--size:${size}px`">
    <el-upload ref="elUploadRef" v-model:file-list="fileList" v-bind="$attrs" :action="uploadUrl"
      :limit="multiple ? 9 : 1" :multiple="multiple" :show-file-list="showFileList"
      :disabled="disabled || uploading || error != null" :list-type="listType" :on-change="handleChange"
      :on-exceed="handleExceed" :on-success="handleSuccess">
      <template #trigger>
        <slot name="trigger" :tips="tipText" :files="fileList">
          <template v-if="listType == 'picture-card'">
            <el-icon size="20" v-if="error == null">
              <Plus />
            </el-icon>
            <el-icon size="20" color="red" v-else>
              <WarningFilled />
            </el-icon>
          </template>
          <template v-else>
            <el-button type="primary" :icon="Upload">选择文件</el-button>
          </template>
        </slot>
      </template>
      <template #tip v-if="showTips">
        <div class="el-upload__tip">
          <slot name="tips">{{ tipText }}</slot>
        </div>
      </template>
      <template #file="{ file }">
        <slot name="file" :file="file">
          <div class="ux-relative ux-size-full ux-leading-5.5">
            <template v-if="file.url && util.isImg(file)">
              <el-image :src="file.url" class="ux-size-full" :preview-src-list="[
                file.url
              ]" preview-teleported>
                <template #error>
                  <div class="el-image__error">Fail</div>
                </template>
              </el-image>
            </template>
            <template v-else>
              <el-tooltip effect="dark" :content="file.name">
                <div class="ux-size-full ux-flex-center">
                  <el-icon size="20">
                    <Document />
                  </el-icon>
                  <span class="ux-ml-2.5 ux-truncate ux-pr-5">{{ file.name }}</span>
                </div>
              </el-tooltip>
            </template>
            <div v-if="!disabled" :class="[
              'ux-absolute ux-top-0 ux-right-0 ux-z-1 ux-p-0.5',
              'ux-bg-[var(--el-color-danger)] ux-cursor-pointer'
            ]" @click="handleRemove(file)">
              <el-icon size="12" color="white">
                <Close />
              </el-icon>
            </div>
            <div v-if="(file?.percentage || 0) < 100" :class="[
              'ux-absolute ux-size-full ux-left-0 ux-top-0',
              'ux-z-2 ux-bg-[rgba(0,0,0,.5)] ux-flex-center'
            ]">
              <span class="ux-color-white">{{ file.percentage }}%</span>
            </div>
          </div>
        </slot>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, useTemplateRef, useAttrs, useSlots, Slots } from 'vue'
import { ElMessage, genFileId } from 'element-plus'
import { Upload, Plus, Document, WarningFilled, Close } from '@element-plus/icons-vue'
import type { UploadInstance, UploadFile, UploadFiles, UploadRawFile, UploadUserFile } from 'element-plus'
import { configManager } from '../../config'
import type { UxUploadProps, UxUploadEmits, UploadResp, UploadType, UxFileResp } from './types'

import * as util from './utils'

const config = configManager.get('Upload')
const confMaxSize = config?.maxSize || {
  file: 20 * 1024 * 1024,
  image: 2 * 1024 * 1024,
  audio: 20 * 1024 * 1024,
  video: 500 * 1024 * 1024
}

const attrs = useAttrs()
const slots: Slots = useSlots()

type Single = string | UxFileResp
type Multiple = string[] | UxFileResp[]

type ValsType<T extends Boolean> = T extends true ? Single : Multiple

const modelValue = defineModel<ValsType<typeof multiple>>('modelValue', { required: false })
const {
  urls, action, tips = true, type = 'image',
  size = 72, multiple = false, disabled = false,
  showFileList = true
} = defineProps<UxUploadProps>()

const emits = defineEmits<UxUploadEmits>()

const getMaxSize = ((type: UploadType) => {
  if (typeof confMaxSize == 'number') {
    return confMaxSize
  }
  const { image, video, file } = confMaxSize as Required<typeof confMaxSize>
  if (type == 'image') {
    return image
  } else if (type == 'video') {
    return video
  } else if (type == 'file') {
    return file
  }
  return 0;
})

const tipText = computed(() => {
  if (typeof tips === 'string') {
    return tips
  }
  let tipText = []
  let size = getMaxSize(type) / 1024 / 1024;
  if (type == 'image') {
    tipText.push(`上传图片需小于${size}M`)
  } else if (type == 'video') {
    tipText.push(`上传视频需小于${size}M`)
  } else if (type == 'file') {
    tipText.push(`上传文件需小于${size}M`)
  }
  tipText.push(`最多可上传${multiple ? (attrs.limit || 9) : 1}个文件`)
  return tipText.join('，')
})

const showTips = computed<boolean>(() => {
  return tips !== false && !(slots['tip'])
})

const listType = computed(() => {
  if ((type != 'image' || slots['trigger'])) {
    return 'text'
  }
  return 'picture-card'
})

const uploadUrl = computed(() => {
  if (action) {
    return action
  }
  const url = (typeof config?.urls == 'string' ? config?.urls : config?.urls?.[type])
  const baseApiUrl = configManager.get('uxRequest')?.baseURL
  return (config?.baseURL || baseApiUrl || '') + (url || '')
})

const elUploadRef = useTemplateRef<UploadInstance>('elUploadRef')

const fileList = ref<UploadUserFile[]>([])

const error = ref<string>()
const uploading = ref<boolean>(false)

const fileUrls = computed(() => {
  return fileList.value.map(f => f.url).filter(f => f != undefined)
})

const handleChange = (file: UploadFile, files: UploadFiles) => {
  if (file.status == 'ready') {
    if (file.raw?.type.startsWith('image/')) {
      const maxSize = getMaxSize('image');
      if ((file.size || 0) > maxSize) {
        ElMessage.error(
          `上传图片不能大于${maxSize / 1024 / 1024}M`
        )
        elUploadRef.value?.handleRemove(file)
      }
    } else if (file.raw?.type.startsWith('video/')) {
      const maxSize = getMaxSize('video');
      if ((file.size || 0) > maxSize) {
        ElMessage.error(
          `上传视频不能大于${maxSize / 1024 / 1024}M`
        )
        elUploadRef.value?.handleRemove(file)
      }
    } else {
      const maxSize = getMaxSize('file');
      if ((file.size || 0) > maxSize) {
        ElMessage.error(
          `上传文件不能大于${maxSize / 1024 / 1024}M`
        )
        elUploadRef.value?.handleRemove(file)
      }
    }
  } else if (file.status == 'success') {
    file.url = (file.response as UploadResp)?.data?.url
    setTimeout(() => {
      handleUpdateValues()
      handleUpdateUrls()
    }, 100)
  }
  uploading.value = files.filter((f) => f.status == 'uploading').length > 0
}

const handleExceed = (files: File[]) => {
  if (attrs.multiple !== true) {
    elUploadRef.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    elUploadRef.value!.handleStart(file)
    elUploadRef.value!.submit()
  }
}

const handleRemove = (file: UploadFile) => {
  elUploadRef.value?.handleRemove(file)
  setTimeout(() => {
    handleUpdateValues()
    handleUpdateUrls()
    emits('remove', file)
  }, 100)
}

const handleSuccess = (response: UploadResp, file: UploadFile) => {
  const { code, data, message } = response
  if (code != 200) {
    ElMessage.error(message)
    elUploadRef.value?.handleRemove(file)
  } else {
    file.url = data.url
    emits('success', response.data)
  }
}

const handleRender = (values?: Single | Multiple) => {
  values = values != undefined ? values : modelValue.value || urls
  if (values == undefined || values == null) {
    values = multiple ? [] : ''
  }
  const defaultValue = { name: '', percentage: 100 }
  if (multiple) {
    if (!Array.isArray(values)) {
      console.error('错误')
      error.value = '错误'
      return
    }
    fileList.value = values.map((val) => {
      if (typeof val == 'string') {
        return {
          ...defaultValue,
          url: val,
          name: val.split('/').pop() || ''
        }
      }
      return {
        ...defaultValue,
        url: val.url,
        name: val.name
      } as UploadUserFile
    })
  } else {
    if (values == '') return
    if (typeof values == 'string') {
      fileList.value = [{
        ...defaultValue,
        url: values,
        name: values.split('/').pop() || ''
      }]
    } else {
      const { name, url } = values as UxFileResp
      fileList.value = [{
        ...defaultValue,
        url, name: name || ''
      }]
    }
  }
}

const handleUpdateValues = () => {
  if (modelValue.value == undefined) return
  const values = fileList.value.map((file) => {
    let { name, url, response } = file
    if (url?.startsWith('blob') && response) {
      url = (response as UploadResp).data.url
    }
    if (multiple) {
      if (typeof (modelValue.value as Multiple)[0] === 'string') {
        return url
      }
    } else if (typeof (modelValue.value) === 'string') {
      return url
    }
    return { name, url }
  }).filter((f) => f != undefined)
  emits('update:modelValue', multiple ? values : values[0])
}

const handleUpdateUrls = () => {
  if (fileList.value.length == 0) {
    emits('update:urls', multiple ? [] : '')
    return
  }
  emits('update:urls', fileUrls.value)
}

watchEffect(() => {
  handleRender()
  if (!urls) {
    handleUpdateUrls()
  }
})

defineExpose<{
  urls: () => string[]
}>({
  urls: () => fileUrls.value
})

defineOptions({ name: 'ux-upload' })

</script>

<style lang="css">
  /* @unocss-placeholder */
</style>

<style lang="scss">
.el-table {
  .ux_upload {
    .el-image {
      max-width: 100% !important;
      max-height: 100% !important;
    }
  }
}

.el-form {
  .ux_upload {
    line-height: 22px;
  }
}

.ux_upload {
  --size: 72px;
  max-width: 100%;

  .el-upload--picture-card {
    --el-upload-picture-card-size: var(--size);
  }

  .el-upload-list--picture-card {
    --el-upload-list-picture-card-size: var(--size);
  }
}
</style>
