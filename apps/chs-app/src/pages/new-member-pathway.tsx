/**
 * 新增家庭成员 — 选择新增方式
 */
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export const routeMeta = {
  title: '新增成员',
  layout: 'default',
  auth: true,
};

export default defineComponent({
  name: 'NewMemberPathway',
  setup() {
    const router = useRouter();

    const pathways = [
      { key: 'form', title: '手动填写', desc: '手动录入成员信息', icon: '✍️' },
      { key: 'ocr', title: '身份证识别', desc: '拍照识别身份证快速录入', icon: '📷' },
    ];

    return () => (
      <div class="min-h-screen bg-gray-50 p-4">
        <div class="bg-white rounded-lg divide-y divide-gray-50">
          {pathways.map((p) => (
            <div
              key={p.key}
              class="flex items-center p-4 cursor-pointer active:bg-gray-50"
              onClick={() => router.push(`/member-form?mode=${p.key}`)}>
              <span class="text-2xl mr-3">{p.icon}</span>
              <div class="flex-1">
                <div class="text-[15px] font-medium">{p.title}</div>
                <div class="text-sm text-gray-400 mt-0.5">{p.desc}</div>
              </div>
              <span class="text-gray-300">›</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
});
