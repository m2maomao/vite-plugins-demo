import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/index/index.vue");import "/@fs/C:/Users/maoma/Develop/Personal/vite-plugins-demo/node_modules/.pnpm/@dcloudio+uni-components@3._1e3e7f66fe21951c2e2803ebc66d377a/node_modules/@dcloudio/uni-components/style/view.css";import { View as __syscom_0 } from "/@fs/C:/Users/maoma/Develop/Personal/vite-plugins-demo/node_modules/.pnpm/@dcloudio+uni-h5@3.0.0-5010_0edd09de263a9dfbfe912dba34907dbd/node_modules/@dcloudio/uni-h5/dist/uni-h5.es.js";import __easycom_1 from "/node_modules/wot-design-uni/components/wd-button/wd-button.vue";import { resolveDynamicComponent as __resolveDynamicComponent } from "/@fs/C:/Users/maoma/Develop/Personal/vite-plugins-demo/node_modules/.pnpm/@dcloudio+uni-h5-vue@3.0.0-_31123015cc776aac27608a5235b46210/node_modules/@dcloudio/uni-h5-vue/dist/vue.runtime.esm.js";import { resolveEasycom } from "/@fs/C:/Users/maoma/Develop/Personal/vite-plugins-demo/node_modules/.pnpm/@dcloudio+uni-app@3.0.0-501_1373cdd69fdf5f4c6995106b4fb0e9b5/node_modules/@dcloudio/uni-app/dist/uni-app.es.js";import __easycom_2 from "/node_modules/wot-design-uni/components/wd-tag/wd-tag.vue";import __easycom_3 from "/node_modules/wot-design-uni/components/wd-cell/wd-cell.vue";import __easycom_4 from "/node_modules/kangaroo-uni/components/k-button/k-button.vue";import __easycom_5 from "/node_modules/kangaroo-uni/components/k-tag/k-tag.vue";import __easycom_6 from "/node_modules/kangaroo-uni/components/k-cell/k-cell.vue";import __easycom_7 from "/node_modules/kangaroo-uni/components/k-field/k-field.vue";
const _sfc_main = {
  data() {
    return {
      title: 'Hello',
      form: { name: '', phone: '' },
    };
  },
  onLoad() {},
  methods: {},
};

