/**
 * Kangaroo Mobile — 全组件视觉回归测试
 *
 * 使用 Playwright 对每个组件 Demo 进行截图。
 * 首次运行生成 baseline，后续运行对比差异。
 *
 * 运行方式：
 *   cd packages/kangaroo-mobile
 *   npx playwright test
 *
 * 更新 baseline：
 *   npx playwright test --update-snapshots
 */
import { test, expect } from '@playwright/test';

const COMPONENTS = [
  'badge',
  'button',
  'calendar',
  'card',
  'cell',
  'checkbox',
  'count-down',
  'dialog',
  'divider',
  'empty',
  'field',
  'floating-panel',
  'form',
  'icon',
  'image-preview',
  'loading',
  'nav-bar',
  'number-keyboard',
  'password-input',
  'picker',
  'popup',
  'radio',
  'rate',
  'search',
  'sidebar',
  'skeleton',
  'steps',
  'switch',
  'tab',
  'tab-bar',
  'tabs',
  'tag',
  'time-picker',
  'uploader',
];

test.describe('组件视觉回归', () => {
  for (const name of COMPONENTS) {
    test(`${name} 组件截图`, async ({ page }) => {
      await page.goto(`/playground/#/${name}`);
      await page.waitForLoadState('networkidle');
      // 等待组件渲染稳定
      await page.waitForTimeout(1000);
      await expect(page).toHaveScreenshot(`${name}.png`, {
        maxDiffPixels: 100,
      });
    });
  }
});
