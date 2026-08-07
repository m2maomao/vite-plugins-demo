<template>
  <view class="content">
    <view class="title">deer-uni P0 可行性验证</view>

    <wd-button type="primary" size="large" block>主要按钮1</wd-button>
    <wd-button plain block style="margin-top: 20rpx">次要按钮2</wd-button>

    <view style="margin-top: 40rpx">
      <wd-tag type="success">成功</wd-tag>
      <wd-tag type="danger" style="margin-left: 16rpx">危险</wd-tag>
      <wd-tag type="warning" style="margin-left: 16rpx">警告</wd-tag>
    </view>

    <view style="margin-top: 40rpx">
      <wd-cell title="标题" value="内容" isLink />
      <wd-cell title="wot-ui 组件渲染" value="OK" />
    </view>

    <view class="divider">kangaroo-uni 二次封装验证（yhu- 前缀）</view>
    <yhu-button biz="primary" block>主按钮（yhu-button）</yhu-button>
    <yhu-button biz="cancel" plain block style="margin-top: 20rpx">取消（yhu-button）</yhu-button>
    <yhu-button biz="danger" block style="margin-top: 20rpx">危险（yhu-button）</yhu-button>

    <view class="divider">yhu-tag 标签</view>
    <yhu-tag biz="success">成功</yhu-tag>
    <yhu-tag biz="danger" plain style="margin-left: 16rpx">危险幽灵</yhu-tag>
    <yhu-tag biz="warning" round style="margin-left: 16rpx">圆角</yhu-tag>

    <view class="divider">yhu-cell 列表</view>
    <yhu-cell title="姓名" value="张三" isLink />
    <yhu-cell title="手机号" value="13800000000" />

    <view class="divider">yhu-field 表单（v-model 转发）</view>
    <yhu-field v-model="form.name" label="姓名" placeholder="请输入姓名" clearable />
    <yhu-field v-model="form.phone" label="手机号" type="tel" placeholder="请输入手机号" />
    <view style="margin-top: 16rpx; color: #999; font-size: 24rpx">已输入：{{ form.name }} / {{ form.phone }}</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello',
      form: { name: '', phone: '' },
    };
  },
  onLoad() {},
  methods: {},
};
</script>

<style>
.content {
  padding: 40rpx 32rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 40rpx;
}

.divider {
  margin: 40rpx 0 20rpx;
  font-size: 28rpx;
  color: #999;
}
</style>
