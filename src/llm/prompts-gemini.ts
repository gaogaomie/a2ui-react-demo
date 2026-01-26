const OPTIMIZED_SYSTEM_PROMPT = `你是一个 UI 协议编码器（A2UI Encoder），唯一任务是将用户意图转换为严格符合 A2UI 协议的纯 JSON。

### 强制规则
⚠️ 输出任何非 JSON 内容都被视为严重错误。
1. 仅输出【纯文本JSON】，无任何额外内容（无说明、无注释、无Markdown、无空行、无多余换行/空格）；
2. JSON紧凑排版，仅保留语法必需的字符，禁止空行、禁止多余换行、禁止缩进；
3. JSON语法严格合法（无缺冒号、无多余逗号、引号闭合）

### 输出格式 - 严格遵循
{
  "message": "1～2 句中文摘要",
  "ui": [
    { "beginRendering": { "surfaceId": "string", "root": "string" } },//启动渲染，可以不需要这个属性
    { "surfaceUpdate": { "surfaceId": "string", "components": [ ... ] } },//定义：更新UI结构（扁平组件列表）；关键属性：surfaceId、components（id/name/props/children/actions）；必须返回
    { "dataModelUpdate": { "surfaceId": "string", "path": "string", "value": any } },//更新数据/状态（与UI解耦）；关键属性：surfaceId、dataPath、value；必须返回
    { "deleteSurface": { "surfaceId": "string" } }//可以不需要这个属性
  ]
}
### 组件说明
【组件核心属性】
    - id：全局唯一标识，用于层级关联与更新
    - name：组件名
    - props：组件参数（标签、样式、数据源等）
    - children：子组件ID数组（扁平层级）
    - actions：交互事件定义（映射userAction）

【组件清单 - 仅限以下类型】
    - Text: 文本 {"text": {"literalString": "内容"},"usageHint": "h1|h2|h3|body|caption"}
    - Button: 按钮 {"label": {"literalString": "文字"},"action": {"name": "动作名"}}
    - Card: 卡片容器 {"child": "子组件ID"}
    - Row: 水平布局 {"children": {"explicitList": ["id1","id2"]}}
    - Column: 垂直布局 {"children": {"explicitList": ["id1","id2"]}}
    - List: 列表 {"children": {"explicitList": ["id1","id2"]}}

【关键约束】
- 所有组件必须有唯一 "id" 和 "component" 字段
- 根布局组件 id 必须为 "root"
- 禁止使用 Image、Input 等未列出的组件
- dataModelUpdate 使用 "path" 和 "value"（不是 contents/valueMap！）

【示例参考（仅结构，勿照搬数据）】
- 用户需求：
查找下top 5的餐厅

- 输出：
{
   message:"以下是查找的结果",
   "ui":[{
    "beginRendering": {
        "surfaceId": "default",
        "root": "root-column",
        "styles": {
            "primaryColor": "#FF0000",
            "font": "Roboto"
        }
    }
},
  {
    "surfaceUpdate": {
        "surfaceId": "default",
        "components": [
            {
                "id": "root-column",
                "component": {
                    "Column": {
                        "children": {
                            "explicitList": [
                                "title-heading",
                                "item-list"
                            ]
                        }
                    }
                }
            },
            {
                "id": "title-heading",
                "component": {
                    "Text": {
                        "usageHint": "h1",
                        "text": {
                            "literalString": "Top Restaurants"
                        }
                    }
                }
            },
            {
                "id": "item-list",
                "component": {
                    "List": {
                        "direction": "vertical",
                        "children": {
                            "template": {
                                "componentId": "item-card-template",
                                "dataBinding": "/items"
                            }
                        }
                    }
                }
            },
            {
                "id": "item-card-template",
                "component": {
                    "Card": {
                        "child": "card-layout"
                    }
                }
            },
            {
                "id": "card-layout",
                "component": {
                    "Row": {
                        "children": {
                            "explicitList": [
                                "template-image",
                                "card-details"
                            ]
                        }
                    }
                }
            },
            {
                "id": "template-image",
                "weight": 1,
                "component": {
                    "Image": {
                        "url": {
                            "path": "imageUrl"
                        }
                    }
                }
            },
            {
                "id": "card-details",
                "weight": 2,
                "component": {
                    "Column": {
                        "children": {
                            "explicitList": [
                                "template-name",
                                "template-rating",
                                "template-detail",
                                "template-link",
                                "template-book-button"
                            ]
                        }
                    }
                }
            },
            {
                "id": "template-name",
                "component": {
                    "Text": {
                        "usageHint": "h3",
                        "text": {
                            "path": "name"
                        }
                    }
                }
            },
            {
                "id": "template-rating",
                "component": {
                    "Text": {
                        "text": {
                            "path": "rating"
                        }
                    }
                }
            },
            {
                "id": "template-detail",
                "component": {
                    "Text": {
                        "text": {
                            "path": "detail"
                        }
                    }
                }
            },
            {
                "id": "template-link",
                "component": {
                    "Text": {
                        "text": {
                            "path": "infoLink"
                        }
                    }
                }
            },
            {
                "id": "template-book-button",
                "component": {
                    "Button": {
                        "child": "book-now-text",
                        "primary": true,
                        "action": {
                            "name": "book_restaurant",
                            "context": [
                                {
                                    "key": "restaurantName",
                                    "value": {
                                        "path": "name"
                                    }
                                },
                                {
                                    "key": "imageUrl",
                                    "value": {
                                        "path": "imageUrl"
                                    }
                                },
                                {
                                    "key": "address",
                                    "value": {
                                        "path": "address"
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            {
                "id": "book-now-text",
                "component": {
                    "Text": {
                        "text": {
                            "literalString": "Book Now"
                        }
                    }
                }
            }
        ]
    }
},{
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
                            {
                                "key": "name",
                                "valueString": "Xi'an Famous Foods"
                            },
                            {
                                "key": "rating",
                                "valueString": "★★★★☆"
                            },
                            {
                                "key": "detail",
                                "valueString": "Spicy and savory hand-pulled noodles."
                            },
                            {
                                "key": "infoLink",
                                "valueString": "[More Info](https://www.xianfoods.com/)"
                            },
                            {
                                "key": "imageUrl",
                                "valueString": "http://localhost:10002/static/shrimpchowmein.jpeg"
                            },
                            {
                                "key": "address",
                                "valueString": "81 St Marks Pl, New York, NY 10003"
                            }
                        ]
                    },
                    {
                        "key": "item2",
                        "valueMap": [
                            {
                                "key": "name",
                                "valueString": "Han Dynasty"
                            },
                            {
                                "key": "rating",
                                "valueString": "★★★★☆"
                            },
                            {
                                "key": "detail",
                                "valueString": "Authentic Szechuan cuisine."
                            },
                            {
                                "key": "infoLink",
                                "valueString": "[More Info](https://www.handynasty.net/)"
                            },
                            {
                                "key": "imageUrl",
                                "valueString": "http://localhost:10002/static/mapotofu.jpeg"
                            },
                            {
                                "key": "address",
                                "valueString": "90 3rd Ave, New York, NY 10003"
                            }
                        ]
                    },
                    {
                        "key": "item3",
                        "valueMap": [
                            {
                                "key": "name",
                                "valueString": "RedFarm"
                            },
                            {
                                "key": "rating",
                                "valueString": "★★★★☆"
                            },
                            {
                                "key": "detail",
                                "valueString": "Modern Chinese with a farm-to-table approach."
                            },
                            {
                                "key": "infoLink",
                                "valueString": "[More Info](https://www.redfarmnyc.com/)"
                            },
                            {
                                "key": "imageUrl",
                                "valueString": "http://localhost:10002/static/beefbroccoli.jpeg"
                            },
                            {
                                "key": "address",
                                "valueString": "529 Hudson St, New York, NY 10014"
                            }
                        ]
                    },
                    {
                        "key": "item4",
                        "valueMap": [
                            {
                                "key": "name",
                                "valueString": "Mott 32"
                            },
                            {
                                "key": "rating",
                                "valueString": "★★★★★"
                            },
                            {
                                "key": "detail",
                                "valueString": "Upscale Cantonese dining."
                            },
                            {
                                "key": "infoLink",
                                "valueString": "[More Info](https://mott32.com/newyork/)"
                            },
                            {
                                "key": "imageUrl",
                                "valueString": "http://localhost:10002/static/springrolls.jpeg"
                            },
                            {
                                "key": "address",
                                "valueString": "111 W 57th St, New York, NY 10019"
                            }
                        ]
                    },
                    {
                        "key": "item5",
                        "valueMap": [
                            {
                                "key": "name",
                                "valueString": "Hwa Yuan Szechuan"
                            },
                            {
                                "key": "rating",
                                "valueString": "★★★★☆"
                            },
                            {
                                "key": "detail",
                                "valueString": "Famous for its cold noodles with sesame sauce."
                            },
                            {
                                "key": "infoLink",
                                "valueString": "[More Info](https://hwayuannyc.com/)"
                            },
                            {
                                "key": "imageUrl",
                                "valueString": "http://localhost:10002/static/kungpao.jpeg"
                            },
                            {
                                "key": "address",
                                "valueString": "40 E Broadway, New York, NY 10002"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
]
  }
`;
// export function buildSystemPrompt(extra?: string) {
//   return [OPTIMIZED_SYSTEM_PROMPT, extra].filter(Boolean).join("\n\n");
// }

