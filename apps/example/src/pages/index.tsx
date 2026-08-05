import { defineComponent, ref } from 'vue';

export const routeMeta = {
  title: '首页',
  layout: 'default',
  auth: true,
  transition: 'fade',
};

interface DeerVConsoleAPI {
  show(): void;
  hide(): void;
  destroy(): void;
}

export default defineComponent({
  setup() {
    const log = ref<string[]>([]);

    function vc(): DeerVConsoleAPI | undefined {
      return (window as any).__DEER_VCONSOLE__;
    }

    function appendLog(msg: string) {
      log.value = [...log.value.slice(-4), msg];
    }

    function openVConsole() {
      const api = vc();
      if (api) {
        api.show();
        appendLog('已调用 vConsole.show()');
      } else {
        // 未启用（如生产且未加 URL 参数）：动态加载后初始化
        appendLog('vConsole 未启用：生产环境请访问 ?vconsole=1');
        window.location.search = '?vconsole=1';
      }
    }

    function closeVConsole() {
      vc()?.hide();
      appendLog('已调用 vConsole.hide()');
    }

    return () => (
      <div style={{ padding: '24px', fontSize: '14px' }}>
        <h2 style={{ marginBottom: '12px' }}>vConsole 调试面板演示</h2>
        <p style={{ marginBottom: '8px', color: '#888' }}>
          启用策略：dev 自动启用；生产环境访问 <code>?vconsole=1</code> 按需打开；测试包可在 vite.config.ts 中设{' '}
          <code>vconsole.enabled: 'always'</code>。
        </p>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <button onClick={openVConsole} style={btnStyle('#1890ff')}>
            打开 vConsole
          </button>
          <button onClick={closeVConsole} style={btnStyle('#ff4d4f')}>
            关闭 vConsole
          </button>
        </div>
        <div style={{ color: '#555' }}>
          {log.value.map((l, i) => (
            <div key={i}>- {l}</div>
          ))}
        </div>
      </div>
    );
  },
});

function btnStyle(color: string): Record<string, string> {
  return {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    color: '#fff',
    background: color,
    cursor: 'pointer',
  };
}
