// 插件共享状态
import type { FrameworkPlugin } from './config-plugin';

let plugins: FrameworkPlugin[] = [];

export function setFrameworkPlugins(p: FrameworkPlugin[]) {
  plugins = p;
}

export function getFrameworkPlugins(): FrameworkPlugin[] {
  return plugins;
}
