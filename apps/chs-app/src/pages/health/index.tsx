/**
 * 健康画像（入口）— 健康画像 + 健康档案双 Tab
 * 数据来源 queryHealthArchive：既往史/过敏史/家族史/异常数据/异常事件/人群性质
 */
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'virtual:api';
import { ChartCpt } from 'deer-mobile/chart';
import { useUserStore } from '@/stores';

interface PortraitItem {
  key: string;
  label: string;
  number: number;
  items: Array<{ text: string; subText?: string }>;
}

export const routeMeta = {
  title: '健康画像',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'HealthIndex',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const tabActive = ref(0);
    const portraitItems = ref<PortraitItem[]>([]);
    const trendCategories = ref<string[]>(['近6次']);
    const trendSeries = ref<any[]>([]);
    const loading = ref(false);

    async function load() {
      loading.value = true;
      try {
        const params: any = {};
        if (userStore.familyUser?.isFamily) {
          params.familyId = userStore.familyUser.id;
        }
        const res: any = await api.healthArchive.queryHealthArchive(params);
        const data = res?.data || {};
        portraitItems.value = [
          {
            key: 'jws',
            label: '既往史',
            number: (data.diseaseNames || []).length,
            items: (data.diseaseNames || []).map((n: string) => ({ text: n })),
          },
          {
            key: 'gms',
            label: '过敏史',
            number: (data.drugAllergyHistorys || []).length,
            items: (data.drugAllergyHistorys || []).map((n: string) => ({ text: n })),
          },
          {
            key: 'jzs',
            label: '家族史',
            number: (data.familyHistorys || []).length,
            items: (data.familyHistorys || []).map((n: string) => ({ text: n })),
          },
          {
            key: 'yc',
            label: '异常数据',
            number: (data.riskFactors || []).length,
            items: (data.riskFactors || []).map((i: any) => ({ text: i.riskFactorName, subText: i.riskType })),
          },
          {
            key: 'sj',
            label: '异常事件',
            number: (data.visitInfoDtos || []).length,
            items: (data.visitInfoDtos || []).map((i: any) => ({ text: i.CJBZDMC, subText: i.CJZRQ })),
          },
          {
            key: 'rqxz',
            label: '人群性质',
            number: (data.crowdLabls || []).length,
            items: (data.crowdLabls || []).map((n: string) => ({ text: n })),
          },
        ];
        // 体征趋势示例数据（真实数据由 queryResidentSignInfo 提供，阶段3-5 以 mock 为主）
        trendCategories.value = ['1次', '2次', '3次', '4次', '5次', '6次'];
        trendSeries.value = [{ name: '血压', data: [120, 118, 122, 119, 121, 117], areaStyle: true }];
      } catch (e) {
        console.warn('[HealthIndex] 加载失败', e);
      } finally {
        loading.value = false;
      }
    }

    onMounted(load);

    return () => (
      <div class="min-h-screen bg-gray-50">
        {/* 顶部 Tab */}
        <div class="sticky top-0 z-10 bg-white border-b border-gray-100">
          <div class="flex">
            {['健康画像', '健康档案'].map((label, i) => (
              <button
                key={label}
                class={`flex-1 py-3 text-sm font-medium transition-colors ${tabActive.value === i ? 'text-[#096aff] border-b-2 border-[#096aff]' : 'text-gray-500'}`}
                onClick={() => (tabActive.value = i)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1：健康画像 */}
        {tabActive.value === 0 && (
          <div class="p-4">
            {loading.value && <div class="py-10 text-center text-gray-400 text-sm">加载中...</div>}

            {/* 体征趋势图 */}
            <div class="bg-white rounded-lg p-3 mb-4">
              <div class="text-sm font-medium mb-2 text-gray-700">体征趋势</div>
              <ChartCpt
                type="line"
                data={{ categories: trendCategories.value, series: trendSeries.value }}
                height={180}
              />
            </div>

            {/* 画像卡片网格 */}
            <div class="grid grid-cols-2 gap-3">
              {portraitItems.value.map((item) => (
                <div key={item.key} class="bg-white rounded-lg p-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700">{item.label}</span>
                    <span class="text-xs text-[#096aff]">{item.number} 项</span>
                  </div>
                  <div class="mt-2 space-y-1">
                    {item.items.slice(0, 3).map((it, idx) => (
                      <div key={idx} class="text-xs text-gray-500 line-clamp-1">
                        {it.text}
                        {it.subText && <span class="ml-1 text-gray-400">{it.subText}</span>}
                      </div>
                    ))}
                    {item.items.length === 0 && <div class="text-xs text-gray-300">暂无数据</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2：健康档案（简化为入口） */}
        {tabActive.value === 1 && (
          <div class="p-4">
            <div class="bg-white rounded-lg divide-y divide-gray-100">
              <div class="flex items-center justify-between p-4" onClick={() => router.push('/health/profile')}>
                <span class="text-sm text-gray-700">健康全息画像</span>
                <span class="text-gray-300">›</span>
              </div>
              <div class="flex items-center justify-between p-4" onClick={() => router.push('/health/records')}>
                <span class="text-sm text-gray-700">我的健康档案</span>
                <span class="text-gray-300">›</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
});
