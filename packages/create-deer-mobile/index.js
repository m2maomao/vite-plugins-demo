#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { intro, outro, spinner, note } from '@clack/prompts'
import { execa } from 'execa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectName = process.argv[2]

if (!projectName) {
  console.log('🦘 用法: npx create-deer-mobile <项目名>')
  process.exit(1)
}

const targetDir = path.resolve(process.cwd(), projectName)
const templateDir = path.resolve(__dirname, 'template')
console.log('')
intro('⚡️ Create Deer Mobile')

const s = spinner()

// 1️⃣ 创建目录
s.start('Creating project directory...')
fs.mkdirSync(targetDir, { recursive: true })
s.stop('✔ Project directory created')

// 2️⃣ 复制模板并替换 PROJECT_NAME
s.start('Copying template...')
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      let content = fs.readFileSync(srcPath, 'utf-8')
      content = content.replace(/PROJECT_NAME/g, projectName)
      fs.writeFileSync(destPath, content)
    }
  }
}
copyDir(templateDir, targetDir)
s.stop('✔ Template copied')

// 3️⃣ 安装依赖（关键：静默 npm 输出）
s.start('Installing dependencies...')

// 检测 pnpm
let pm = 'npm'
try {
  await execa('pnpm', ['--version'], { stdio: 'pipe' })
  pm = 'pnpm'
} catch { /* ignore */ }
s.start(`Installing dependencies (${pm})...`)

await execa('npm', ['install'], {
  cwd: targetDir,
  stdio: 'ignore',
})
s.stop('✔ Dependencies installed')

// 4️⃣ Git 初始化
s.start('Initializing Git repository...')
try {
  await execa('git', ['init', '--initial-branch=main'], {
    cwd: targetDir,
    stdio: 'ignore',
  })
} catch { /* ignore */ }
s.stop('✔ Git repository initialized')

// 5️⃣ 结束
note(`
Inside that directory, you can run:

  npm run dev     Start development server
  npm run build   Build for production
  npm run preview Preview production build

We suggest you start by typing:

  cd ${projectName}
  npm run dev`,
  '🎉 Success! Created ' + projectName
)

outro(`Ready to go! 🦌`)