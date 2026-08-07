import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/pages/index/index.vue");import "/@fs/C:/Users/maoma/Develop/Personal/vite-plugins-demo/node_modules/.pnpm/@dcloudio+uni-components@3._53a8eadc9fcc09a1b957a43a5976050f/node_modules/@dcloudio/uni-components/style/view.css";import { View as __syscom_0 } from "/@fs/C:/Users/maoma/Develop/Personal/vite-plugins-demo/node_modules/.pnpm/@dcloudio+uni-h5@3.0.0-5010_a0d1601619badba9c5f606af3e50f3fd/node_modules/@dcloudio/uni-h5/dist/uni-h5.es.js";import __easycom_1 from "/node_modules/wot-design-uni/components/wd-button/wd-button.vue";import { resolveDynamicComponent as __resolveDynamicComponent } from "/@fs/C:/Users/maoma/Develop/Personal/vite-plugins-demo/node_modules/.pnpm/@dcloudio+uni-h5-vue@3.0.0-_31123015cc776aac27608a5235b46210/node_modules/@dcloudio/uni-h5-vue/dist/vue.runtime.esm.js";import { resolveEasycom } from "/@fs/C:/Users/maoma/Develop/Personal/vite-plugins-demo/node_modules/.pnpm/@dcloudio+uni-app@3.0.0-501_efbba2aa8baf1323b6e0005b66129445/node_modules/@dcloudio/uni-app/dist/uni-app.es.js";import __easycom_2 from "/node_modules/wot-design-uni/components/wd-tag/wd-tag.vue";import __easycom_3 from "/node_modules/wot-design-uni/components/wd-cell/wd-cell.vue";import __easycom_4 from "/src/uni_modules/kangaroo-uni/components/k-button/k-button.vue";
const _sfc_main = {
  data() {
    return {
      title: 'Hello',
    };
  },
  onLoad() {},
  methods: {},
};

import { createTextVNode as _createTextVNode, resolveComponent as _resolveComponent, withCtx as _withCtx, createVNode as _createVNode, openBlock as _openBlock, createBlock as _createBlock } from "/@fs/C:/Users/maoma/Develop/Personal/vite-plugins-demo/node_modules/.pnpm/@dcloudio+uni-h5-vue@3.0.0-_31123015cc776aac27608a5235b46210/node_modules/@dcloudio/uni-h5-vue/dist/vue.runtime.esm.js"

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_uni_view = __syscom_0
  const _component_wd_button = resolveEasycom(__resolveDynamicComponent("wd-button"), __easycom_1)
  const _component_wd_tag = resolveEasycom(__resolveDynamicComponent("wd-tag"), __easycom_2)
  const _component_wd_cell = resolveEasycom(__resolveDynamicComponent("wd-cell"), __easycom_3)
  const _component_k_button = resolveEasycom(__resolveDynamicComponent("k-button"), __easycom_4)

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
          _createTextVNode("主要按钮")
        ]),
        _: 1 /* STABLE */
      }),
      _createVNode(_component_wd_button, {
        plain: "",
        block: "",
        style: {"margin-top":"20rpx"}
      }, {
        default: _withCtx(() => [
          _createTextVNode("次要按钮")
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
      })
    ]),
    _: 1 /* STABLE */
  }))
}

import "/src/pages/index/index.vue?t=1786088099695&vue&type=style&index=0&scoped=83a5a03c&lang.css"

