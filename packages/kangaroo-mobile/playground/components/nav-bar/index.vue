<template>
  <div>
    <demo-block :title="t('basicUsage')">
      <yhm-nav-bar :title="t('title')" />
    </demo-block>

    <demo-block :title="t('showBack')">
      <yhm-nav-bar
        :title="t('title')"
        :left-text="t('back')"
        show-back
      />
    </demo-block>

    <demo-block :title="t('rightButton')">
      <yhm-nav-bar
        :title="t('title')"
        :left-text="t('back')"
        :right-text="t('button')"
        show-back
      />
    </demo-block>

    <demo-block :title="t('useSlot')">
      <yhm-nav-bar
        :title="t('title')"
        :left-text="t('back')"
        show-back
      >
        <template #right>
          <yhm-icon name="search" size="18" />
        </template>
      </yhm-nav-bar>
    </demo-block>

    <demo-block :title="t('disableButton')">
      <yhm-nav-bar
        :title="t('title')"
        :left-text="t('back')"
        :right-text="t('button')"
        show-back
        left-disabled
        right-disabled
      />
    </demo-block>
  </div>
</template>

<script setup lang="ts">
import { createTranslate } from '@/locale'

const t = createTranslate('navBarDemo')
</script>
