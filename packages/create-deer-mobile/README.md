# create-deer-mobile

> 快速创建 Deer Mobile 项目的 CLI 工具

## 使用

```bash
npx create-deer-mobile my-app
cd my-app
pnpm install
pnpm dev
```

## 目录结构

```
my-app/
├── src/
│   ├── pages/          # 页面文件（约定式路由）
│   ├── layouts/        # 布局组件
│   ├── api/            # API 模块
│   ├── stores/         # Pinia 状态
│   ├── mock/           # Mock 数据
│   └── main.ts         # 入口
├── .env                # 环境变量
├── .env.development    # 开发环境变量
├── .env.production     # 生产环境变量
└── vite.config.ts      # Vite 配置
```

## 本地发布测试

```bash
cd packages/create-deer-mobile
npm version patch
npm publish --registry http://localhost:4873
```

要求先发布 deer-mobile 的最新版本。
