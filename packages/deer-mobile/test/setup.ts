/**
 * Vitest 全局 Setup 文件
 * 在所有测试运行前执行
 */

// 确保 localStorage 可用（happy-dom 已原生支持，这里仅做兼容检查）
if (typeof localStorage === 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: (() => {
      const store = new Map<string, string>();
      return {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => store.set(key, value),
        removeItem: (key: string) => store.delete(key),
        clear: () => store.clear(),
        get length() {
          return store.size;
        },
        key: (index: number) => [...store.keys()][index] ?? null,
      };
    })(),
    writable: true,
  });
}