_sfc_main.__hmrId = "83a5a03c"
typeof __VUE_HMR_RUNTIME__ !== 'undefined' && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main)
import.meta.hot.on('file-changed', ({ file }) => {
  __VUE_HMR_RUNTIME__.CHANGED_FILE = file
})
export const _rerender_only = __VUE_HMR_RUNTIME__.CHANGED_FILE === "C:/Users/maoma/Develop/Personal/vite-plugins-demo/packages/deer-uni/src/pages/index/index.vue"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQzovVXNlcnMvbWFvbWEvRGV2ZWxvcC9QZXJzb25hbC92aXRlLXBsdWdpbnMtZGVtby9wYWNrYWdlcy9kZWVyLXVuaS9zcmMvcGFnZXMvaW5kZXgvaW5kZXgudnVlIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkM6L1VzZXJzL21hb21hL0RldmVsb3AvUGVyc29uYWwvdml0ZS1wbHVnaW5zLWRlbW8vcGFja2FnZXMvZGVlci11bmkvc3JjL3BhZ2VzL2luZGV4L2luZGV4LnZ1ZSJdLCJzb3VyY2VzQ29udGVudCI6WyI8dGVtcGxhdGU+XHJcbiAgPHZpZXcgY2xhc3M9XCJjb250ZW50XCI+XHJcbiAgICA8dmlldyBjbGFzcz1cInRpdGxlXCI+ZGVlci11bmkgUDAg5Y+v6KGM5oCn6aqM6K+BPC92aWV3PlxyXG5cclxuICAgIDx3ZC1idXR0b24gdHlwZT1cInByaW1hcnlcIiBzaXplPVwibGFyZ2VcIiBibG9jaz7kuLvopoHmjInpkq48L3dkLWJ1dHRvbj5cclxuICAgIDx3ZC1idXR0b24gcGxhaW4gYmxvY2sgc3R5bGU9XCJtYXJnaW4tdG9wOiAyMHJweFwiPuasoeimgeaMiemSrjwvd2QtYnV0dG9uPlxyXG5cclxuICAgIDx2aWV3IHN0eWxlPVwibWFyZ2luLXRvcDogNDBycHhcIj5cclxuICAgICAgPHdkLXRhZyB0eXBlPVwic3VjY2Vzc1wiPuaIkOWKnzwvd2QtdGFnPlxyXG4gICAgICA8d2QtdGFnIHR5cGU9XCJkYW5nZXJcIiBzdHlsZT1cIm1hcmdpbi1sZWZ0OiAxNnJweFwiPuWNsemZqTwvd2QtdGFnPlxyXG4gICAgICA8d2QtdGFnIHR5cGU9XCJ3YXJuaW5nXCIgc3R5bGU9XCJtYXJnaW4tbGVmdDogMTZycHhcIj7orablkYo8L3dkLXRhZz5cclxuICAgIDwvdmlldz5cclxuXHJcbiAgICA8dmlldyBzdHlsZT1cIm1hcmdpbi10b3A6IDQwcnB4XCI+XHJcbiAgICAgIDx3ZC1jZWxsIHRpdGxlPVwi5qCH6aKYXCIgdmFsdWU9XCLlhoXlrrlcIiBpc0xpbmsgLz5cclxuICAgICAgPHdkLWNlbGwgdGl0bGU9XCJ3b3QtdWkg57uE5Lu25riy5p+TXCIgdmFsdWU9XCJPS1wiIC8+XHJcbiAgICA8L3ZpZXc+XHJcblxyXG4gICAgPHZpZXcgY2xhc3M9XCJkaXZpZGVyXCI+a2FuZ2Fyb28tdW5pIOS6jOasoeWwgeijhemqjOivgTwvdmlldz5cclxuICAgIDxrLWJ1dHRvbiBiaXo9XCJwcmltYXJ5XCIgYmxvY2s+5Li75oyJ6ZKu77yIay1idXR0b27vvIk8L2stYnV0dG9uPlxyXG4gICAgPGstYnV0dG9uIGJpej1cImNhbmNlbFwiIHBsYWluIGJsb2NrIHN0eWxlPVwibWFyZ2luLXRvcDogMjBycHhcIj7lj5bmtojvvIhrLWJ1dHRvbu+8iTwvay1idXR0b24+XHJcbiAgICA8ay1idXR0b24gYml6PVwiZGFuZ2VyXCIgYmxvY2sgc3R5bGU9XCJtYXJnaW4tdG9wOiAyMHJweFwiPuWNsemZqe+8iGstYnV0dG9u77yJPC9rLWJ1dHRvbj5cclxuICA8L3ZpZXc+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c2NyaXB0PlxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgZGF0YSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRpdGxlOiAnSGVsbG8nLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIG9uTG9hZCgpIHt9LFxyXG4gIG1ldGhvZHM6IHt9LFxyXG59O1xyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZSBzY29wZWQ+XHJcbi5jb250ZW50IHtcclxuICBwYWRkaW5nOiA0MHJweCAzMnJweDtcclxufVxyXG5cclxuLnRpdGxlIHtcclxuICBmb250LXNpemU6IDM2cnB4O1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gIG1hcmdpbi1ib3R0b206IDQwcnB4O1xyXG59XHJcblxyXG4uZGl2aWRlciB7XHJcbiAgbWFyZ2luOiA0MHJweCAwIDIwcnB4O1xyXG4gIGZvbnQtc2l6ZTogMjhycHg7XHJcbiAgY29sb3I6ICM5OTk7XHJcbn1cclxuPC9zdHlsZT5cclxuIl0sIm1h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