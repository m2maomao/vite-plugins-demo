## 本地发布测试
### 1、安装vedarccio
```
npm install -g verdaccio
```
### 2、启动本地npm仓库
```
verdaccio
```
### 3、编译发布
```
cd packages/deer-mobile
npx esbuild index.ts --bundle --outfile=index.js --format=esm --platform=node --external:fast-glob --external:esbuild
```
### 4、版本号自增
```
npm version patch
```
### 5、发布
```
npm publish --registry http://localhost:4873
```