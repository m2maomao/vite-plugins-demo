import type { Plugin } from 'vite';
interface RouteConfig {
    path: string;
    file?: string;
    redirect?: string;
}
export default function scanPagesPlugin(options?: {
    pluginRoutes?: RouteConfig[];
}): Plugin;
export {};
