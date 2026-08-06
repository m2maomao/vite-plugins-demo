/**
 * Deer Mobile — Chart Feature 统一出口
 * 通过子路径 `deer-mobile/chart` 或主入口 `deer-mobile` 导入
 */
export { default as ChartCpt } from './components/ChartCpt';
export { useChart } from './composables';
export { echarts } from './echarts';

export type { ChartType, ChartData, ChartSeries, ChartCptProps } from './types';
