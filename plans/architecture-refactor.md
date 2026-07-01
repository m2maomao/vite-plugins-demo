# 架构调整方案

## 目标
将运行时文件从模板移到框架包，用户通过 `deer-mobile` 导入

## 改动清单

### 1. config-plugin 新增 request 配置
### 2. 模板删掉三个文件（移到 deer-mobile）
### 3. deer-mobile 新增 exports
### 4. setup-plugin layout 覆盖机制
### 5. 重新编译发布
