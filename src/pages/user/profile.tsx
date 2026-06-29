import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const profile = ref<any>(null);

    onMounted(async() => {
      const res = await (window as any).$api.user.getProfile(1)
      profile.value = res.data
    })
    return () => (
      <div>
        <h3>用户资料</h3>
        {
          profile.value ? (
            <div>
              <p>ID: {profile.value.id}</p>
              <p>姓名: {profile.value.name}</p>
              <p>邮箱: {profile.value.email}</p>
            </div>
          ) : (
            <p>加载中...</p>
          )
        }
      </div>
    )
  }
})