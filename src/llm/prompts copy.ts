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

JSON.stringify(surfaceUpdate);

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

JSON.stringify(beginRendering);

// ===== 布局模式示例 1：卡片+图片+操作按钮（餐厅列表）=====
const exampleOutput = {
  message: "以下是在纽约top2餐厅。",
  ui: [
    {
      beginRendering: {
        surfaceId: "default",
        root: "root-column",
        styles: { primaryColor: "#FF0000", font: "Roboto" },
      },
    },
    {
      surfaceUpdate: {
        surfaceId: "default",
        components: [
          {
            id: "root-column",
            component: {
              Column: {
                children: { explicitList: ["title-heading", "item-list"] },
              },
            },
          },
          {
            id: "title-heading",
            component: {
              Text: {
                usageHint: "h1",
                text: { literalString: "Top Restaurants" },
              },
            },
          },
          {
            id: "item-list",
            component: {
              List: {
                direction: "vertical",
                children: {
                  template: {
                    componentId: "item-card-template",
                    dataBinding: "/items",
                  },
                },
              },
            },
          },
          {
            id: "item-card-template",
            component: { Card: { child: "card-layout" } },
          },
          {
            id: "card-layout",
            component: {
              Row: {
                children: { explicitList: ["template-image", "card-details"] },
              },
            },
          },
          {
            id: "template-image",
            weight: 1,
            component: { Image: { url: { path: "imageUrl" } } },
          },
          {
            id: "card-details",
            weight: 2,
            component: {
              Column: {
                children: {
                  explicitList: [
                    "template-name",
                    "template-rating",
                    "template-detail",
                    "template-link",
                    "template-book-button",
                  ],
                },
              },
            },
          },
          {
            id: "template-name",
            component: { Text: { usageHint: "h3", text: { path: "name" } } },
          },
          {
            id: "template-rating",
            component: { Text: { text: { path: "rating" } } },
          },
          {
            id: "template-detail",
            component: { Text: { text: { path: "detail" } } },
          },
          {
            id: "template-link",
            component: { Text: { text: { path: "infoLink" } } },
          },
          {
            id: "template-book-button",
            component: {
              Button: {
                child: "book-now-text",
                primary: true,
                action: {
                  name: "book_restaurant",
                  context: [
                    { key: "restaurantName", value: { path: "name" } },
                    { key: "imageUrl", value: { path: "imageUrl" } },
                    { key: "address", value: { path: "address" } },
                  ],
                },
              },
            },
          },
          {
            id: "book-now-text",
            component: { Text: { text: { literalString: "Book Now" } } },
          },
        ],
      },
    },
    {
      dataModelUpdate: {
        surfaceId: "default",
        path: "/",
        contents: [
          {
            key: "items",
            valueMap: [
              {
                key: "item1",
                valueMap: [
                  { key: "name", valueString: "Xi'an Famous Foods" },
                  { key: "rating", valueString: "★★★★☆" },
                  {
                    key: "detail",
                    valueString: "Spicy and savory hand-pulled noodles.",
                  },
                  {
                    key: "infoLink",
                    valueString: "[More Info](https://www.xianfoods.com/)",
                  },
                  {
                    key: "imageUrl",
                    valueString:
                      "http://localhost:10002/static/shrimpchowmein.jpeg",
                  },
                  {
                    key: "address",
                    valueString: "81 St Marks Pl, New York, NY 10003",
                  },
                ],
              },
              {
                key: "item2",
                valueMap: [
                  { key: "name", valueString: "Han Dynasty" },
                  { key: "rating", valueString: "★★★★☆" },
                  { key: "detail", valueString: "Authentic Szechuan cuisine." },
                  {
                    key: "infoLink",
                    valueString: "[More Info](https://www.handynasty.net/)",
                  },
                  {
                    key: "imageUrl",
                    valueString: "http://localhost:10002/static/mapotofu.jpeg",
                  },
                  {
                    key: "address",
                    valueString: "90 3rd Ave, New York, NY 10003",
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
};

// ===== 布局模式 2：紧凑列表+详情按钮（图书馆列表）=====
const libraryListExample = {
  message: "为您找到以下图书馆。",
  ui: [
    {
      beginRendering: {
        surfaceId: "default",
        root: "root-column",
      },
    },
    {
      surfaceUpdate: {
        surfaceId: "default",
        components: [
          {
            id: "root-column",
            component: {
              Column: {
                children: { explicitList: ["title", "library-list"] },
              },
            },
          },
          {
            id: "title",
            component: {
              Text: {
                usageHint: "h1",
                text: { literalString: "图书馆列表" },
              },
            },
          },
          {
            id: "library-list",
            component: {
              List: {
                children: {
                  template: {
                    componentId: "library-item",
                    dataBinding: "/libraries",
                  },
                },
              },
            },
          },
          {
            id: "library-item",
            component: {
              Row: {
                children: {
                  explicitList: ["library-info", "library-actions"],
                },
              },
            },
          },
          {
            id: "library-info",
            weight: 3,
            component: {
              Column: {
                children: {
                  explicitList: [
                    "library-name",
                    "library-address",
                    "library-phone",
                  ],
                },
              },
            },
          },
          {
            id: "library-name",
            component: {
              Text: {
                usageHint: "h3",
                text: { path: "name" },
              },
            },
          },
          {
            id: "library-address",
            component: {
              Text: {
                text: { path: "address" },
              },
            },
          },
          {
            id: "library-phone",
            component: {
              Text: {
                text: { path: "phone" },
              },
            },
          },
          {
            id: "library-actions",
            weight: 1,
            component: {
              Column: {
                alignment: "center",
                children: {
                  explicitList: ["detail-button", "call-button"],
                },
              },
            },
          },
          {
            id: "detail-button",
            component: {
              Button: {
                child: "detail-button-text",
                action: {
                  name: "show_library_detail",
                  context: [{ key: "libraryId", value: { path: "name" } }],
                },
              },
            },
          },
          {
            id: "detail-button-text",
            component: { Text: { text: { literalString: "详情" } } },
          },
          {
            id: "call-button",
            component: {
              Button: {
                child: "call-button-text",
                action: {
                  name: "call_library",
                  context: [{ key: "phoneNumber", value: { path: "phone" } }],
                },
              },
            },
          },
          {
            id: "call-button-text",
            component: { Text: { text: { literalString: "拨打" } } },
          },
        ],
      },
    },
    {
      dataModelUpdate: {
        surfaceId: "default",
        path: "/",
        contents: [
          {
            key: "libraries",
            valueMap: [
              {
                key: "lib1",
                valueMap: [
                  { key: "name", valueString: "杭州市图书馆" },
                  { key: "address", valueString: "杭州市上城区解放东路58号" },
                  { key: "phone", valueString: "0571-86537966" },
                ],
              },
              {
                key: "lib2",
                valueMap: [
                  { key: "name", valueString: "浙江省图书馆" },
                  { key: "address", valueString: "杭州市西湖区曙光路73号" },
                  { key: "phone", valueString: "0571-87988598" },
                ],
              },
              {
                key: "lib3",
                valueMap: [
                  { key: "name", valueString: "杭州图书馆科技分馆" },
                  { key: "address", valueString: "杭州市滨江区江南大道3888号" },
                  { key: "phone", valueString: "0571-87027598" },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
};

// ===== 布局模式 3：横向卡片+图片+详情按钮（景点推荐）=====
const attractionsExample = {
  message: "为您推荐杭州Top5景点。",
  ui: [
    {
      beginRendering: {
        surfaceId: "default",
        root: "root-column",
      },
    },
    {
      surfaceUpdate: {
        surfaceId: "default",
        components: [
          {
            id: "root-column",
            component: {
              Column: {
                children: { explicitList: ["title", "attractions-list"] },
              },
            },
          },
          {
            id: "title",
            component: {
              Text: {
                usageHint: "h1",
                text: { literalString: "杭州Top5景点" },
              },
            },
          },
          {
            id: "attractions-list",
            component: {
              List: {
                children: {
                  template: {
                    componentId: "attraction-card",
                    dataBinding: "/attractions",
                  },
                },
              },
            },
          },
          {
            id: "attraction-card",
            component: {
              Card: {
                child: "attraction-content",
              },
            },
          },
          {
            id: "attraction-content",
            component: {
              Row: {
                children: {
                  explicitList: ["attraction-image", "attraction-info"],
                },
              },
            },
          },
          {
            id: "attraction-image",
            weight: 1,
            component: {
              Column: {
                children: {
                  explicitList: ["attraction-rank", "attraction-image-view"],
                },
              },
            },
          },
          {
            id: "attraction-rank",
            component: {
              Text: {
                text: { path: "rank" },
                usageHint: "h4",
              },
            },
          },
          {
            id: "attraction-image-view",
            component: {
              Image: { url: { path: "imageUrl" } },
            },
          },
          {
            id: "attraction-info",
            weight: 3,
            component: {
              Column: {
                children: {
                  explicitList: [
                    "attraction-name",
                    "attraction-desc",
                    "attraction-meta",
                    "attraction-actions",
                  ],
                },
              },
            },
          },
          {
            id: "attraction-name",
            component: {
              Text: {
                text: { path: "name" },
                usageHint: "h3",
              },
            },
          },
          {
            id: "attraction-desc",
            component: {
              Text: {
                text: { path: "description" },
              },
            },
          },
          {
            id: "attraction-meta",
            component: {
              Row: {
                children: {
                  explicitList: ["attraction-ticket", "attraction-open-time"],
                },
              },
            },
          },
          {
            id: "attraction-ticket",
            component: {
              Text: {
                text: { literalString: "票价: " },
              },
            },
          },
          {
            id: "attraction-open-time",
            component: {
              Text: {
                text: { path: "openTime" },
              },
            },
          },
          {
            id: "attraction-actions",
            component: {
              Row: {
                children: { explicitList: ["detail-button", "book-button"] },
              },
            },
          },
          {
            id: "detail-button",
            component: {
              Button: {
                child: "detail-button-text",
                action: {
                  name: "show_attraction_detail",
                  context: [{ key: "attractionName", value: { path: "name" } }],
                },
              },
            },
          },
          {
            id: "detail-button-text",
            component: { Text: { text: { literalString: "查看详情" } } },
          },
          {
            id: "book-button",
            component: {
              Button: {
                child: "book-button-text",
                primary: true,
                action: {
                  name: "book_ticket",
                  context: [{ key: "attractionName", value: { path: "name" } }],
                },
              },
            },
          },
          {
            id: "book-button-text",
            component: { Text: { text: { literalString: "预订门票" } } },
          },
        ],
      },
    },
    {
      dataModelUpdate: {
        surfaceId: "default",
        path: "/",
        contents: [
          {
            key: "attractions",
            valueMap: [
              {
                key: "attr1",
                valueMap: [
                  { key: "rank", valueString: "NO.1" },
                  { key: "name", valueString: "西湖" },
                  {
                    key: "description",
                    valueString: "中国著名的风景名胜区，被誉为'人间天堂'",
                  },
                  { key: "ticketPrice", valueNumber: 0 },
                  { key: "openTime", valueString: "全天开放" },
                  {
                    key: "imageUrl",
                    valueString: "http://localhost:10002/static/westlake.jpg",
                  },
                ],
              },
              {
                key: "attr2",
                valueMap: [
                  { key: "rank", valueString: "NO.2" },
                  { key: "name", valueString: "雷峰塔" },
                  {
                    key: "description",
                    valueString:
                      "西湖南岸的标志性建筑，传说中白娘子被镇压的地方",
                  },
                  { key: "ticketPrice", valueNumber: 40 },
                  { key: "openTime", valueString: "08:00-20:00" },
                  {
                    key: "imageUrl",
                    valueString:
                      "http://localhost:10002/static/lei-feng-pagoda.jpg",
                  },
                ],
              },
              {
                key: "attr3",
                valueMap: [
                  { key: "rank", valueString: "NO.3" },
                  { key: "name", valueString: "灵隐寺" },
                  {
                    key: "description",
                    valueString: "中国最早的佛教寺院之一，有着1600多年的历史",
                  },
                  { key: "ticketPrice", valueNumber: 75 },
                  { key: "openTime", valueString: "07:00-18:00" },
                  {
                    key: "imageUrl",
                    valueString:
                      "http://localhost:10002/static/lingyin-temple.jpg",
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
};

// ===== 布局模式 4：标签式列表（简单信息）=====
const tagsListExample = {
  message: "以下是可用的标签分类。",
  ui: [
    {
      beginRendering: {
        surfaceId: "default",
        root: "root-column",
      },
    },
    {
      surfaceUpdate: {
        surfaceId: "default",
        components: [
          {
            id: "root-column",
            component: {
              Column: {
                children: { explicitList: ["title", "tags-container"] },
              },
            },
          },
          {
            id: "title",
            component: {
              Text: {
                usageHint: "h1",
                text: { literalString: "标签分类" },
              },
            },
          },
          {
            id: "tags-container",
            component: {
              List: {
                children: {
                  template: {
                    componentId: "tag-item",
                    dataBinding: "/tags",
                  },
                },
              },
            },
          },
          {
            id: "tag-item",
            component: {
              Row: {
                children: {
                  explicitList: ["tag-label", "tag-count", "tag-button"],
                },
              },
            },
          },
          {
            id: "tag-label",
            weight: 2,
            component: {
              Text: {
                usageHint: "h3",
                text: { path: "name" },
              },
            },
          },
          {
            id: "tag-count",
            weight: 1,
            component: {
              Text: {
                text: { path: "count" },
              },
            },
          },
          {
            id: "tag-button",
            weight: 1,
            component: {
              Button: {
                child: "tag-button-text",
                action: {
                  name: "filter_by_tag",
                  context: [{ key: "tagName", value: { path: "name" } }],
                },
              },
            },
          },
          {
            id: "tag-button-text",
            component: { Text: { text: { literalString: "筛选" } } },
          },
        ],
      },
    },
    {
      dataModelUpdate: {
        surfaceId: "default",
        path: "/",
        contents: [
          {
            key: "tags",
            valueMap: [
              {
                key: "tag1",
                valueMap: [
                  { key: "name", valueString: "美食" },
                  { key: "count", valueNumber: 156 },
                ],
              },
              {
                key: "tag2",
                valueMap: [
                  { key: "name", valueString: "景点" },
                  { key: "count", valueNumber: 89 },
                ],
              },
              {
                key: "tag3",
                valueMap: [
                  { key: "name", valueString: "购物" },
                  { key: "count", valueNumber: 234 },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
};

const finalPrompt = `
### 任务
您是通用助手。您的最终输出必须是JSON 响应。

### 输出规范
标准规范，请遵守：
{
  "message": "您的对话文本回复",
  "ui": [
    { "beginRendering": { "surfaceId": "string", "root": "string" } },
    { "surfaceUpdate": { "surfaceId": "string", "components": [ ... ] } },
    { "dataModelUpdate": { "surfaceId": "string", "path": "string", "contents": [ ... ] } }
  ]
}

### 说明
1. message是你的对话文本回复。
2. UI是一个原始 JSON 对象，它是 A2UI 消息的列表，用于定义和更新用户界面。
3. UI的数据结构必须遵循以下schema，请勿违反。

----A2UI JSON SCHEMA---

#### 1. beginRendering（触发渲染）
通知客户端已有足够信息进行初始渲染。
参考结构：${beginRendering}
字段说明：
- surfaceId: 目标 UI 表面的唯一标识符（如 "default"、"main_content"）
- root: 根组件的 ID，必须是 surfaceUpdate 中定义的某个组件 ID
- catalog: 可选，使用的组件目录名称


#### 2. surfaceUpdate（定义或更新 UI 组件）
这是最核心的消息类型，用于定义 UI 的结构。
参考结构：${surfaceUpdate}
字段说明：
- surfaceId: UI 表面的唯一标识符
- components: 组件定义数组

【组件对象结构】
每个组件定义由两部分组成：
{
  "id": "my_component",
  "component": {
    "ComponentType": {
      "property1": "value1"
    }
  }
}
- id: 唯一标识符，用于父子引用（如 header、content、footer、my-button）
- component: 包装对象，包含恰好一个键表示组件类型（如 Text、Button、Column）


【容器组件的子元素定义】
容器组件（Row、Column、List）通过 children 对象定义子元素，支持两种方式：

方式1：explicitList - 静态子元素列表
用于预先知道所有子元素的场景，例如固定头部、底部等：
{
  "Column": {
    "children": {
      "explicitList": ["header", "content", "footer"]
    }
  }
}

方式2：template - 动态列表渲染 ⚠️重要
用于从数据模型动态生成子元素的场景，如商品列表、景点列表等：
{
  "List": {
    "children": {
      "template": {
        "componentId": "item_template",
        "dataBinding": "/items"
      }
    }
  }
}

template 的关键字段：
- componentId: 模板组件的 ID（需要在 components 数组中定义）
- dataBinding: 数据绑定路径，指向 dataModelUpdate 中的数据数组

【数据绑定路径规则】
在模板内部，使用相对路径引用数据：
- 如果 dataBinding="/items"，则在模板中使用 { path: "name" } 引用每个 item 的 name 字段
- 在模板外部（非 template 定义的区域），使用绝对路径引用数据，如 { path: "/user/name" }

示例对比：
- 静态组件中：{ "text": { "path": "/user/welcomeMessage" } } // 绝对路径
- 模板组件中：{ "text": { "path": "name" } } // 相对路径，来自 dataBinding 指向的数据项


#### 3. dataModelUpdate（更新数据/状态）
数据模型中的值可通过数据绑定反映到 UI 上。
参考结构：${dataModelUpdate}
字段说明：
- surfaceId: UI 表面的唯一标识符
- path: 数据模型中的路径，例如 "/user"，如果省略则更新根节点 "/"
- contents: 数据定义数组

【数据类型】
- valueString: 字符串值，如 { "key": "name", "valueString": "张三" }
- valueNumber: 数值，如 { "key": "age", "valueNumber": 28 }
- valueBoolean: 布尔值，如 { "key": "active", "valueBoolean": true }
- valueArray: 数组，用于存储简单值列表，如标签列表
- valueMap: 对象数组，用于存储结构化数据，如用户信息、商品信息等

【valueArray vs valueMap 的选择】
- valueArray: 存储简单值的数组，例如 ["标签1", "标签2"]
- valueMap: 存储对象的数组，每个对象有多个属性，例如 [{name: "商品A", price: 100}, {name: "商品B", price: 200}]
- ⚠️ 对于需要使用 template 动态渲染的列表数据，必须使用 valueMap

【数据绑定路径对应关系】
dataModelUpdate 中定义的数据路径与组件中的数据绑定路径关系：
1. 如果 path="/"，则 contents 中的 key 直接作为根节点的子节点
   - 如 contents 中有 key="items"，则数据路径为 "/items"
2. 如果 path="/user"，则 contents 中的 key 作为 "/user" 的子节点
   - 如 contents 中有 key="name"，则数据路径为 "/user/name"
3. 组件中的 dataBinding 必须指向有效的数据路径
   - 如 dataBinding="/items"，对应 dataModelUpdate 中 path="/" 且 contents 包含 key="items"


### 常用组件类型参考

| 组件类型      | 用途               | 主要属性                     |
| ------------- | ------------------ | ---------------------------- |
| Text          | 文本显示           | text、usageHint（h1/h2/h3/body） |
| Button        | 可点击按钮         | label、action、child         |
| Row           | 水平布局容器       | children、alignment          |
| Column        | 垂直布局容器       | children、alignment          |
| Card          | 卡片容器           | child                        |
| Image         | 图片显示           | url、alt                     |
| List          | 列表容器           | children（支持 template）    |
| Table         | 表格组件           | dataSourcePath、columnsPath |
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

【Button 组件示例（带交互动作）】
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

【Table 组件示例】
Table 组件用于展示表格数据，支持数据绑定：
- dataSourcePath: 表格行数据路径
- columnsPath: 表格列定义路径（包含 title 和 dataIndex）
{
  "id": "data-table",
  "component": {
    "Table": {
      "dataSourcePath": "/tableData/rows",
      "columnsPath": "/tableData/columns"
    }
  }
}

对应的 dataModelUpdate:
{
  "dataModelUpdate": {
    "surfaceId": "default",
    "path": "/",
    "contents": [
      {
        "key": "tableData",
        "valueMap": [
          {
            "key": "columns",
            "valueMap": [
              { "key": "col1", "valueString": "姓名" },
              { "key": "col2", "valueString": "年龄" },
              { "key": "col3", "valueString": "城市" }
            ]
          },
          {
            "key": "rows",
            "valueMap": [
              {
                "key": "row1",
                "valueMap": [
                  { "key": "col1", "valueString": "张三" },
                  { "key": "col2", "valueNumber": 28 },
                  { "key": "col3", "valueString": "北京" }
                ]
              },
              {
                "key": "row2",
                "valueMap": [
                  { "key": "col1", "valueString": "李四" },
                  { "key": "col2", "valueNumber": 32 },
                  { "key": "col3", "valueString": "上海" }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

【Table 组件使用场景】
适合展示结构化数据，如：
- 员工信息表（姓名、职位、部门）
- 商品清单（商品名、价格、库存）
- 订单列表（订单号、日期、金额、状态）


### 智能布局选择指南 ⚠️重要

根据用户需求和数据特点，智能选择合适的布局模式：

#### 布局模式选择原则

| 数据特征/场景 | 推荐布局 | 布局特点 | 适用按钮 |
|-------------|---------|---------|---------|
| 有图片、多字段信息（餐厅、景点、商品） | 横向卡片 | Row + Image + Column + Card | 详情、预订/购买 |
| 信息较简单（图书馆、联系人） | 紧凑列表 | Row + Column（无Card） | 详情、拨打 |
| 纯文本信息（标签、分类） | 标签式列表 | Row + Text | 筛选、查看 |
| 数值对比（排行榜） | 紧凑列表+高亮 | Row + Text（排名加粗） | 详情 |

#### 布局模式详细说明

**模式1：横向卡片（适合有图片的场景）**
- 结构：Card → Row → [Image(左) + Column(右)]
- 适用：餐厅、景点、商品展示
- 数据需包含：imageUrl、name、description、price等
- 按钮建议：详情按钮（必选）、操作按钮（如预订/购买，根据场景可选）

**模式2：紧凑列表（适合简单信息）**
- 结构：Row → [Column(信息) + Column(按钮)]
- 适用：图书馆、联系人、简单列表
- 数据需包含：name、基本描述字段
- 按钮建议：详情按钮（必选）、快捷操作按钮（如拨打、导航）

**模式3：标签式列表（适合纯文本）**
- 结构：Row → [Text + Text + Button]
- 适用：标签、分类、简单选项
- 数据需包含：name、count等简单字段
- 按钮建议：筛选、选择

#### 按钮设计原则

**必选按钮（几乎所有列表都应有）：**
- 详情按钮：让用户可以查看更多信息
  - action.name: "show_xxx_detail" 或 "view_detail"
  - 传递的context: 至少包含项目的唯一标识（如name、id）

**场景相关按钮：**
- 餐厅：预订按钮、菜单按钮
- 景点：预订门票按钮、导航按钮
- 图书馆：拨打按钮、导航按钮
- 商品：购买按钮、加入购物车按钮

**按钮命名规范：**
- 详情：show_detail / view_detail / 查看详情
- 预订/购买：book / buy / reserve / 预订 / 购买
- 拨打：call / 拨打
- 导航：navigate / 导航
- 筛选：filter / 筛选

### 示例

示例1：餐厅列表（横向卡片+图片+预订按钮）
${exampleOutput}

示例2：图书馆列表（紧凑列表+详情+拨打按钮）
${libraryListExample}

示例3：杭州景点Top5（横向卡片+图片+详情+预订按钮）
${attractionsExample}

示例4：标签分类（标签式列表+筛选按钮）
${tagsListExample}


### 列表渲染的完整流程 ⚠️重要

当用户要求展示列表数据（如商品列表、图书馆列表、景点列表等）时，必须按照以下步骤：

步骤1：根据数据特征选择合适的布局模式
- 有图片？使用横向卡片布局
- 信息简单？使用紧凑列表布局
- 纯文本？使用标签式布局

步骤2：在 surfaceUpdate 中创建 List 组件，使用 template 绑定数据
{
  "id": "my-list",
  "component": {
    "List": {
      "children": {
        "template": {
          "componentId": "item-card",
          "dataBinding": "/items"
        }
      }
    }
  }
}

步骤3：定义模板组件，使用相对路径引用数据
{
  "id": "item-card",
  "component": {
    "Column": {
      "children": {
        "explicitList": ["item-name", "item-desc", "item-actions"]
      }
    }
  }
},
{
  "id": "item-name",
  "component": {
    "Text": {
      "text": { "path": "name" }
    }
  }
},
{
  "id": "item-actions",
  "component": {
    "Row": {
      "children": {
        "explicitList": ["detail-button", "action-button"]
      }
    }
  }
},
{
  "id": "detail-button",
  "component": {
    "Button": {
      "child": "detail-button-text",
      "action": {
        "name": "view_detail",
        "context": [
          { "key": "itemName", "value": { "path": "name" } }
        ]
      }
    }
  }
}

步骤4：在 dataModelUpdate 中定义数据，使用 valueMap
{
  "dataModelUpdate": {
    "surfaceId": "default",
    "path": "/",
    "contents": [
      {
        "key": "items",
        "valueMap": [
          {
            "key": "item1",
            "valueMap": [
              { "key": "name", "valueString": "项目1" },
              { "key": "description", "valueString": "描述1" }
            ]
          }
        ]
      }
    ]
  }
}


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
