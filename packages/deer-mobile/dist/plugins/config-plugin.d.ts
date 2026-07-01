import type { Plugin } from 'vite';
interface AppConfig {
    title: string;
    description: string;
    author: string;
    base: string;
    theme: {
        primaryColor: string;
        darkMode: boolean;
    };
    layout: 'side' | 'top' | 'mix';
    noNavPages: string[];
}
type ConfigPluginOptions = Partial<AppConfig>;
export default function configPlugin(options?: ConfigPluginOptions, frameworkPlugins?: FrameworkPlugin[]): Plugin;
export interface FrameworkPlugin {
    name: string;
    onImport?: () => string;
    onRuntime?: () => string;
}
export {};
