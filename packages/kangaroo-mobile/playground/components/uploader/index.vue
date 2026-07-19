<script setup lang="ts">
import { ref } from 'vue';
import VanButton from 'vant/es/button';
import { showToast } from 'vant';
import { useTranslate } from '@/locale/useTranslate';
import { cdnURL } from '../../site';
import type { UploaderFileListItem } from 'vant';

const t = useTranslate({
  'zh-CN': {
    status: '上传状态',
    failed: '上传失败',
    upload: '上传文件',
    preview: '文件预览',
    maxSize: '限制上传大小',
    disabled: '禁用文件上传',
    maxCount: '限制上传数量',
    uploading: '上传中...',
    imageName: '图片名称',
    beforeRead: '上传前置处理',
    overSizeTip: '文件大小不能超过 500kb',
    invalidType: '请上传 jpg 格式图片',
    customUpload: '自定义上传样式',
    previewSize: '自定义预览大小',
    previewCover: '自定义预览样式',
    deleteMessage: '删除前置处理',
    customPreviewImage: '自定义单个图片预览',
    reupload: '开启覆盖上传',
  },
  'en-US': {
    status: 'Upload Status',
    failed: 'Failed',
    upload: 'Upload File',
    preview: 'Preview File',
    maxSize: 'Max Size',
    disabled: 'Disable Uploader',
    maxCount: 'Max Count',
    uploading: 'Uploading...',
    imageName: 'Image Name',
    beforeRead: 'Before Read',
    overSizeTip: 'File size cannot exceed 500kb',
    invalidType: 'Please upload an image in jpg format',
    customUpload: 'Custom Upload Area',
    previewSize: 'Preview Size',
    previewCover: 'Preview Cover',
    deleteMessage: 'Before Delete',
    customPreviewImage: 'Custom single preview image',
    reupload: 'Enable Reupload',
  },
});

const fileList = ref([{ url: cdnURL('leaf.jpeg') }, { url: cdnURL('tree.jpeg') }]);

const fileList2 = ref([{ url: cdnURL('sand.jpeg') }]);

const fileList3 = ref([]);

const fileList4 = ref([{ url: cdnURL('sand.jpeg') }]);

const fileList5 = ref<UploaderFileListItem[]>([
  {
    url: cdnURL('sand.jpeg'),
    deletable: true,
    beforeDelete: () => {
      showToast(t('deleteMessage'));
    },
  },
  {
    url: cdnURL('tree.jpeg'),
    imageFit: 'contain',
  },
]);

const statusFileList = ref<UploaderFileListItem[]>([
  {
    url: cdnURL('leaf.jpeg'),
    status: 'uploading',
    message: t('uploading'),
  },
  {
    url: cdnURL('tree.jpeg'),
    status: 'failed',
    message: t('failed'),
  },
]);

const previewCoverFiles = ref<UploaderFileListItem[]>([
  {
    url: cdnURL('leaf.jpeg'),
    file: { name: t('imageName') } as File,
  },
]);

const previewSizeFiles = ref<UploaderFileListItem[]>([{ url: cdnURL('leaf.jpeg') }]);

const beforeRead = (file: File | File[]) => {
  if (Array.isArray(file)) return true;
  if (file.type !== 'image/jpeg') {
    showToast(t('invalidType'));
    return false;
  }
  return true;
};

const afterReadFailed = (item: UploaderFileListItem | UploaderFileListItem[]) => {
  const items = Array.isArray(item) ? item : [item];
  items.forEach((i) => {
    i.status = 'uploading';
    i.message = t('uploading');
    setTimeout(() => {
      i.status = 'failed';
      i.message = t('failed');
    }, 1000);
  });
};

const onOversize = () => showToast(t('overSizeTip'));

const fileList6 = ref([{ url: cdnURL('leaf.jpeg') }]);
</script>

<template>
  <div class="demo-uploader">
    <demo-block :title="t('basicUsage')">
      <yhm-uploader />
    </demo-block>

    <demo-block :title="t('preview')">
      <yhm-uploader v-model="fileList" multiple accept="*" />
    </demo-block>

    <demo-block :title="t('status')">
      <yhm-uploader v-model="statusFileList" :after-read="afterReadFailed" />
    </demo-block>

    <demo-block :title="t('maxCount')">
      <yhm-uploader v-model="fileList2" multiple :max-count="2" />
    </demo-block>

    <demo-block :title="t('maxSize')">
      <yhm-uploader v-model="fileList4" multiple :max-size="500 * 1024" @oversize="onOversize" />
    </demo-block>

    <demo-block :title="t('customUpload')">
      <yhm-uploader>
        <VanButton type="primary" icon="plus">
          {{ t('upload') }}
        </VanButton>
      </yhm-uploader>
    </demo-block>

    <demo-block :title="t('previewCover')">
      <yhm-uploader v-model="previewCoverFiles">
        <template #preview-cover="{ file }">
          <div class="preview-cover van-ellipsis">{{ file.name }}</div>
        </template>
      </yhm-uploader>
    </demo-block>

    <demo-block :title="t('previewSize')">
      <yhm-uploader v-model="previewSizeFiles" preview-size="60" />
    </demo-block>

    <demo-block :title="t('beforeRead')">
      <yhm-uploader v-model="fileList3" :before-read="beforeRead" />
    </demo-block>

    <demo-block :title="t('disabled')">
      <yhm-uploader disabled />
    </demo-block>

    <demo-block :title="t('customPreviewImage')">
      <yhm-uploader v-model="fileList5" multiple accept="*" :deletable="false" />
    </demo-block>

    <demo-block :title="t('reupload')">
      <yhm-uploader v-model="fileList6" reupload max-count="2" />
    </demo-block>
  </div>
</template>

<style lang="less">
.demo-uploader {
  background-color: var(--van-background-2);

  .van-uploader {
    margin-left: var(--van-padding-md);
  }

  .preview-cover {
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 4px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
