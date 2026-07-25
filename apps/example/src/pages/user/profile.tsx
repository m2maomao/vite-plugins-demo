import { defineComponent, ref, onMounted } from 'vue';
import { useApi } from '@/composables/useApi';
import { useTheme } from 'kangaroo-mobile';

export const routeMeta = {
  title: '用户资料',
  layout: ['default', 'user'],
  auth: true,
  transition: 'slide-left',
};

const PRESET_COLORS = [
  { name: '默认蓝', color: '#1677ff' },
  { name: '极客绿', color: '#00b578' },
  { name: '热情红', color: '#ff3141' },
  { name: '暗夜紫', color: '#722ed1' },
  { name: '日落橙', color: '#fa8c16' },
];

export default defineComponent({
  setup() {
    const { user } = useApi();
    const profile = ref<{ id: number; name: string; email: string } | null>(null);
    const { theme, setPrimaryColor, toggleDarkMode } = useTheme();
    const currentColor = ref(theme.primaryColor);

    onMounted(async () => {
      profile.value = (await user.getProfile(1)).data;
    });

    const handleColorChange = (color: string) => {
      currentColor.value = color;
      setPrimaryColor(color);
    };

    return () => (
      <div>
        {/* 主题切换面板 */}
        <div
          style={{
            background: 'var(--yh-bg-color-white)',
            borderRadius: 'var(--yh-radius-lg)',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: 'var(--yh-shadow-sm)',
          }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>🎨 主题切换</h3>

          {/* 主色选择 */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', color: 'var(--yh-text-color-secondary)', marginBottom: '8px' }}>
              当前主色：<span style={{ color: currentColor.value, fontWeight: 600 }}>{currentColor.value}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.color}
                  onClick={() => handleColorChange(preset.color)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: preset.color,
                    border:
                      currentColor.value === preset.color ? '3px solid var(--yh-text-color)' : '3px solid transparent',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          {/* 暗黑模式切换 */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '14px',
            }}>
            <span>🌙 暗黑模式</span>
            <input
              type="checkbox"
              checked={theme.darkMode}
              onChange={() => toggleDarkMode()}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </label>
        </div>

        {/* 用户资料卡片 */}
        <div
          style={{
            background: 'var(--yh-bg-color-white)',
            borderRadius: 'var(--yh-radius-lg)',
            padding: '16px',
            boxShadow: 'var(--yh-shadow-sm)',
          }}>
          <h3 class="text-2xl font-bold" style={{ color: 'var(--yh-primary-color)', marginBottom: '12px' }}>
            用户资料
          </h3>
          {profile.value ? (
            <div style={{ lineHeight: '2', fontSize: '14px' }}>
              <p>ID：{profile.value.id}</p>
              <p>姓名：{profile.value.name}</p>
              <p>邮箱：{profile.value.email}</p>
            </div>
          ) : (
            <p>加载中...</p>
          )}
        </div>
      </div>
    );
  },
});
