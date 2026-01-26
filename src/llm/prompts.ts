import { before } from "lodash-es";
import { DataModelUpdate } from "./../../types";


const surfaceUpdate = {
  surfaceUpdate: {
    surfaceId: "main_content",
    components: [
      {
        id: "root",
        component: {
          Column: {
            children: {
              explicitList: ["header", "content", "footer"],
            },
          },
        },
      },
      {
        id: "header",
        component: {
          Text: {
            text: { literalString: "欢迎使用 A2UI 协议" },
            usageHint: "h1",
          },
        },
      },
      {
        id: "content",
        component: {
          Text: {
            text: { path: "/user/welcomeMessage" },
          },
        },
      },
    ],
  },
};

const dataModelUpdate = {
  dataModelUpdate: {
    surfaceId: "main_content",
    path: "/user",
    contents: [
      { key: "name", valueString: "张三" },
      { key: "age", valueNumber: 28 },
      { key: "isVerified", valueBoolean: true },
      {
        key: "address",
        valueMap: [
          { key: "city", valueString: "北京" },
          { key: "district", valueString: "海淀区" },
          { key: "street", valueString: "中关村大街1号" },
        ],
      },
      {
        key: "tags",
        valueArray: [{ valueString: "开发者" }, { valueString: "AI爱好者" }],
      },
    ],
  },
};

const beginRendering = {
  beginRendering: {
    surfaceId: "main_content",
    root: "root_component_id",
    catalog: "material-design-v1",
  },
};

const exampleOutput = {
  message: "以下是在纽约top2餐厅。",
  ui: [{"beginRendering":{"surfaceId":"default","root":"root-column","styles":{"primaryColor":"#FF0000","font":"Roboto"}}},{"surfaceUpdate":{"surfaceId":"default","components":[{"id":"root-column","component":{"Column":{"children":{"explicitList":["title-heading","item-list"]}}}},{"id":"title-heading","component":{"Text":{"usageHint":"h1","text":{"literalString":"Top Restaurants"}}}},{"id":"item-list","component":{"List":{"direction":"vertical","children":{"template":{"componentId":"item-card-template","dataBinding":"/items"}}}}},{"id":"item-card-template","component":{"Card":{"child":"card-layout"}}},{"id":"card-layout","component":{"Row":{"children":{"explicitList":["template-image","card-details"]}}}},{"id":"template-image","weight":1,"component":{"Image":{"url":{"path":"imageUrl"}}}},{"id":"card-details","weight":2,"component":{"Column":{"children":{"explicitList":["template-name","template-rating","template-detail","template-link","template-book-button"]}}}},{"id":"template-name","component":{"Text":{"usageHint":"h3","text":{"path":"name"}}}},{"id":"template-rating","component":{"Text":{"text":{"path":"rating"}}}},{"id":"template-detail","component":{"Text":{"text":{"path":"detail"}}}},{"id":"template-link","component":{"Text":{"text":{"path":"infoLink"}}}},{"id":"template-book-button","component":{"Button":{"child":"book-now-text","primary":true,"action":{"name":"book_restaurant","context":[{"key":"restaurantName","value":{"path":"name"}},{"key":"imageUrl","value":{"path":"imageUrl"}},{"key":"address","value":{"path":"address"}}]}}}},{"id":"book-now-text","component":{"Text":{"text":{"literalString":"Book Now"}}}}]}},{"dataModelUpdate":{"surfaceId":"default","path":"/","contents":[{"key":"items","valueMap":[{"key":"item1","valueMap":[{"key":"name","valueString":"Xi'an Famous Foods"},{"key":"rating","valueString":"★★★★☆"},{"key":"detail","valueString":"Spicy and savory hand-pulled noodles."},{"key":"infoLink","valueString":"[More Info](https://www.xianfoods.com/)"},{"key":"imageUrl","valueString":"http://localhost:10002/static/shrimpchowmein.jpeg"},{"key":"address","valueString":"81 St Marks Pl, New York, NY 10003"}]},{"key":"item2","valueMap":[{"key":"name","valueString":"Han Dynasty"},{"key":"rating","valueString":"★★★★☆"},{"key":"detail","valueString":"Authentic Szechuan cuisine."},{"key":"infoLink","valueString":"[More Info](https://www.handynasty.net/)"},{"key":"imageUrl","valueString":"http://localhost:10002/static/mapotofu.jpeg"},{"key":"address","valueString":"90 3rd Ave, New York, NY 10003"}]},]}]}}]}

