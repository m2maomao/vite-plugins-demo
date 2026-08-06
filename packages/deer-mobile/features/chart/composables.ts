/**
 * Deer Mobile — Chart Feature Composables
 * useChart：在指定 DOM 上初始化/更新/销毁 echarts 实例
 */
import { onBeforeUnmount, onMounted, shallowRef, watch, type Ref } from 'vue';
import type { EChartsType } from 'echarts/core';
import type { EChartsCoreOption } from 'echarts/core';
import { echarts } from './echarts';

/**
 * 在指定 DOM 容器上管理一个 echarts 实例
 * @param domRef 容器 DOM ref
 * @param optionRef 图表 option（响应式，变化自动更新）
 * @param autoResize 是否监听容器尺寸变化自动 resize（默认 true）
 *
 * @example
 * ```ts
 * const container = ref<HTMLDivElement>();
 * const option = ref<EChartsCoreOption>({ xAxis: {}, yAxis: {}, series: [] });
 * const chart = useChart(container, option);
 * ```
 */
export function useChart(domRef: Ref<HTMLElement | null>, optionRef: Ref<EChartsCoreOption>, autoResize = true) {
  const instance = shallowRef<EChartsType | null>(null);

  let resizeObserver: ResizeObserver | null = null;

  function init() {
    if (!domRef.value || instance.value) return;
    const chart = echarts.init(domRef.value);
    instance.value = chart;
    chart.setOption(optionRef.value);

    if (autoResize && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => chart.resize());
      resizeObserver.observe(domRef.value);
    }
  }

  function update() {
    if (instance.value) {
      instance.value.setOption(optionRef.value, { notMerge: true });
    }
  }

  function resize() {
    instance.value?.resize();
  }

  function dispose() {
    resizeObserver?.disconnect();
    resizeObserver = null;
    instance.value?.dispose();
    instance.value = null;
  }

  onMounted(init);
  watch(optionRef, update, { deep: true });
  watch(domRef, (val) => {
    if (val && !instance.value) init();
    if (!val) dispose();
  });
  onBeforeUnmount(dispose);

  return { instance, init, update, resize, dispose };
}
