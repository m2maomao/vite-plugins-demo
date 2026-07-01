## 本地发布测试
### 1、安装vedarccio
```
npm install -g verdaccio
```
### 2、启动本地npm仓库
```
verdaccio
```
### 3、发布（不需要编译）
```
cd packages/create-deer-mobile
```
### 4、版本号自增
```
npm version patch
```
### 5、发布
```
npm publish --registry http://localhost:4873
```