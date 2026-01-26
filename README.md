# A2UI React

> **🧪**  **探索性项目** **：本项目为 A2UI 的 React 实现版本，处于早期探索阶段，存在很多不完善之处。**

---

## 技术栈

* **框架** **：React 18+**
* **构建工具** **：Vite**
* **UI 组件库** **：字节跳动内部组件库**

---

## 快速开始

### 1. 安装依赖


```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

---

## 组件使用示例

**本项目核心组件为** `<A2UIRenderWrap />`，它接收一组来自服务端的消息（`ServerToClientMessage[]`），并自动渲染对应的 UI 元素。

### 类型定义


```typescript
export interface ServerToClientMessage{
  beginRendering?:BeginRenderingMessage;
  surfaceUpdate?:SurfaceUpdateMessage;
  dataModelUpdate?:DataModelUpdate;
  deleteSurface?:DeleteSurfaceMessage;
}
```

### 使用方式

```typescript
import A2UIRenderWrap, { TestWrapper } from "@/components/A2UIRenderWrap";

const data = [
  { beginRendering: {} },
  {
    surfaceUpdate: {
      /* ... */
    },
  },
];

<TestWrapper
  theme={{}}
  onAction={(a) => {
    console.log(a, "provider点击事件");
  }}
>
    <A2UIRenderWrap
      messages={data}
      onAction={(a) => {
        console.log(a, "点击事件");
      }}
    />

</TestWrapper>;

```

* `messages`：服务端下发的指令消息数组。
* `onAction`：当用户与渲染出的 UI 交互（如点击按钮）时触发的回调。


---
