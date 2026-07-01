// 虚拟模块的ID（使用者 import 时用的路径）
const VIRTUAL_MODULE_ID = 'virtual:greeting';
// Vite 内部解析后的ID （加 \0 前缀标识这是一个虚拟模块）
const RESOLVED_ID = '\0' + VIRTUAL_MODULE_ID;
export default function greetingPlugin() {
    return {
        name: 'greeting-plugin',
        // 当遇到 import 'virtual:greeting' 时，告诉 Vite 这是由我们处理的
        resolveId(id) {
            if (id === VIRTUAL_MODULE_ID) {
                return RESOLVED_ID;
            }
            return null;
        },
        // Vite 根据 resolveId 返回的 ID 来请求模块内容
        load(id) {
            if (id === RESOLVED_ID) {
                return `
          export const greeting = '你好！这是虚拟模块'
          export const version = '1.0.0'
          export function getTime() {
            return new Date().toLocaleString()
          }
        `;
            }
            return null;
        }
    };
}
