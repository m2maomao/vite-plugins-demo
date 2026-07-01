import fs from 'fs';
import { execSync } from 'child_process';

// 读取 deer-mobile 的版本
const deerVersion = JSON.parse(
  fs.readFileSync('../deer-mobile/package.json', 'utf-8')
).version

// 更新模版里的版本号
const templatePkg = JSON.parse(
  fs.readFileSync('./template/package.json', 'utf-8')
)

templatePkg.dependencies['deer-mobile'] = `^${deerVersion}`
fs.writeFileSync('./template/package.json', JSON.stringify(templatePkg, null, 2))