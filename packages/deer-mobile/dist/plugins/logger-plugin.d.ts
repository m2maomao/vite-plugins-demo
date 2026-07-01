import type { Plugin } from 'vite';
interface LoggerPluginOptions {
    prefix?: string;
    showFileList?: boolean;
}
export default function loggerPlugin(options?: LoggerPluginOptions): Plugin;
export {};
