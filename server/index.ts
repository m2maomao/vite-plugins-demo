import express from 'express';

const app = express();
const PORT = 3001;

// 模拟接口：返回动态路由表
app.get('/api/routes', (req, res) => {
  res.json({
    code: 0,
    data: [
      {
        path: '/actiity',
        name: 'BING搜索',
        redirect: 'http://bing.com'
      },
      {
        path: '/docs',
        name: 'vite文档',
        redirect: 'https://vite.dev'
      }
    ]
  })
})

app.get('/api/user/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    code: 0,
    data: {
      id: Number(id),
      name: '张三',
      email: 'zhangsan@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + id,
    }
  })
})

app.listen(PORT, () => {
  console.log(`📡 Mock API Server running at http://localhost:${PORT}`)
})