/**
 * 枚举工具 — 对齐 @rm/plugin-enum 的 enumerateCreator 基本用法
 * 返回 { KEY: { label, value, ...扩展字段 } }
 */

export interface EnumItem<V = any> {
  label: string;
  value: V;
  [key: string]: any;
}

export type EnumObject<T extends Record<string, EnumItem>> = T;

/** 创建枚举对象（纯 TS 实现，无外部依赖） */
export function enumerateCreator<T extends Record<string, EnumItem>>(data: T): T {
  return data;
}

/** 根据 value 查找枚举项 */
export function findEnumItem<T extends Record<string, EnumItem>>(enumObj: T, value: unknown): EnumItem | undefined {
  return Object.values(enumObj).find((item) => item.value === value);
}

/** 根据 value 获取 label */
export function getEnumLabel<T extends Record<string, EnumItem>>(enumObj: T, value: unknown): string {
  return findEnumItem(enumObj, value)?.label ?? '';
}
