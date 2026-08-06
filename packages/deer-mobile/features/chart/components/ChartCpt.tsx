/**
 * Deer Mobile — ChartCpt 组件
 * 基于 echarts 核心预设的通用图表组件，type 分发 line/bar/pie/radar/gauge/scatter。
 *
 * @example
 * ```tsx
 * <ChartCpt
 *   type="line"
 *   data={{ categories: ['1月','2月','3月'], series: [{ name: '血压', data: [120,118,122], areaStyle: true }] }}
 * />
 * ```
 */
import { defineComponent, computed, ref } from 'vue';
import type { EChartsCoreOption } from 'echarts/core';
import { useChart } from '../composables';
import type { ChartData, ChartType } from '../types';

function buildOption(type: ChartType, data: ChartData, themeColor: string, title?: string): EChartsCoreOption {
  const categories = data.categories ?? [];

  const series = data.series.map((s) => {
    const base = { name: s.name, itemStyle: s.color ? { color: s.color } : undefined };
    switch (type) {
      case 'line':
        return {
          ...base,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { width: 2, color: s.color ?? themeColor },
          itemStyle: { color: s.color ?? themeColor },
          areaStyle: s.areaStyle
            ? {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: `${themeColor}55` },
                    { offset: 1, color: `${themeColor}05` },
                  ],
                },
              }
            : undefined,
          data: s.data as number[],
        };
      case 'bar':
        return {
          ...base,
          type: 'bar',
          barMaxWidth: 24,
          itemStyle: { color: s.color ?? themeColor, borderRadius: [4, 4, 0, 0] },
          data: s.data as number[],
        };
      case 'pie':
        return {
          ...base,
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['50%', '50%'],
          label: { show: true, formatter: '{b}: {c}' },
          emphasis: { label: { show: true, fontWeight: 'bold' } },
          data: s.data as Array<{ name: string; value: number }>,
        };
      case 'radar':
        return {
          ...base,
          type: 'radar',
          symbolSize: 5,
          areaStyle: s.areaStyle ? { opacity: 0.2 } : undefined,
          data: [{ value: s.data as number[], name: s.name }],
        };
      case 'gauge':
        return {
          ...base,
          type: 'gauge',
          min: 0,
          max: 100,
          progress: { show: true, width: 12, itemStyle: { color: s.color ?? themeColor } },
          axisLine: { lineStyle: { width: 12 } },
          detail: { fontSize: 20, fontWeight: 'bold' },
          data: [{ value: s.data as number, name: s.name }],
        };
      case 'scatter':
        return {
          ...base,
          type: 'scatter',
          symbolSize: 10,
          itemStyle: { color: s.color ?? themeColor },
          data: (s.data as number[]).map((v, i) => [categories[i] ?? i, v]),
        };
      default:
        return { ...base, type: 'line', data: s.data as number[] };
    }
  });

  const option: EChartsCoreOption = {
    title: title ? { text: title, left: 'center', textStyle: { fontSize: 14 } } : undefined,
    tooltip: { trigger: type === 'pie' ? 'item' : 'axis' },
    legend: data.series.length > 1 ? { bottom: 0, type: 'scroll' } : undefined,
    color: [themeColor, '#15a3ff', '#00c48c', '#ff9f43', '#f32929', '#7e2fc3'],
  };

  if (type === 'line' || type === 'bar' || type === 'scatter') {
    Object.assign(option, {
      grid: { left: 8, right: 16, top: 30, bottom: 30, containLabel: true },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: { lineStyle: { color: '#e5e5e5' } },
        axisLabel: { color: '#999' },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: '#e5e5e5' } },
        axisLabel: { color: '#999' },
      },
    });
  } else if (type === 'radar') {
    Object.assign(option, {
      radar: {
        indicator: categories.map((c) => ({ name: c })),
        splitArea: { areaStyle: { color: ['#f7faff', '#fff'] } },
      },
    });
  }

  return option;
}

export default defineComponent({
  name: 'DeerChartCpt',
  props: {
    /** 图表类型 */
    type: { type: String as () => ChartType, required: true },
    /** 图表数据 */
    data: { type: Object as () => ChartData, required: true },
    /** 标题（可选） */
    title: { type: String, default: '' },
    /** 高度（默认 260px） */
    height: { type: [String, Number] as unknown as () => string | number, default: 260 },
    /** 宽度（默认 100%） */
    width: { type: [String, Number] as unknown as () => string | number, default: '100%' },
    /** 主题色（默认 #096aff） */
    themeColor: { type: String, default: '#096aff' },
  },
  setup(props) {
    const container = ref<HTMLDivElement | null>(null);
    const option = computed<EChartsCoreOption>(() =>
      buildOption(props.type, props.data, props.themeColor, props.title || undefined),
    );

    useChart(container, option);

    const style = computed(() => ({
      width: typeof props.width === 'number' ? `${props.width}px` : props.width,
      height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    }));

    return () => <div ref={container} class="deer-chart-cpt" style={style.value} />;
  },
});