const A2UI_JSON_SCHEMA = {
  title: "A2UI Message Schema",
  description:
    "Describes a JSON payload for an A2UI (Agent to UI) message, which is used to dynamically construct and update user interfaces. A message MUST contain exactly ONE of the action properties: 'beginRendering', 'surfaceUpdate', 'dataModelUpdate', or 'deleteSurface'.",
  type: "object",
  properties: {
    beginRendering: {
      type: "object",
      description:
        "Signals the client to begin rendering a surface with a root component and specific styles.",
      properties: {
        surfaceId: {
          type: "string",
          description:
            "The unique identifier for the UI surface to be rendered.",
        },
        root: {
          type: "string",
          description: "The ID of the root component to render.",
        },
        styles: {
          type: "object",
          description: "Styling information for the UI.",
          properties: {
            font: {
              type: "string",
              description: "The primary font for the UI.",
            },
            primaryColor: {
              type: "string",
              description:
                "The primary UI color as a hexadecimal code (e.g., '#00BFFF').",
              pattern: "^#[0-9a-fA-F]{6}$",
            },
          },
        },
      },
      required: ["root", "surfaceId"],
    },
    surfaceUpdate: {
      type: "object",
      description: "Updates a surface with a new set of components.",
      properties: {
        surfaceId: {
          type: "string",
          description:
            "The unique identifier for the UI surface to be updated. If you are adding a new surface this *must* be a new, unique identified that has never been used for any existing surfaces shown.",
        },
        components: {
          type: "array",
          description: "A list containing all UI components for the surface.",
          minItems: 1,
          items: {
            type: "object",
            description:
              "Represents a *single* component in a UI widget tree. This component could be one of many supported types.",
            properties: {
              id: {
                type: "string",
                description: "The unique identifier for this component.",
              },
              weight: {
                type: "number",
                description:
                  "The relative weight of this component within a Row or Column. This corresponds to the CSS 'flex-grow' property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.",
              },
              component: {
                type: "object",
                description:
                  "A wrapper object that MUST contain exactly one key, which is the name of the component type (e.g., 'Heading'). The value is an object containing the properties for that specific component.",
                properties: {
                  Text: {
                    type: "object",
                    properties: {
                      text: {
                        type: "object",
                        description:
                          "The text content to display. This can be a literal string or a reference to a value in the data model ('path', e.g., '/doc/title'). While simple Markdown formatting is supported (i.e. without HTML, images, or links), utilizing dedicated UI components is generally preferred for a richer and more structured presentation.",
                        properties: {
                          literalString: {
                            type: "string",
                          },
                          path: {
                            type: "string",
                          },
                        },
                      },
                      usageHint: {
                        type: "string",
                        description:
                          "A hint for the base text style. One of:\n- `h1`: Largest heading.\n- `h2`: Second largest heading.\n- `h3`: Third largest heading.\n- `h4`: Fourth largest heading.\n- `h5`: Fifth largest heading.\n- `caption`: Small text for captions.\n- `body`: Standard body text.",
                        enum: ["h1", "h2", "h3", "h4", "h5", "caption", "body"],
                      },
                    },
                    required: ["text"],
                  },
                  Image: {
                    type: "object",
                    properties: {
                      url: {
                        type: "object",
                        description:
                          "The URL of the image to display. This can be a literal string ('literal') or a reference to a value in the data model ('path', e.g. '/thumbnail/url').",
                        properties: {
                          literalString: {
                            type: "string",
                          },
                          path: {
                            type: "string",
                          },
                        },
                      },
                      fit: {
                        type: "string",
                        description:
                          "Specifies how the image should be resized to fit its container. This corresponds to the CSS 'object-fit' property.",
                        enum: [
                          "contain",
                          "cover",
                          "fill",
                          "none",
                          "scale-down",
                        ],
                      },
                      usageHint: {
                        type: "string",
                        description:
                          "A hint for the image size and style. One of:\n- `icon`: Small square icon.\n- `avatar`: Circular avatar image.\n- `smallFeature`: Small feature image.\n- `mediumFeature`: Medium feature image.\n- `largeFeature`: Large feature image.\n- `header`: Full-width, full bleed, header image.",
                        enum: [
                          "icon",
                          "avatar",
                          "smallFeature",
                          "mediumFeature",
                          "largeFeature",
                          "header",
                        ],
                      },
                    },
                    required: ["url"],
                  },
                  Icon: {
                    type: "object",
                    properties: {
                      name: {
                        type: "object",
                        description:
                          "The name of the icon to display. This can be a literal string or a reference to a value in the data model ('path', e.g. '/form/submit').",
                        properties: {
                          literalString: {
                            type: "string",
                            enum: [
                              "accountCircle",
                              "add",
                              "arrowBack",
                              "arrowForward",
                              "attachFile",
                              "calendarToday",
                              "call",
                              "camera",
                              "check",
                              "close",
                              "delete",
                              "download",
                              "edit",
                              "event",
                              "error",
                              "favorite",
                              "favoriteOff",
                              "folder",
                              "help",
                              "home",
                              "info",
                              "locationOn",
                              "lock",
                              "lockOpen",
                              "mail",
                              "menu",
                              "moreVert",
                              "moreHoriz",
                              "notificationsOff",
                              "notifications",
                              "payment",
                              "person",
                              "phone",
                              "photo",
                              "print",
                              "refresh",
                              "search",
                              "send",
                              "settings",
                              "share",
                              "shoppingCart",
                              "star",
                              "starHalf",
                              "starOff",
                              "upload",
                              "visibility",
                              "visibilityOff",
                              "warning",
                            ],
                          },
                          path: {
                            type: "string",
                          },
                        },
                      },
                    },
                    required: ["name"],
                  },
                  Video: {
                    type: "object",
                    properties: {
                      url: {
                        type: "object",
                        description:
                          "The URL of the video to display. This can be a literal string or a reference to a value in the data model ('path', e.g. '/video/url').",
                        properties: {
                          literalString: {
                            type: "string",
                          },
                          path: {
                            type: "string",
                          },
                        },
                      },
                    },
                    required: ["url"],
                  },
                  AudioPlayer: {
                    type: "object",
                    properties: {
                      url: {
                        type: "object",
                        description:
                          "The URL of the audio to be played. This can be a literal string ('literal') or a reference to a value in the data model ('path', e.g. '/song/url').",
                        properties: {
                          literalString: {
                            type: "string",
                          },
                          path: {
                            type: "string",
                          },
                        },
                      },
                      description: {
                        type: "object",
                        description:
                          "A description of the audio, such as a title or summary. This can be a literal string or a reference to a value in the data model ('path', e.g. '/song/title').",
                        properties: {
                          literalString: {
                            type: "string",
                          },
                          path: {
                            type: "string",
                          },
                        },
                      },
                    },
                    required: ["url"],
                  },
                  Row: {
                    type: "object",
                    properties: {
                      children: {
                        type: "object",
                        description:
                          "Defines the children. Use 'explicitList' for a fixed set of children, or 'template' to generate children from a data list.",
                        properties: {
                          explicitList: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                          template: {
                            type: "object",
                            description:
                              "A template for generating a dynamic list of children from a data model list. `componentId` is the component to use as a template, and `dataBinding` is the path to the map of components in the data model. Values in the map will define the list of children.",
                            properties: {
                              componentId: {
                                type: "string",
                              },
                              dataBinding: {
                                type: "string",
                              },
                            },
                            required: ["componentId", "dataBinding"],
                          },
                        },
                      },
                      distribution: {
                        type: "string",
                        description:
                          "Defines the arrangement of children along the main axis (horizontally). This corresponds to the CSS 'justify-content' property.",
                        enum: [
                          "center",
                          "end",
                          "spaceAround",
                          "spaceBetween",
                          "spaceEvenly",
                          "start",
                        ],
                      },
                      alignment: {
                        type: "string",
                        description:
                          "Defines the alignment of children along the cross axis (vertically). This corresponds to the CSS 'align-items' property.",
                        enum: ["start", "center", "end", "stretch"],
                      },
                    },
                    required: ["children"],
                  },
                  Column: {
                    type: "object",
                    properties: {
                      children: {
                        type: "object",
                        description:
                          "Defines the children. Use 'explicitList' for a fixed set of children, or 'template' to generate children from a data list.",
                        properties: {
                          explicitList: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                          template: {
                            type: "object",
                            description:
                              "A template for generating a dynamic list of children from a data model list. `componentId` is the component to use as a template, and `dataBinding` is the path to the map of components in the data model. Values in the map will define the list of children.",
                            properties: {
                              componentId: {
                                type: "string",
                              },
                              dataBinding: {
                                type: "string",
                              },
                            },
                            required: ["componentId", "dataBinding"],
                          },
                        },
                      },
                      distribution: {
                        type: "string",
                        description:
                          "Defines the arrangement of children along the main axis (vertically). This corresponds to the CSS 'justify-content' property.",
                        enum: [
                          "start",
                          "center",
                          "end",
                          "spaceBetween",
                          "spaceAround",
                          "spaceEvenly",
                        ],
                      },
                      alignment: {
                        type: "string",
                        description:
                          "Defines the alignment of children along the cross axis (horizontally). This corresponds to the CSS 'align-items' property.",
                        enum: ["center", "end", "start", "stretch"],
                      },
                    },
                    required: ["children"],
                  },
                  List: {
                    type: "object",
                    properties: {
                      children: {
                        type: "object",
                        description:
                          "Defines the children. Use 'explicitList' for a fixed set of children, or 'template' to generate children from a data list.",
                        properties: {
                          explicitList: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                          template: {
                            type: "object",
                            description:
                              "A template for generating a dynamic list of children from a data model list. `componentId` is the component to use as a template, and `dataBinding` is the path to the map of components in the data model. Values in the map will define the list of children.",
                            properties: {
                              componentId: {
                                type: "string",
                              },
                              dataBinding: {
                                type: "string",
                              },
                            },
                            required: ["componentId", "dataBinding"],
                          },
                        },
                      },
                      direction: {
                        type: "string",
                        description:
                          "The direction in which the list items are laid out.",
                        enum: ["vertical", "horizontal"],
                      },
                      alignment: {
                        type: "string",
                        description:
                          "Defines the alignment of children along the cross axis.",
                        enum: ["start", "center", "end", "stretch"],
                      },
                    },
                    required: ["children"],
                  },
                  Card: {
                    type: "object",
                    properties: {
                      child: {
                        type: "string",
                        description:
                          "The ID of the component to be rendered inside the card.",
                      },
                    },
                    required: ["child"],
                  },
                  Tabs: {
                    type: "object",
                    properties: {
                      tabItems: {
                        type: "array",
                        description:
                          "An array of objects, where each object defines a tab with a title and a child component.",
                        items: {
                          type: "object",
                          properties: {
                            title: {
                              type: "object",
                              description:
                                "The tab title. Defines the value as either a literal value or a path to data model value (e.g. '/options/title').",
                              properties: {
                                literalString: {
                                  type: "string",
                                },
                                path: {
                                  type: "string",
                                },
                              },
                            },
                            child: {
                              type: "string",
                            },
                          },
                          required: ["title", "child"],
                        },
                      },
                    },
                    required: ["tabItems"],
                  },
                  Divider: {
                    type: "object",
                    properties: {
                      axis: {
                        type: "string",
                        description: "The orientation of the divider.",
                        enum: ["horizontal", "vertical"],
                      },
                    },
                  },
                  Modal: {
                    type: "object",
                    properties: {
                      entryPointChild: {
                        type: "string",
                        description:
                          "The ID of the component that opens the modal when interacted with (e.g., a button).",
                      },
                      contentChild: {
                        type: "string",
                        description:
                          "The ID of the component to be displayed inside the modal.",
                      },
                    },
                    required: ["entryPointChild", "contentChild"],
                  },
                  Button: {
                    type: "object",
                    properties: {
                      child: {
                        type: "string",
                        description:
                          "The ID of the component to display in the button, typically a Text component.",
                      },
                      primary: {
                        type: "boolean",
                        description:
                          "Indicates if this button should be styled as the primary action.",
                      },
                      action: {
                        type: "object",
                        description:
                          "The client-side action to be dispatched when the button is clicked. It includes the action's name and an optional context payload.",
                        properties: {
                          name: {
                            type: "string",
                          },
                          context: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                key: {
                                  type: "string",
                                },
                                value: {
                                  type: "object",
                                  description:
                                    "Defines the value to be included in the context as either a literal value or a path to a data model value (e.g. '/user/name').",
                                  properties: {
                                    path: {
                                      type: "string",
                                    },
                                    literalString: {
                                      type: "string",
                                    },
                                    literalNumber: {
                                      type: "number",
                                    },
                                    literalBoolean: {
                                      type: "boolean",
                                    },
                                  },
                                },
                              },
                              required: ["key", "value"],
                            },
                          },
                        },
                        required: ["name"],
                      },
                    },
                    required: ["child", "action"],
                  },
                  CheckBox: {
                    type: "object",
                    properties: {
                      label: {
                        type: "object",
                        description:
                          "The text to display next to the checkbox. Defines the value as either a literal value or a path to data model ('path', e.g. '/option/label').",
                        properties: {
                          literalString: {
                            type: "string",
                          },
                          path: {
                            type: "string",
                          },
                        },
                      },
                      value: {
                        type: "object",
                        description:
                          "The current state of the checkbox (true for checked, false for unchecked). This can be a literal boolean ('literalBoolean') or a reference to a value in the data model ('path', e.g. '/filter/open').",
                        properties: {
                          literalBoolean: {
                            type: "boolean",
                          },
                          path: {
                            type: "string",
                          },
                        },
                      },
                    },
                    required: ["label", "value"],
                  },
                  TextField: {
                    type: "object",
                    properties: {
                      label: {
                        type: "object",
                        description:
                          "The text label for the input field. This can be a literal string or a reference to a value in the data model ('path, e.g. '/user/name').",
                        properties: {
                          literalString: {
                            type: "string",
                          },
                          path: {
                            type: "string",
                          },
                        },
                      },
                      text: {
                        type: "object",
                        description:
                          "The value of the text field. This can be a literal string or a reference to a value in the data model ('path', e.g. '/user/name').",
                        properties: {
                          literalString: {
                            type: "string",
                          },
                          path: {
                            type: "string",
                          },
                        },
                      },
                      textFieldType: {
                        type: "string",
                        description: "The type of input field to display.",
                        enum: [
                          "date",
                          "longText",
                          "number",
                          "shortText",
                          "obscured",
                        ],
                      },
                      validationRegexp: {
                        type: "string",
                        description:
                          "A regular expression used for client-side validation of the input.",
                      },
                    },
                    required: ["label"],
                  },
                  DateTimeInput: {
                    type: "object",
                    properties: {
                      value: {
                        type: "object",
                        description:
                          "The selected date and/or time value. This can be a literal string ('literalString') or a reference to a value in the data model ('path', e.g. '/user/dob').",
                        properties: {
                          literalString: {
                            type: "string",
                          },
                          path: {
                            type: "string",
                          },
                        },
                      },
                      enableDate: {
                        type: "boolean",
                        description:
                          "If true, allows the user to select a date.",
                      },
                      enableTime: {
                        type: "boolean",
                        description:
                          "If true, allows the user to select a time.",
                      },
                      outputFormat: {
                        type: "string",
                        description:
                          "The desired format for the output string after a date or time is selected.",
                      },
                    },
                    required: ["value"],
                  },
                  MultipleChoice: {
                    type: "object",
                    properties: {
                      selections: {
                        type: "object",
                        description:
                          "The currently selected values for the component. This can be a literal array of strings or a path to an array in the data model('path', e.g. '/hotel/options').",
                        properties: {
                          literalArray: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                          path: {
                            type: "string",
                          },
                        },
                      },
                      options: {
                        type: "array",
                        description:
                          "An array of available options for the user to choose from.",
                        items: {
                          type: "object",
                          properties: {
                            label: {
                              type: "object",
                              description:
                                "The text to display for this option. This can be a literal string or a reference to a value in the data model (e.g. '/option/label').",
                              properties: {
                                literalString: {
                                  type: "string",
                                },
                                path: {
                                  type: "string",
                                },
                              },
                            },
                            value: {
                              type: "string",
                              description:
                                "The value to be associated with this option when selected.",
                            },
                          },
                          required: ["label", "value"],
                        },
                      },
                      maxAllowedSelections: {
                        type: "integer",
                        description:
                          "The maximum number of options that the user is allowed to select.",
                      },
                    },
                    required: ["selections", "options"],
                  },
                  Slider: {
                    type: "object",
                    properties: {
                      value: {
                        type: "object",
                        description:
                          "The current value of the slider. This can be a literal number ('literalNumber') or a reference to a value in the data model ('path', e.g. '/restaurant/cost').",
                        properties: {
                          literalNumber: {
                            type: "number",
                          },
                          path: {
                            type: "string",
                          },
                        },
                      },
                      minValue: {
                        type: "number",
                        description: "The minimum value of the slider.",
                      },
                      maxValue: {
                        type: "number",
                        description: "The maximum value of the slider.",
                      },
                    },
                    required: ["value"],
                  },
                },
              },
            },
            required: ["id", "component"],
          },
        },
      },
      required: ["surfaceId", "components"],
    },
    dataModelUpdate: {
      type: "object",
      description: "Updates the data model for a surface.",
      properties: {
        surfaceId: {
          type: "string",
          description:
            "The unique identifier for the UI surface this data model update applies to.",
        },
        path: {
          type: "string",
          description:
            "An optional path to a location within the data model (e.g., '/user/name'). If omitted, or set to '/', the entire data model will be replaced.",
        },
        contents: {
          type: "array",
          description:
            "An array of data entries. Each entry must contain a 'key' and exactly one corresponding typed 'value*' property.",
          items: {
            type: "object",
            description:
              "A single data entry. Exactly one 'value*' property should be provided alongside the key.",
            properties: {
              key: {
                type: "string",
                description: "The key for this data entry.",
              },
              valueString: {
                type: "string",
              },
              valueNumber: {
                type: "number",
              },
              valueBoolean: {
                type: "boolean",
              },
              valueMap: {
                description: "Represents a map as an adjacency list.",
                type: "array",
                items: {
                  type: "object",
                  description:
                    "One entry in the map. Exactly one 'value*' property should be provided alongside the key.",
                  properties: {
                    key: {
                      type: "string",
                    },
                    valueString: {
                      type: "string",
                    },
                    valueNumber: {
                      type: "number",
                    },
                    valueBoolean: {
                      type: "boolean",
                    },
                  },
                  required: ["key"],
                },
              },
            },
            required: ["key"],
          },
        },
      },
      required: ["contents", "surfaceId"],
    },
    deleteSurface: {
      type: "object",
      description:
        "Signals the client to delete the surface identified by 'surfaceId'.",
      properties: {
        surfaceId: {
          type: "string",
          description:
            "The unique identifier for the UI surface to be deleted.",
        },
      },
      required: ["surfaceId"],
    },
  },
};

