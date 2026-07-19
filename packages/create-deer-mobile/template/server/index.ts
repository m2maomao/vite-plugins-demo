import express from 'express';

const app = express();
const PORT = 3001;
app.use(express.json()); // 解析JSON body

// 模拟接口：返回动态路由表
app.get('/api/routes', (req, res) => {
  res.json({
    code: 0,
    data: [
      {
        path: '/actiity',
        name: 'BING搜索',
        redirect: 'http://bing.com',
      },
      {
        path: '/docs',
        name: 'vite文档',
        redirect: 'https://vite.dev',
      },
    ],
  });
});

app.get('/api/user/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    code: 0,
    data: {
      id: Number(id),
      name: '张三',
      email: 'zhangsan@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + id,
    },
  });
});

app.post('/api/user/login', (req, res) => {
  const { username } = req.body;
  res.json({
    code: 0,
    data: {
      token: 'mock-token-' + Date.now(),
      user: { id: 1, name: username || '用户' },
    },
  });
});

app.listen(PORT, () => {
  console.log(`📡 Mock API Server running at http://localhost:${PORT}`);
});
