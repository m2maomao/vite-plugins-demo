<template>
  <VanUploader
    v-bind="uploaderProps as any"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)"
    @oversize="$emit('oversize', $event)"
    @click-preview="$emit('clickPreview', $event)"
    @delete="$emit('delete', $event)"
  >
    <!-- 默认 slot：自定义上传触发器（有内容时才转发） -->
    <template v-if="$slots.default" #default>
      <slot />
    </template>
    <!-- preview-cover slot：自定义预览覆盖层 -->
    <template v-if="$slots['preview-cover']" #preview-cover="slotProps">
      <slot name="preview-cover" v-bind="slotProps" />
    </template>
  </VanUploader>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Uploader as VanUploader } from 'vant'

defineOptions({
  name: 'YhmUploader',
})

const props = withDefaults(
  defineProps<{
    modelValue?: unknown[]
    accept?: string
    name?: string
    previewSize?: string | number
    previewImage?: boolean
    previewFullImage?: boolean
    previewOptions?: Record<string, unknown>
    multiple?: boolean
    disabled?: boolean
    readonly?: boolean
    deletable?: boolean
    showUpload?: boolean
    reupload?: boolean
    maxCount?: number | string
    maxSize?: number | string
    capture?: string
    beforeRead?: (file: any, detail: any) => boolean | undefined | Promise<any>
    afterRead?: (file: any, detail: any) => void
    beforeDelete?: any
    resultType?: string
    uploadIcon?: string
    uploadText?: string
  }>(),
  {
    disabled: false,
    readonly: false,
    deletable: true,
    showUpload: true,
    reupload: false,
    previewImage: true,
    previewFullImage: true,
    multiple: false,
  }
)

defineEmits<{
  (e: 'update:modelValue', value: unknown[]): void
  (e: 'change', value: unknown[]): void
  (e: 'oversize', value: any): void
  (e: 'clickPreview', value: any): void
  (e: 'delete', value: any): void
}>()

const uploaderProps = computed(() => {
  const result: Record<string, unknown> = {}
  const keys: (keyof typeof props)[] = [
    'accept', 'name', 'previewSize', 'previewImage', 'previewFullImage',
    'previewOptions', 'multiple', 'disabled', 'readonly', 'deletable',
    'showUpload', 'reupload', 'maxCount', 'maxSize', 'capture',
    'beforeRead', 'afterRead', 'beforeDelete', 'resultType',
    'uploadIcon', 'uploadText',
  ]
  for (const key of keys) {
    const val = props[key]
    if (val !== undefined) {
      result[key] = val
    }
  }
  return result
})
</script>