import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, toDisplayString as _toDisplayString, openBlock as _openBlock, createBlock as _createBlock } from "/@fs/C:/Users/maoma/Develop/Personal/vite-plugins-demo/node_modules/.pnpm/@dcloudio+uni-h5-vue@3.0.0-_31123015cc776aac27608a5235b46210/node_modules/@dcloudio/uni-h5-vue/dist/vue.runtime.esm.js"

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_uni_view = __syscom_0
  const _component_wd_button = resolveEasycom(__resolveDynamicComponent("wd-button"), __easycom_1)
  const _component_wd_tag = resolveEasycom(__resolveDynamicComponent("wd-tag"), __easycom_2)
  const _component_wd_cell = resolveEasycom(__resolveDynamicComponent("wd-cell"), __easycom_3)
  const _component_k_button = resolveEasycom(__resolveDynamicComponent("k-button"), __easycom_4)
  const _component_k_tag = resolveEasycom(__resolveDynamicComponent("k-tag"), __easycom_5)
  const _component_k_cell = resolveEasycom(__resolveDynamicComponent("k-cell"), __easycom_6)
  const _component_k_field = resolveEasycom(__resolveDynamicComponent("k-field"), __easycom_7)

  return (_openBlock(), _createBlock(_component_v_uni_view, { class: "content" }, {
    default: _withCtx(() => [
      _createVNode(_component_v_uni_view, { class: "title" }, {
        default: _withCtx(() => [
          _createTextVNode("deer-uni P0 可行性验证")
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_wd_button, {
        type: "primary",
        size: "large",
        block: ""
      }, {
        default: _withCtx(() => [
          _createTextVNode("主要按钮1")
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_wd_button, {
        plain: "",
        block: "",
        style: {"margin-top":"20rpx"}
      }, {
        default: _withCtx(() => [
          _createTextVNode("次要按钮2")
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_v_uni_view, { style: {"margin-top":"40rpx"} }, {
        default: _withCtx(() => [
          _createVNode(_component_wd_tag, { type: "success" }, {
            default: _withCtx(() => [
              _createTextVNode("成功")
            ]),
            _: 1 /* STABLE */
          }),
          _createVNode(_component_wd_tag, {
            type: "danger",
            style: {"margin-left":"16rpx"}
          }, {
            default: _withCtx(() => [
              _createTextVNode("危险")
            ]),
            _: 1 /* STABLE */
          }),
          _createVNode(_component_wd_tag, {
            type: "warning",
            style: {"margin-left":"16rpx"}
          }, {
            default: _withCtx(() => [
              _createTextVNode("警告")
            ]),
            _: 1 /* STABLE */
          })
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_v_uni_view, { style: {"margin-top":"40rpx"} }, {
        default: _withCtx(() => [
          _createVNode(_component_wd_cell, {
            title: "标题",
            value: "内容",
            isLink: ""
          }),
          _createVNode(_component_wd_cell, {
            title: "wot-ui 组件渲染",
            value: "OK"
          })
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_v_uni_view, { class: "divider" }, {
        default: _withCtx(() => [
          _createTextVNode("kangaroo-uni 二次封装验证")
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_k_button, {
        biz: "primary",
        block: ""
      }, {
        default: _withCtx(() => [
          _createTextVNode("主按钮（k-button）")
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_k_button, {
        biz: "cancel",
        plain: "",
        block: "",
        style: {"margin-top":"20rpx"}
      }, {
        default: _withCtx(() => [
          _createTextVNode("取消（k-button）")
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_k_button, {
        biz: "danger",
        block: "",
        style: {"margin-top":"20rpx"}
      }, {
        default: _withCtx(() => [
          _createTextVNode("危险（k-button）")
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_v_uni_view, { class: "divider" }, {
        default: _withCtx(() => [
          _createTextVNode("k-tag 标签")
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_k_tag, { biz: "success" }, {
        default: _withCtx(() => [
          _createTextVNode("成功")
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_k_tag, {
        biz: "danger",
        plain: "",
        style: {"margin-left":"16rpx"}
      }, {
        default: _withCtx(() => [
          _createTextVNode("危险幽灵")
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_k_tag, {
        biz: "warning",
        round: "",
        style: {"margin-left":"16rpx"}
      }, {
        default: _withCtx(() => [
          _createTextVNode("圆角")
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_v_uni_view, { class: "divider" }, {
        default: _withCtx(() => [
          _createTextVNode("k-cell 列表")
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_k_cell, {
        title: "姓名",
        value: "张三",
        isLink: ""
      }),
      _createVNode(_component_k_cell, {
        title: "手机号",
        value: "13800000000"
      }),
      _createVNode(_component_v_uni_view, { class: "divider" }, {
        default: _withCtx(() => [
          _createTextVNode("k-field 表单（v-model 转发）")
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_k_field, {
        modelValue: $data.form.name,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (($data.form.name) = $event)),
        label: "姓名",
        placeholder: "请输入姓名",
        clearable: ""
      }, null, 8 /* PROPS */, ["modelValue"]),
      _createVNode(_component_k_field, {
        modelValue: $data.form.phone,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (($data.form.phone) = $event)),
        label: "手机号",
        type: "tel",
        placeholder: "请输入手机号"
      }, null, 8 /* PROPS */, ["modelValue"]),
      _createVNode(_component_v_uni_view, { style: {"margin-top":"16rpx","color":"#999","font-size":"24rpx"} }, {
        default: _withCtx(() => [
          _createTextVNode("已输入：" + _toDisplayString($data.form.name) + " / " + _toDisplayString($data.form.phone), 1 /* TEXT */)
        ]),
        _: 1 /* STABLE */
      })
    ]),
    _: 1 /* STABLE */
  }))
}

import "/src/pages/index/index.vue?vue&type=style&index=0&scoped=83a5a03c&lang.css"

_sfc_main.__hmrId = "83a5a03c"
typeof __VUE_HMR_RUNTIME__ !== 'undefined' && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main)
import.meta.hot.on('file-changed', ({ file }) => {
  __VUE_HMR_RUNTIME__.CHANGED_FILE = file
})
import.meta.hot.accept(mod => {
  if (!mod) return
  const { default: updated, _rerender_only } = mod
  if (_rerender_only) {
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render)
  } else {
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated)
  }
})
import _export_sfc from "/@id/__x00__plugin-vue:export-helper"
export default /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__scopeId',"data-v-83a5a03c"],['__file',"C:/Users/maoma/Develop/Personal/vite-plugins-demo/packages/deer-uni/src/pages/index/index.vue"]])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvbWFvbWEvRGV2ZWxvcC9QZXJzb25hbC92aXRlLXBsdWdpbnMtZGVtby9wYWNrYWdlcy9kZWVyLXVuaS9zcmMvcGFnZXMvaW5kZXgvaW5kZXgudnVlIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkM6L1VzZXJzL21hb21hL0RldmVsb3AvUGVyc29uYWwvdml0ZS1wbHVnaW5zLWRlbW8vcGFja2FnZXMvZGVlci11bmkvc3JjL3BhZ2VzL2luZGV4L2luZGV4LnZ1ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8dGVtcGxhdGU+XHJcbiAgPHZpZXcgY2xhc3M9XCJjb250ZW50XCI+XHJcbiAgICA8dmlldyBjbGFzcz1cInRpdGxlXCI+ZGVlci11bmkgUDAg5Y+v6KGM5oCn6aqM6K+BPC92aWV3PlxyXG5cclxuICAgIDx3ZC1idXR0b24gdHlwZT1cInByaW1hcnlcIiBzaXplPVwibGFyZ2VcIiBibG9jaz7kuLvopoHmjInpkq4xPC93ZC1idXR0b24+XHJcbiAgICA8d2QtYnV0dG9uIHBsYWluIGJsb2NrIHN0eWxlPVwibWFyZ2luLXRvcDogMjBycHhcIj7mrKHopoHmjInpkq4yPC93ZC1idXR0b24+XHJcblxyXG4gICAgPHZpZXcgc3R5bGU9XCJtYXJnaW4tdG9wOiA0MHJweFwiPlxyXG4gICAgICA8d2QtdGFnIHR5cGU9XCJzdWNjZXNzXCI+5oiQ5YqfPC93ZC10YWc+XHJcbiAgICAgIDx3ZC10YWcgdHlwZT1cImRhbmdlclwiIHN0eWxlPVwibWFyZ2luLWxlZnQ6IDE2cnB4XCI+5Y2x6ZmpPC93ZC10YWc+XHJcbiAgICAgIDx3ZC10YWcgdHlwZT1cIndhcm5pbmdcIiBzdHlsZT1cIm1hcmdpbi1sZWZ0OiAxNnJweFwiPuitpuWRijwvd2QtdGFnPlxyXG4gICAgPC92aWV3PlxyXG5cclxuICAgIDx2aWV3IHN0eWxlPVwibWFyZ2luLXRvcDogNDBycHhcIj5cclxuICAgICAgPHdkLWNlbGwgdGl0bGU9XCLmoIfpophcIiB2YWx1ZT1cIuWGheWuuVwiIGlzTGluayAvPlxyXG4gICAgICA8d2QtY2VsbCB0aXRsZT1cIndvdC11aSDnu4Tku7bmuLLmn5NcIiB2YWx1ZT1cIk9LXCIgLz5cclxuICAgIDwvdmlldz5cclxuXHJcbiAgICA8dmlldyBjbGFzcz1cImRpdmlkZXJcIj5rYW5nYXJvby11bmkg5LqM5qyh5bCB6KOF6aqM6K+BPC92aWV3PlxyXG4gICAgPGstYnV0dG9uIGJpej1cInByaW1hcnlcIiBibG9jaz7kuLvmjInpkq7vvIhrLWJ1dHRvbu+8iTwvay1idXR0b24+XHJcbiAgICA8ay1idXR0b24gYml6PVwiY2FuY2VsXCIgcGxhaW4gYmxvY2sgc3R5bGU9XCJtYXJnaW4tdG9wOiAyMHJweFwiPuWPlua2iO+8iGstYnV0dG9u77yJPC9rLWJ1dHRvbj5cclxuICAgIDxrLWJ1dHRvbiBiaXo9XCJkYW5nZXJcIiBibG9jayBzdHlsZT1cIm1hcmdpbi10b3A6IDIwcnB4XCI+5Y2x6Zmp77yIay1idXR0b27vvIk8L2stYnV0dG9uPlxyXG5cclxuICAgIDx2aWV3IGNsYXNzPVwiZGl2aWRlclwiPmstdGFnIOagh+etvjwvdmlldz5cclxuICAgIDxrLXRhZyBiaXo9XCJzdWNjZXNzXCI+5oiQ5YqfPC9rLXRhZz5cclxuICAgIDxrLXRhZyBiaXo9XCJkYW5nZXJcIiBwbGFpbiBzdHlsZT1cIm1hcmdpbi1sZWZ0OiAxNnJweFwiPuWNsemZqeW5veeBtTwvay10YWc+XHJcbiAgICA8ay10YWcgYml6PVwid2FybmluZ1wiIHJvdW5kIHN0eWxlPVwibWFyZ2luLWxlZnQ6IDE2cnB4XCI+5ZyG6KeSPC9rLXRhZz5cclxuXHJcbiAgICA8dmlldyBjbGFzcz1cImRpdmlkZXJcIj5rLWNlbGwg5YiX6KGoPC92aWV3PlxyXG4gICAgPGstY2VsbCB0aXRsZT1cIuWnk+WQjVwiIHZhbHVlPVwi5byg5LiJXCIgaXNMaW5rIC8+XHJcbiAgICA8ay1jZWxsIHRpdGxlPVwi5omL5py65Y+3XCIgdmFsdWU9XCIxMzgwMDAwMDAwMFwiIC8+XHJcblxyXG4gICAgPHZpZXcgY2xhc3M9XCJkaXZpZGVyXCI+ay1maWVsZCDooajljZXvvIh2LW1vZGVsIOi9rOWPke+8iTwvdmlldz5cclxuICAgIDxrLWZpZWxkIHYtbW9kZWw9XCJmb3JtLm5hbWVcIiBsYWJlbD1cIuWnk+WQjVwiIHBsYWNlaG9sZGVyPVwi6K+36L6T5YWl5aeT5ZCNXCIgY2xlYXJhYmxlIC8+XHJcbiAgICA8ay1maWVsZCB2LW1vZGVsPVwiZm9ybS5waG9uZVwiIGxhYmVsPVwi5omL5py65Y+3XCIgdHlwZT1cInRlbFwiIHBsYWNlaG9sZGVyPVwi6K+36L6T5YWl5omL5py65Y+3XCIgLz5cclxuICAgIDx2aWV3IHN0eWxlPVwibWFyZ2luLXRvcDogMTZycHg7IGNvbG9yOiAjOTk5OyBmb250LXNpemU6IDI0cnB4XCI+5bey6L6T5YWl77yae3sgZm9ybS5uYW1lIH19IC8ge3sgZm9ybS5waG9uZSB9fTwvdmlldz5cclxuICA8L3ZpZXc+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c2NyaXB0PlxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZGF0YSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRpdGxlOiAnSGVsbG8nLFxyXG4gICAgICBmb3JtOiB7IG5hbWU6ICcnLCBwaG9uZTogJycgfSxcclxuICAgIH07XHJcbiAgfSxcclxuICBvbkxvYWQoKSB7fSxcclxuICBtZXRob2RzOiB7fSxcclxufTtcclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGUgc2NvcGVkPlxyXG4uY29udGVudCB7XHJcbiAgcGFkZGluZzogNDBycHggMzJycHg7XHJcbn1cclxuXHJcbi50aXRsZSB7XHJcbiAgZm9udC1zaXplOiAzNnJweDtcclxuICBmb250LXdlaWdodDogYm9sZDtcclxuICBtYXJnaW4tYm90dG9tOiA0MHJweDtcclxufVxyXG5cclxuLmRpdmlkZXIge1xyXG4gIG1hcmdpbjogNDBycHggMCAyMHJweDtcclxuICBmb250LXNpemU6IDI4cnB4O1xyXG4gIGNvbG9yOiAjOTk5O1xyXG59XHJcbjwvc3R5bGU+XHJcbiJdLCJtYXBwaW5n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