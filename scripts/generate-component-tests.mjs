/**
 * 批量生成 kangaroo-mobile 组件测试文件
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = path.resolve(__dirname, '../packages/kangaroo-mobile/src/components');
const EXISTING_TESTS = new Set(['badge', 'button', 'cell', 'count-down', 'loading', 'tag']);

// 没有 :class 绑定 customClass 的组件
const NO_CUSTOM_CLASS = new Set(['tab-bar-item', 'image-preview', 'picker', 'nav-bar', 'tab-bar', 'stepper', 'switch', 'checkbox-group', 'radio-group']);
// 没有 default slot 的组件
const NO_DEFAULT_SLOT = new Set(['image-preview']);
// 需要手动编写测试的组件（依赖外部资源等）
const MANUAL_ONLY = new Set(['icon']);

const COMPONENT_CONFIGS = [
  { name: 'nav-bar', vanStub: 'VanNavBar', needsIconStub: true, props: { title: '标题' }, events: ['click-left'] },
  { name: 'tab-bar', vanStub: 'VanTabbar', props: { modelValue: 0 } },
  { name: 'tab-bar-item', vanStub: 'VanTabbarItem', props: { name: 'home' } },
  { name: 'tabs', vanStub: 'VanTabs', props: { active: 0 } },
  { name: 'tab', vanStub: 'VanTab', hasDefaultSlot: true, props: { title: '标签' } },
  { name: 'steps', vanStub: 'VanSteps', props: { active: 1 } },
  { name: 'step', vanStub: 'VanStep', hasDefaultSlot: true },
  { name: 'back-top', vanStub: 'VanBackTop', hasDefaultSlot: true },
  { name: 'card', vanStub: 'VanCard', props: { title: '标题' }, namedSlots: ['thumb', 'title', 'price', 'num', 'bottom'] },
  { name: 'collapse', vanStub: 'VanCollapse', hasDefaultSlot: true },
  { name: 'collapse-item', vanStub: 'VanCollapseItem', hasDefaultSlot: true, props: { title: '标题' } },
  { name: 'divider', vanStub: 'VanDivider', hasDefaultSlot: true },
  { name: 'image', vanStub: 'VanImage', props: { src: 'https://example.com/img.png' } },
  { name: 'empty', vanStub: 'VanEmpty', hasDefaultSlot: true, props: { description: '暂无数据' } },
  { name: 'skeleton', vanStub: 'VanSkeleton', hasDefaultSlot: true },
  { name: 'skeleton-image', vanStub: 'VanSkeletonImage' },
  { name: 'skeleton-paragraph', vanStub: 'VanSkeletonParagraph' },
  { name: 'toast', vanStub: 'VanToast', props: { show: true } },
  { name: 'dialog', vanStub: 'VanDialog', hasDefaultSlot: true, props: { show: true, title: '提示' } },
  { name: 'popup', vanStub: 'VanPopup', hasDefaultSlot: true, props: { show: true } },
  { name: 'action-sheet', vanStub: 'VanActionSheet', hasDefaultSlot: true, props: { show: true } },
  { name: 'image-preview', vanStub: 'VanImagePreview', hasDefaultSlot: false },
  { name: 'form', vanStub: 'VanForm', hasDefaultSlot: true },
  { name: 'field', vanStub: 'VanField', needsIconStub: true, props: { label: '字段', placeholder: '请输入' } },
  { name: 'picker', vanStub: 'VanPicker', props: { title: '请选择' }, namedSlots: ['title', 'toolbar', 'columns-top', 'columns-bottom'] },
  { name: 'time-picker', vanStub: 'VanTimePicker' },
  { name: 'area', vanStub: 'VanArea' },
  { name: 'calendar', vanStub: 'VanCalendar', props: { show: true } },
  { name: 'search', vanStub: 'VanSearch', props: { placeholder: '搜索' } },
  { name: 'switch', vanStub: 'VanSwitch', props: { modelValue: true } },
  { name: 'stepper', vanStub: 'VanStepper', props: { modelValue: 1 } },
  { name: 'checkbox', vanStub: 'VanCheckbox', hasDefaultSlot: true },
  { name: 'checkbox-group', vanStub: 'VanCheckboxGroup', hasDefaultSlot: true },
  { name: 'radio', vanStub: 'VanRadio', hasDefaultSlot: true },
  { name: 'radio-group', vanStub: 'VanRadioGroup', hasDefaultSlot: true },
  { name: 'rate', vanStub: 'VanRate', props: { modelValue: 3 } },
  { name: 'slider', vanStub: 'VanSlider', props: { modelValue: 50 } },
  { name: 'uploader', vanStub: 'VanUploader', hasDefaultSlot: true },
  { name: 'cell-group', vanStub: 'VanCellGroup', hasDefaultSlot: true },
  { name: 'pull-refresh', vanStub: 'VanPullRefresh', hasDefaultSlot: true, props: { loading: false } },
  { name: 'list', vanStub: 'VanList', hasDefaultSlot: true, props: { loading: false } },
  { name: 'index-bar', vanStub: 'VanIndexBar', hasDefaultSlot: true },
  { name: 'index-anchor', vanStub: 'VanIndexAnchor', hasDefaultSlot: true, props: { index: 'A' } },
  { name: 'sidebar', vanStub: 'VanSidebar', hasDefaultSlot: true, props: { modelValue: 0 } },
  { name: 'number-keyboard', vanStub: 'VanNumberKeyboard', props: { show: true } },
  { name: 'password-input', vanStub: 'VanPasswordInput', props: { value: '123' } },
  { name: 'watermark', vanStub: 'VanWatermark', props: { content: '水印' } },
  { name: 'floating-panel', vanStub: 'VanFloatingPanel', hasDefaultSlot: true, props: { height: 100 } },
];

function generateTestFile(config) {
  const { name, vanStub, props = {}, hasDefaultSlot, namedSlots = [], events = [], needsIconStub } = config;
  // tab-bar-item → TabbarItem（注意文件名大小写：TabbarItem.vue）
  const componentName = name === 'tab-bar-item' ? 'TabbarItem' : name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  const hasCustomClass = !NO_CUSTOM_CLASS.has(name);
  const canTestDefaultSlot = hasDefaultSlot && !NO_DEFAULT_SLOT.has(name);
  const componentDisplayName = name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');

  const lines = [];
  lines.push('// @vitest-environment happy-dom');
  lines.push("import { describe, it, expect } from 'vitest';");
  lines.push("import { mount } from '@vue/test-utils';");
  lines.push(`import ${componentDisplayName} from '../${componentDisplayName}.vue';`);
  lines.push("import { vanStubs } from '../../__tests__/shared-stubs';");
  lines.push('');

  const stubEntries = [`Van${vanStub.replace('Van', '')}: vanStubs.${vanStub}`];
  if (needsIconStub) {
    stubEntries.push("YhmIcon: { template: '<i class=\\'yhm-icon\\' />' }");
  }

  lines.push(`describe('${componentDisplayName}', () => {`);
  lines.push(`  const global = { stubs: { ${stubEntries.join(', ')} } };`);
  lines.push('');

  // customClass test
  if (hasCustomClass) {
    lines.push(`  it('customClass 应应用', () => {`);
    lines.push(`    const wrapper = mount(${componentDisplayName}, { global, props: { customClass: 'my-class' } });`);
    lines.push("    expect(wrapper.html()).toContain('my-class');");
    lines.push('  });');
    lines.push('');
  }

  // Prop forwarding tests
  const propEntries = Object.entries(props);
  if (propEntries.length > 0) {
    for (const [propName, testValue] of propEntries) {
      const displayValue = typeof testValue === 'string' ? `'${testValue}'` : String(testValue);
      lines.push(`  it('${propName} 属性应传递', () => {`);
      lines.push(`    const wrapper = mount(${componentDisplayName}, { global, props: { ${propName}: ${displayValue} } });`);
      lines.push(`    const van = wrapper.findComponent({ name: '${vanStub}' });`);
      lines.push(`    expect(van.props('${propName}')).toBe(${displayValue});`);
      lines.push('  });');
      lines.push('');
    }
  }

  // Default slot test
  if (canTestDefaultSlot) {
    lines.push(`  it('应渲染默认插槽内容', () => {`);
    lines.push(`    const wrapper = mount(${componentDisplayName}, { global, slots: { default: '插槽内容' } });`);
    lines.push("    expect(wrapper.text()).toContain('插槽内容');");
    lines.push('  });');
    lines.push('');
  }

  // Named slot tests
  for (const slotName of namedSlots) {
    lines.push(`  it('应渲染 ${slotName} 插槽内容', () => {`);
    lines.push(`    const wrapper = mount(${componentDisplayName}, { global, slots: { ${slotName}: '<span class="slot-${slotName}">内容</span>' } });`);
    lines.push(`    expect(wrapper.find('.slot-${slotName}').exists()).toBe(true);`);
    lines.push('  });');
    lines.push('');
  }

  // Event forwarding tests
  for (const eventName of events) {
    lines.push(`  it('应传递 ${eventName} 事件', async () => {`);
    lines.push(`    const wrapper = mount(${componentDisplayName}, { global });`);
    lines.push(`    const van = wrapper.findComponent({ name: '${vanStub}' });`);
    lines.push(`    van.vm.\$emit('${eventName}');`);
    lines.push(`    expect(wrapper.emitted('${eventName}')).toBeTruthy();`);
    lines.push('  });');
    lines.push('');
  }

  lines.push('});');
  lines.push('');

  return lines.join('\n');
}

// ============================================
// 主流程
// ============================================

let created = 0;
let skipped = 0;

for (const config of COMPONENT_CONFIGS) {
  if (EXISTING_TESTS.has(config.name) || MANUAL_ONLY.has(config.name)) {
    console.log(`⏭  SKIP ${config.name} (手动)`);
    skipped++;
    continue;
  }

  const testDir = path.join(COMPONENTS_DIR, config.name, '__tests__');
  const componentName = config.name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  const testFile = path.join(testDir, `${componentName}.test.ts`);

  // NavBar was manually created, skip it
  if (config.name === 'nav-bar' && fs.existsSync(testFile)) {
    console.log(`⏭  SKIP ${testFile} (手动)`);
    skipped++;
    continue;
  }

  fs.mkdirSync(testDir, { recursive: true });
  const content = generateTestFile(config);
  fs.writeFileSync(testFile, content, 'utf-8');
  console.log(`✅  CREATED ${testFile}`);
  created++;
}

console.log(`\n📊 总计: 创建 ${created} 个, 跳过 ${skipped} 个`);
