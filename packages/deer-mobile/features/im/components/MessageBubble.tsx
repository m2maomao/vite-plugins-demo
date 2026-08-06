/**
 * Deer Mobile — IM MessageBubble
 * 消息气泡：按 @im/sdk 的 $contentType 分发渲染不同消息内容
 */

import { defineComponent, type PropType, type VNode } from 'vue';
import type { IMComMessage } from '../types';

export default defineComponent({
  name: 'DeerMessageBubble',
  props: {
    message: { type: Object as PropType<IMComMessage>, required: true },
    isSelf: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
  },
  setup(props) {
    return () => {
      const m = props.message;
      const ct = m.contentType;
      const bubbleCls = props.isSelf ? 'bg-[#95ec69] text-black' : 'bg-white text-gray-800';

      let body: VNode;
      switch (ct) {
        case 1: // TEXT
          body = <div class="whitespace-pre-wrap break-all">{m.content}</div>;
          break;
        case 2: // IMAGE
          body = (
            <img
              src={m.filePath || m.thumbnailPath}
              class="max-w-[200px] max-h-[220px] rounded-md object-cover"
              alt="图片"
              loading="lazy"
            />
          );
          break;
        case 3: // FILE
          body = (
            <div class="flex items-center gap-1.5 text-sm">
              <span class="text-xl">📎</span>
              <a class="text-blue-600 break-all" href={m.filePath} target="_blank">
                {m.fileName || '文件'}
              </a>
            </div>
          );
          break;
        case 4: // VOICE
          body = (
            <div class="flex items-center gap-1 text-sm">
              🎤 语音{m.fileSize ? ` ${(m.fileSize / 1000).toFixed(0)}"` : ''}
            </div>
          );
          break;
        case 8: // VIDEO
          body = <video src={m.filePath} controls class="max-w-[200px] max-h-[200px] rounded-md" />;
          break;
        default:
          body = <div class="whitespace-pre-wrap break-all text-sm">{m.content || '未知消息'}</div>;
      }

      return (
        <div class={`flex items-end gap-2 my-2 ${props.isSelf ? 'flex-row-reverse' : ''}`}>
          <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs shrink-0 overflow-hidden">
            {props.avatar ? (
              <img src={props.avatar} class="w-full h-full object-cover" alt="" />
            ) : (
              <span>{props.isSelf ? '我' : '他'}</span>
            )}
          </div>
          <div
            class={`relative max-w-[72%] px-3 py-2 rounded-xl text-sm leading-5 shadow-sm ${bubbleCls} ${
              props.isSelf ? 'rounded-tr-sm' : 'rounded-tl-sm'
            }`}>
            {body}
          </div>
        </div>
      );
    };
  },
});
