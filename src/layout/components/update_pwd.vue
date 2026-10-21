<template>
  <ux-dialog :modelValue="modelValue" title="修改密码" width="520px" show-loading @ok="handleConfirm" @close="handleClose">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="88px">
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input v-model="formData.oldPwd" type="password" show-password placeholder="请输入" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input v-model="formData.newPwd" type="password" show-password placeholder="请输入" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input v-model="formData.confirmPwd" type="password" show-password placeholder="请输入" />
      </el-form-item>
    </el-form>
  </ux-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCloned } from '@vueuse/core'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { uxCrypto } from '../../utils'

const { modelValue = false } = defineProps<{
  modelValue: boolean
}>()

type Input = {
  oldPwd: string,
  newPwd: string,
  confirmPwd: string
}

export type okVal = Input & { done?: () => void }

const emits = defineEmits<{
  (e: 'update:modelValue', val: boolean): void,
  (e: 'ok', val: okVal): void
}>()

const formRef = ref<FormInstance>()
const formData = ref<Input>({
  oldPwd: '',
  newPwd: '',
  confirmPwd: '',
})

const formRules = ref<FormRules<Input>>({
  oldPwd: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      // @ts-ignore
      validator: (rule: any, value: any, callback: Function) => {
        const { confirmPwd } = formData.value
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else {
          if (confirmPwd !== '') {
            if (!formRef.value) return
            formRef.value.validateField('confirmPwd')
          }
          callback()
        }
      }, trigger: 'blur'
    }
  ],
  confirmPwd: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    {
      // @ts-ignore
      validator: (rule: any, value: any, callback: any) => {
        const { newPwd } = formData.value
        if (value === '') {
          callback(new Error('请输入确认密码'))
        } else if (value !== newPwd) {
          callback(new Error("密码不一致"))
        } else {
          callback()
        }
      }, trigger: 'blur'
    }
  ]
})

const handleConfirm = (callback: () => void) => {
  formRef.value?.validate().then(() => {
    const params = useCloned(formData.value).cloned.value
    const { oldPwd, newPwd, confirmPwd } = params;
    if (!oldPwd || !newPwd || !confirmPwd) {
      ElMessage.error("请填写完整信息")
      return
    }

    const fn = {
      oldPwd: uxCrypto.password(oldPwd),
      newPwd: uxCrypto.password(newPwd),
      confirmPwd: uxCrypto.password(confirmPwd),
      done: () => {
        ElMessage.success("修改成功")
        callback()
        handleClose()
      }
    }
    emits('ok', fn)
  }).catch(() => callback())
}

const handleClose = () => {
  formRef.value?.resetFields()
  emits('update:modelValue', false)
}

</script>

<style lang="css">
  /* @unocss-placeholder */
</style>