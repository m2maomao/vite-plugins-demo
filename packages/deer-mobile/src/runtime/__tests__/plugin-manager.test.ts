import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PluginManager } from '../plugin-manager';
import type { RuntimePlugin } from '../types';

// ============================================
// 辅助函数：创建 Mock 插件
// ============================================
function createMockPlugin(name: string, priority = 10, hooks: Partial<RuntimePlugin> = {}): RuntimePlugin {
  return {
    name,
    priority,
    ...hooks,
  } as RuntimePlugin;
}

// ============================================
// Mock 的 AppConfig
// ============================================
const mockConfig = {
  appName: 'test-app',
  request: { baseURL: '/api' },
  routes: [],
  pages: {},
  plugins: [],
  sm4Key: '',
} as any;

describe('PluginManager', () => {
  let manager: PluginManager;

  beforeEach(() => {
    manager = new PluginManager(mockConfig);
  });

  // ==========================================
  // 构造函数
  // ==========================================
  describe('constructor', () => {
    it('应创建实例并初始化空插件列表', () => {
      expect(manager.getPlugins()).toEqual([]);
    });

    it('应创建包含配置的 RuntimeContext', () => {
      const ctx = manager.getContext();
      expect(ctx.config).toBe(mockConfig);
      expect(ctx.data).toBeInstanceOf(Map);
    });
  });

  // ==========================================
  // use() — 注册插件
  // ==========================================
  describe('use()', () => {
    it('应注册单个插件', () => {
      const plugin = createMockPlugin('A');
      manager.use(plugin);
      expect(manager.getPlugins()).toHaveLength(1);
      expect(manager.getPlugins()[0].name).toBe('A');
    });

    it('注册多个插件后应按 priority 升序排列', () => {
      const pluginA = createMockPlugin('A', 30);
      const pluginB = createMockPlugin('B', 10);
      const pluginC = createMockPlugin('C', 20);

      manager.use(pluginA);
      manager.use(pluginB);
      manager.use(pluginC);

      const plugins = manager.getPlugins();
      expect(plugins[0].name).toBe('B');
      expect(plugins[1].name).toBe('C');
      expect(plugins[2].name).toBe('A');
    });

    it('priority 相同时保持注册顺序', () => {
      const pluginA = createMockPlugin('A', 10);
      const pluginB = createMockPlugin('B', 10);
      const pluginC = createMockPlugin('C', 10);

      manager.use(pluginA);
      manager.use(pluginB);
      manager.use(pluginC);

      const plugins = manager.getPlugins();
      expect(plugins[0].name).toBe('A');
      expect(plugins[1].name).toBe('B');
      expect(plugins[2].name).toBe('C');
    });

    it('未指定 priority 时使用默认值 10', () => {
      const pluginA = createMockPlugin('A');
      manager.use(pluginA);
      expect(manager.getPlugins()[0].priority).toBe(10);
    });

    it('应支持链式调用', () => {
      const pluginA = createMockPlugin('A');
      const pluginB = createMockPlugin('B');
      const result = manager.use(pluginA).use(pluginB);
      expect(result).toBe(manager);
      expect(manager.getPlugins()).toHaveLength(2);
    });
  });

  // ==========================================
  // useMany() — 批量注册
  // ==========================================
  describe('useMany()', () => {
    it('应批量注册插件并排序', () => {
      const pluginA = createMockPlugin('A', 20);
      const pluginB = createMockPlugin('B', 10);
      const pluginC = createMockPlugin('C', 15);

      manager.useMany([pluginA, pluginB, pluginC]);

      const plugins = manager.getPlugins();
      expect(plugins).toHaveLength(3);
      expect(plugins[0].name).toBe('B');
      expect(plugins[1].name).toBe('C');
      expect(plugins[2].name).toBe('A');
    });

    it('应支持链式调用', () => {
      const result = manager.useMany([]);
      expect(result).toBe(manager);
    });
  });

  // ==========================================
  // callHook() — 生命周期执行
  // ==========================================
  describe('callHook()', () => {
    it('应按优先级顺序执行指定钩子', async () => {
      const order: string[] = [];
      const pluginA = createMockPlugin('A', 20, {
        onAppCreated: async () => {
          order.push('A');
        },
      });
      const pluginB = createMockPlugin('B', 5, {
        onAppCreated: async () => {
          order.push('B');
        },
      });
      const pluginC = createMockPlugin('C', 10, {
        onAppCreated: async () => {
          order.push('C');
        },
      });

      manager.use(pluginA);
      manager.use(pluginB);
      manager.use(pluginC);

      await manager.callHook('onAppCreated');

      expect(order).toEqual(['B', 'C', 'A']);
    });

    it('插件未定义该钩子时应跳过', async () => {
      const pluginA = createMockPlugin('A', 10);
      const pluginB = createMockPlugin('B', 10, {
        onAppCreated: vi.fn(),
      });

      manager.use(pluginA);
      manager.use(pluginB);

      await manager.callHook('onAppCreated');

      expect(pluginB.onAppCreated).toHaveBeenCalledTimes(1);
    });

    it('插件钩子抛出异常不应影响其他插件继续执行', async () => {
      const order: string[] = [];
      const pluginA = createMockPlugin('A', 10, {
        onAppCreated: async () => {
          order.push('A');
          throw new Error('A failed');
        },
      });
      const pluginB = createMockPlugin('B', 10, {
        onAppCreated: async () => {
          order.push('B');
        },
      });

      manager.use(pluginA);
      manager.use(pluginB);

      // 不应抛出异常
      await expect(manager.callHook('onAppCreated')).resolves.toBeUndefined();
      expect(order).toEqual(['A', 'B']);
    });

    it('应传递参数和 context 给钩子函数', async () => {
      const plugin = createMockPlugin('A', 10, {
        onAppCreated: vi.fn(),
      });

      manager.use(plugin);
      await manager.callHook('onAppCreated', 'arg1', 42);

      expect(plugin.onAppCreated).toHaveBeenCalledWith('arg1', 42, manager.getContext());
    });
  });

  // ==========================================
  // composeRootContainer() — Provider 嵌套
  // ==========================================
  describe('composeRootContainer()', () => {
    it('无插件时直接返回原始 renderApp', () => {
      const renderApp = vi.fn();
      const composed = manager.composeRootContainer(renderApp);
      expect(composed).toBe(renderApp);
    });

    it('应正确嵌套 outerProvider → rootContainer → innerProvider', () => {
      const order: string[] = [];
      const renderApp = () => {
        order.push('app');
        return null as any;
      };

      const outerPlugin = createMockPlugin('Outer', 10, {
        outerProvider: (container: () => any) => {
          order.push('outer');
          return container();
        },
      });
      const rootPlugin = createMockPlugin('Root', 10, {
        rootContainer: (container: () => any) => {
          order.push('root');
          return container();
        },
      });
      const innerPlugin = createMockPlugin('Inner', 10, {
        innerProvider: (container: () => any) => {
          order.push('inner');
          return container();
        },
      });

      manager.use(outerPlugin);
      manager.use(rootPlugin);
      manager.use(innerPlugin);

      const composed = manager.composeRootContainer(renderApp);
      composed();

      // 执行顺序: outerProvider(最外层) → rootContainer → innerProvider(最内层) → renderApp
      expect(order).toEqual(['outer', 'root', 'inner', 'app']);
    });
  });

  // ==========================================
  // setApp / setRouter
  // ==========================================
  describe('setApp / setRouter', () => {
    it('应更新 RuntimeContext 中的 app 实例', () => {
      const mockApp = { use: vi.fn() } as any;
      manager.setApp(mockApp);
      expect(manager.getContext().app).toBe(mockApp);
    });

    it('应更新 RuntimeContext 中的 router 实例', () => {
      const mockRouter = { push: vi.fn() } as any;
      manager.setRouter(mockRouter);
      expect(manager.getContext().router).toBe(mockRouter);
    });
  });

  // ==========================================
  // getPlugins() — 获取插件列表
  // ==========================================
  describe('getPlugins()', () => {
    it('应返回插件列表的副本（不可变）', () => {
      const plugin = createMockPlugin('A');
      manager.use(plugin);

      const plugins = manager.getPlugins();
      plugins.push(createMockPlugin('B') as RuntimePlugin);

      // 原始列表不应受影响
      expect(manager.getPlugins()).toHaveLength(1);
    });
  });
});
