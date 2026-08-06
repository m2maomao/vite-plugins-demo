/**
 * Deer Mobile — Chart Feature ECharts 集中按需注册
 *
 * 一次性引入「核心图表预设集」，覆盖移动端高频图表场景：
 * - 图表：line / bar / pie / radar / gauge / scatter
 * - 组件：title / tooltip / grid / legend / dataset / dataZoom / markLine / markPoint / toolbox
 * - 特性：labelLayout / universalTransition；渲染器：Canvas
 *
 * 体量约 200-300KB（gzip ~80KB），远小于全量 echarts（1MB+）。
 * 未来新增图表类型（如 funnel），只需在此 use([...]) 追加一行，业务层无感。
 */
import * as echarts from 'echarts/core';
import { LineChart, BarChart, PieChart, RadarChart, GaugeChart, ScatterChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkPointComponent,
  ToolboxComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  // 图表
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
  GaugeChart,
  ScatterChart,
  // 组件
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkPointComponent,
  ToolboxComponent,
  // 特性
  LabelLayout,
  UniversalTransition,
  // 渲染器
  CanvasRenderer,
]);

export { echarts };
