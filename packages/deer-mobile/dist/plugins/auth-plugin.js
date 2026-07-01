export default function authPlugin() {
    return {
        name: 'auth-plugin',
        transform(code, id) {
            console.log('🔍 auth-plugin transform:', id);
            // 向生成的启动代码注入路由守卫
            if (id.includes('virtual:setup-app')) {
                return {
                    code: code.replace('app.use(router);', `
              // 路由收入：未登录跳转登录页
              router.beforeEach((to) => {
                const token = localStorage.getItem('token')
                const noAuthPages = ['/login', '/404']
                if (!token && !noAuthPages.includes(to.path)) {
                  return '/login'
                }
              })
              app.use(router);
            `),
                    map: null,
                };
            }
        }
    };
}