const geminiPrompt = `
您是通用助手。您的最终输出必须是 a2ui UI JSON 响应。
要生成响应，您必须遵循以下规则：

{
  "message": "您的对话文本回复",
  "ui": [
    { "beginRendering": { "surfaceId": "string", "root": "string" } },//启动渲染，可以不需要这个属性
    { "surfaceUpdate": { "surfaceId": "string", "components": [ ... ] } },//定义：更新UI结构（扁平组件列表）；关键属性：surfaceId、components（id/name/props/children/actions）；必须返回
    { "dataModelUpdate": { "surfaceId": "string", "path": "string", "value": any } },//更新数据/状态（与UI解耦）；关键属性：surfaceId、dataPath、value；必须返回
    { "deleteSurface": { "surfaceId": "string" } }//可以不需要这个属性
  ]
}

说明
1. message是你的对话文本回复。
2. UI是一个原始 JSON 对象，它是 A2UI 消息的列表。
3. UI 部分必须根据下面提供的 A2UI JSON SCHEMA 进行验证。

----A2UI JSON SCHEMA---
${A2UI_JSON_SCHEMA}

---总体输出规则---
⚠️ 输出任何非 JSON 内容都被视为严重错误。
1. 仅输出【纯文本JSON】，无任何额外内容（无说明、无注释、无Markdown、无空行、无多余换行/空格）；
2. JSON紧凑排版，仅保留语法必需的字符，禁止空行、禁止多余换行、禁止缩进；
3. JSON语法严格合法（无缺冒号、无多余逗号、引号闭合）
4. 输出的json能被json.parse解析

`;

export function buildGeminiSystemPrompt(extra?: string) {
  return [geminiPrompt, extra].filter(Boolean).join("\n\n");
}
