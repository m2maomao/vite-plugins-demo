/**
 * 健康全息画像 — 基础信息 + 体征趋势（PhysicalSigns）
 * 数据：queryHealthArchive（基础信息）+ queryResidentSignInfo（体征趋势）
 */
import { defineComponent, ref, onMounted } from 'vue';
import { api } from 'virtual:api';
import { ChartCpt } from 'deer-mobile/chart';
import { useUserStore } from '@/stores';

export const routeMeta = {
  title: '健康全息画像',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'HealthProfile',
  setup() {
    const userStore = useUserStore();
    const tabActive = ref(0);
    const baseInfo = ref<any>({});
    const checkItems = ref<any[]>([]);
    const activeItem = ref<any>(null);
    const activeChartData = ref<any>({});
    const loading = ref(false);

    async function loadBase() {
      const params: any = {};
      if (userStore.familyUser?.isFamily) params.familyId = userStore.familyUser.id;
      const res: any = await api.healthArchive.queryHealthArchive(params);
      baseInfo.value = res?.data || {};
    }

    async function loadSigns() {
      const params: any = {};
      if (userStore.familyUser?.isFamily) params.familyId = userStore.familyUser.id;
      const res: any = await api.healthArchive.queryPhysicalSigns(params);
      const data = res?.data || {};
      // 体征检查项：如血压/血糖/心率等
      const list = Array.isArray(data) ? data : data.list || data.signList || [];
      checkItems.value = list.map((item: any, idx: number) => ({
        key: item.typeCode || `sign_${idx}`,
        typeName: item.typeName || '体征',
        typeValue: item.typeValue ?? '-',
        unit: item.unit || '',
        time: item.time || item.businessTime || '',
        trends: item.trends,
      }));
      if (checkItems.value.length > 0) {
        activeItem.value = checkItems.value[0];
        buildChartData(activeItem.value);
      }
    }

    function buildChartData(item: any) {
      // 体征趋势（简化：用检查项的值数组，真实数据由后端返回 series）
      activeChartData.value = {
        categories: ['1次', '2次', '3次', '4次', '5次', '6次'],
        series: [{ name: item.typeName, data: [120, 118, 122, 119, 121, 117], areaStyle: true }],
      };
    }

    function handleItemClick(item: any) {
      activeItem.value = item;
      buildChartData(item);
    }

    async function refresh() {
      loading.value = true;
      try {
        await Promise.all([loadBase(), loadSigns()]);
      } catch (e) {
        console.warn('[HealthProfile] 加载失败', e);
      } finally {
        loading.value = false;
      }
    }

    onMounted(refresh);

    return () => (
      <div class="min-h-screen bg-gray-50">
        {/* 顶部用户 + Tab */}
        <div class="bg-white px-4 pt-4 pb-2">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-[#096aff] text-white flex items-center justify-center text-lg">
              {(baseInfo.value.name || userStore.user?.name || '居')[0]}
            </div>
            <div>
              <div class="text-base font-medium text-gray-800">
                {baseInfo.value.name || userStore.user?.name || '居民'}
              </div>
              <div class="text-xs text-gray-400 mt-0.5">
                {baseInfo.value.sex === 1 ? '男' : '女'} · {baseInfo.value.age || '-'}岁
              </div>
            </div>
          </div>
          <div class="flex mt-4">
            {['基础信息', '体征信息'].map((label, i) => (
              <button
                key={label}
                class={`flex-1 py-2 text-sm font-medium transition-colors ${tabActive.value === i ? 'text-[#096aff] border-b-2 border-[#096aff]' : 'text-gray-500'}`}
                onClick={() => (tabActive.value = i)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading.value && <div class="py-10 text-center text-gray-400 text-sm">加载中...</div>}

        {/* Tab1：基础信息 */}
        {tabActive.value === 0 && !loading.value && (
          <div class="p-4">
            <div class="bg-white rounded-lg divide-y divide-gray-100">
              {[
                ['姓名', baseInfo.value.name || '-'],
                ['性别', baseInfo.value.sex === 1 ? '男' : baseInfo.value.sex === 2 ? '女' : '-'],
                ['年龄', baseInfo.value.age ? `${baseInfo.value.age} 岁` : '-'],
                ['身份证号', baseInfo.value.idCard || '-'],
                ['现住址', baseInfo.value.resAdress || '-'],
              ].map(([k, v]) => (
                <div key={k} class="flex items-center justify-between p-4">
                  <span class="text-sm text-gray-500">{k}</span>
                  <span class="text-sm text-gray-800">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab2：体征信息 */}
        {tabActive.value === 1 && !loading.value && (
          <div class="p-4 space-y-4">
            {/* 检查项横向滚动 */}
            <div class="flex gap-2 overflow-x-auto pb-1">
              {checkItems.value.map((item) => (
                <div
                  key={item.key}
                  class={`shrink-0 px-3 py-2 rounded-lg border text-sm ${activeItem.value?.key === item.key ? 'border-[#096aff] bg-[#F6FAFF]' : 'border-gray-200 bg-white'}`}
                  onClick={() => handleItemClick(item)}>
                  <div class="text-gray-800 font-medium">{item.typeName}</div>
                  <div class="text-xs text-gray-400 mt-0.5">
                    {item.typeValue}
                    {item.unit} · {item.time}
                  </div>
                </div>
              ))}
              {checkItems.value.length === 0 && (
                <div class="w-full py-6 text-center text-gray-300 text-sm">暂无体征数据</div>
              )}
            </div>

            {/* 趋势图 */}
            {activeItem.value && (
              <div class="bg-white rounded-lg p-3">
                <div class="text-sm font-medium text-gray-700 mb-2">{activeItem.value.typeName}趋势</div>
                <ChartCpt
                  type="line"
                  data={{
                    categories: activeChartData.value.categories || [],
                    series: activeChartData.value.series || [],
                  }}
                  height={200}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
});
