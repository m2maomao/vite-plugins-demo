#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectName = process.argv[2]

if (!projectName) {
  console.log('🦘 用法: npx create-deer-mobile <项目名>')
  process.exit(1)
}

const targetDir = path.resolve(process.cwd(), projectName)
const templateDir = path.resolve(__dirname, 'template')

console.log(`🦘 正在创建 Deer Mobile 项目: ${projectName}`)

// 1、创建目录
fs.mkdirSync(targetDir, { recursive: true })

// 2、复制模板文件 (替换 PROJECT_NAME)
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

// 3、安装依赖
console.log('📦 正在安装系统...')
execSync('npm install', { stdio: 'inherit', cwd: targetDir })

// 4、Git 初始化
try {
  execSync('git init', { cwd: targetDir, stdio: 'inherit' })
  execSync('git branch -m main', { cwd: targetDir })
} catch {}

console.log(`\n✅ Deer Mobile 项目创建成功: ${projectName}`)
console.log(`\n cd ${projectName}`)
console.log(`  npm run dev\n`)