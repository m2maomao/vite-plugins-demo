<template>
  <demo-nav :title="componentName" @back="goHome" />
  <demo-section>
    <component :is="demoComponent" />
  </demo-section>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const componentName = computed(() => {
  const key = route.path.replace('/', '')
  if (!key) return ''
  return 'Yhm-' + key
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-')
})

const demoComponent = computed(() => {
  const key = route.path.replace('/', '')
  // Map route names to demo component modules
  const modules: Record<string, any> = {
    icon: () => import('./components/icon/index.vue'),
    cell: () => import('./components/cell/index.vue'),
    field: () => import('./components/field/index.vue'),
    switch: () => import('./components/switch/index.vue'),
    'nav-bar': () => import('./components/nav-bar/index.vue'),
    button: () => import('./components/button/index.vue'),
    'tab-bar': () => import('./components/tab-bar/index.vue'),
    image: () => import('./components/image/index.vue'),
    stepper: () => import('./components/stepper/index.vue'),
    checkbox: () => import('./components/checkbox/index.vue'),
    radio: () => import('./components/radio/index.vue'),
    rate: () => import('./components/rate/index.vue'),
    slider: () => import('./components/slider/index.vue'),
    uploader: () => import('./components/uploader/index.vue'),
    form: () => import('./components/form/index.vue'),
    picker: () => import('./components/picker/index.vue'),
    popup: () => import('./components/popup/index.vue'),
    'time-picker': () => import('./components/time-picker/index.vue'),
    area: () => import('./components/area/index.vue'),
    calendar: () => import('./components/calendar/index.vue'),
  }
  const loader = modules[key]
  return loader ? defineAsyncComponent(loader) : null
})

const goHome = () => {
  router.push('/')
}
</script>
