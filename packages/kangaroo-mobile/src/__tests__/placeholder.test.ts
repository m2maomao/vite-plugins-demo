// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';

/**
 * 占位测试文件
 * 确保 kangaroo-mobile 在 CI 中不会因无测试文件而失败
 * 待后续补充 Vue 组件测试用例
 */
describe('kangaroo-mobile placeholder', () => {
  it('应确保测试框架可正常运行', () => {
    expect(1 + 1).toBe(2);
  });
});
