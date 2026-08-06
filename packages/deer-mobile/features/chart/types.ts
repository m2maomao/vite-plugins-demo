/**
 * Deer Mobile — Chart Feature Types
 * 图表类型定义（echarts 封装）
 */

/** 支持的图表类型（对齐大厂移动端高频场景） */
export type ChartType = 'line' | 'bar' | 'pie' | 'radar' | 'gauge' | 'scatter';

/** 图表数据：分类 + 系列 */
export interface ChartData {
  /** X 轴 / 类目（line/bar/scatter 用） */
  categories?: string[];
  /** 系列数据 */
  series: ChartSeries[];
}

/** 单个系列 */
export interface ChartSeries {
  /** 系列名（图例展示） */
  name?: string;
  /** 数据值（line/bar 为 number[]；pie 为 {name, value}[]；radar 为 number[]；gauge 为 number） */
  data: number[] | Array<{ name: string; value: number }> | number;
  /** 面积图（line 系列时生效） */
  areaStyle?: boolean;
  /** 颜色（可选，覆盖主题） */
  color?: string;
}

/** ChartCpt 组件 props */
export interface ChartCptProps {
  /** 图表类型 */
  type: ChartType;
  /** 图表数据 */
  data: ChartData;
  /** 标题（可选） */
  title?: string;
  /** 高度（默认 260px） */
  height?: string | number;
  /** 宽度（默认 100%） */
  width?: string | number;
  /** 主题色（默认 #096aff） */
  themeColor?: string;
  /** 是否自适应容器尺寸变化（默认 true） */
  responsive?: boolean;
}