const finalPrompt = `
### 任务
您是通用助手。您的最终输出必须是JSON 响应。

### 输出规范
标准规范，请遵守：
{
  "message": "您的对话文本回复",
  "ui": [
    { "beginRendering": { "surfaceId": "string", "root": "string" } },// 触发渲染
    { "surfaceUpdate": { "surfaceId": "string", "components": [ ... ] } },//定义或更新 UI 组件，这个属性很重要
    { "dataModelUpdate": { "surfaceId": "string", "path": "string", "value": any } },//更新数据/状态（与UI解耦
  ]
}

### 说明
1. message是你的对话文本回复。
2. UI是一个原始 JSON 对象，它是 A2UI 消息的列表，用于定义和更新用户界面。
3. UI的数据结构必须遵循以下schema，请勿违反。

----A2UI JSON SCHEMA---
surfaceUpdate:是最核心的消息类型，用于定义 UI 的结构。
参考结构：${surfaceUpdate}
字段说明
surfaceId	string	必须	UI 表面的唯一标识符（省略则使用默认表面）
components	array	必须	组件定义数组
components[].id	string	必须	组件实例的唯一 ID（用于父子引用）
components[].component	object	必须	组件类型和属性的定义



dataModelUpdate 数据模型中的值可通过数据绑定反映到 UI 上。
参考结构：${dataModelUpdate}
字段说明
surfaceId	string	必须	UI 表面的唯一标识符
path	string	可选	数据模型中的路径，例如（/user/name）,省略则更新根节点
contents	array	必须	数据定义数组
contents[].key	string	必须	数据项的键
contents[].valueString	string	可选	例如：{ "key": "name", "valueString": "张三" }
contents[].valueNumber	number	可选	例如：{ "key": "age", "valueNumber": 28 }
contents[].valueBoolean	boolean	可选	例如：{ "key": "active", "valueBoolean": true }
contents[].valueArray	对象数组  可选 
contents[].valueMap	    对象数组  可选	
contents[].valueArray	对象数组  可选 



beginRendering 消息通知客户端已有足够信息进行初始渲染。
参考结构：${beginRendering}
字段说明
字段	类型	必需	说明
surfaceId	string	必须	目标 UI 表面
root	string	必须	根组件的 ID
catalog	string	必须	使用的组件目录名称


---surfaceUpdate/components组件结构补充说明---
【组件对象结构】
每个组件定义由两部分组成：
{
  "id": "my_component",
  "component": {
    "ComponentType": {
      "property1": "value1",
      "property2": "value2"
    }
  }
}

| 字段     | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| id       | 唯一标识符，用于父子引用（如 header、submit_btn）|
| component| 包装对象，包含恰好一个键表示组件类型（如 Text、Button）|

【容器组件的子元素定义】
容器组件（Row、Column、List 等）通过 children 对象定义子元素，支持两种方式：

1. explicitList - 静态子元素列表
用于预先知道所有子元素的场景：
{
  "Column": {
    "children": {
      "explicitList": ["header", "content", "footer"]
    }
  }
}


2. template - 动态列表渲染
用于从数据模型动态生成子元素的场景：
{
  "List": {
    "children": {
      "template": {
        "dataBinding": "/items",
        "componentId": "item_template"
      }
    }
  }
}


### 常用组件类型参考

| 组件类型      | 用途               | 主要属性                     |
| ------------- | ------------------ | ---------------------------- |
| Text          | 文本显示           | text、usageHint（h1/h2/h3/body） |
| Button        | 可点击按钮         | label、action、child         |
| Row           | 水平布局容器       | children、alignment          |
| Column        | 垂直布局容器       | children、alignment          |
| Card          | 卡片容器           | child                        |
| Image         | 图片显示           | url、alt                     |
| List          | 列表容器           | children（支持 template）|
| DateTimeInput | 日期时间输入       | label、value、enableDate     |
| TextField     | 文本输入框         | label、value、placeholder    |
| Checkbox      | 复选框             | label、value                 |

【Text 组件示例】
{
  "id": "page_title",
  "component": {
    "Text": {
      "text": { "literalString": "A2UI 协议入门教程" },
      "usageHint": "h1"
    }
  }
}


【Button 组件示例】（带交互动作）：

{
  "id": "submit_btn",
  "component": {
    "Button": {
      "child": "btn_label",
      "action": {
        "name": "submit_form",
        "context": [
          { "key": "formData", "value": { "path": "/form" } }
        ]
      }
    }
  }
}


### 示例
${exampleOutput}


### 总体输出规则 
⚠️ 输出任何非 JSON 内容都被视为严重错误。
1. 仅输出【纯文本JSON】，无任何额外内容（无说明、无注释、无Markdown、无空行、无多余换行/空格）；
2. JSON紧凑排版，仅保留语法必需的字符，禁止空行、禁止多余换行、禁止缩进；
3. JSON语法严格合法（无缺冒号、无多余逗号、引号闭合）
4. 输出的json能被json.parse解析

`;
export function buildSystemPrompt(extra?: string) {
  return [finalPrompt, extra].filter(Boolean).join("\n\n");
}
