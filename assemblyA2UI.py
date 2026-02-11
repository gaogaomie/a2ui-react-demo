
surfaceUpdate=  {
    "surfaceUpdate": {
        "surfaceId": "default",
        "components": [
            {
                "id": "root",
                "component": {
                    "Column": {
                        "children": {
                            "explicitList": ["title", "sections"]
                        }
                    }
                }
            },
            {
                "id": "title",
                "component": {
                    "Text": {
                        "text": {
                            "path": "/examPaper/title"
                        },
                        "usageHint": "h1"
                    }
                }
            },
            {
                "id": "sections",
                "component": {
                    "Column": {
                        "children": {
                            "template": {
                                "componentId": "section",
                                "dataBinding": "/examPaper/sections"
                            }
                        }
                    }
                }
            },
            {
                "id": "section",
                "component": {
                    "Column": {
                        "children": {
                            "explicitList": ["sectionTitle", "questions"]
                        }
                    }
                }
            },
            {
                "id": "sectionTitle",
                "component": {
                    "Text": {
                        "text": {
                            "path": "title"
                        },
                        "usageHint": "h2"
                    }
                }
            },
            {
                "id": "questions",
                "component": {
                    "Column": {
                        "children": {
                            "template": {
                                "componentId": "question",
                                "dataBinding": "questions"
                            }
                        }
                    }
                }
            },
            {
                "id": "question",
                "component": {
                    "Column": {
                        "children": {
                            "explicitList": ["questionContent", "options", "answer"]
                        }
                    }
                }
            },
            {
                "id": "questionContent",
                "component": {
                    "Text": {
                        "text": {
                            "path": "content"
                        },
                        "usageHint": "body"
                    }
                }
            },
            {
                "id": "options",
                "component": {
                    "Column": {
                        "children": {
                            "template": {
                                "componentId": "option",
                                "dataBinding": "options"
                            }
                        }
                    }
                }
            },
            {
                "id": "option",
                "component": {
                    "Row": {
                        "children": {
                            "explicitList": ["optionRadio", "optionText"]
                        }
                    }
                }
            },
            {
                "id": "optionRadio",
                "component": {
                    "CheckBox": {
                        "label": {
                            "literalString": ""
                        },
                        "value": {
                            "literalBoolean": "false"
                        }
                    }
                }
            },
            {
                "id": "optionText",
                "component": {
                    "Text": {
                        "text": {
                            "path": "."
                        },
                        "usageHint": "body"
                    }
                }
            },
            {
                "id": "answer",
                "component": {
                    "Text": {
                        "text": {
                            "path": "answer"
                        },
                        "usageHint": "caption"
                    }
                }
            }
        ]
    }
}

dataSource={
    "examPaper": {
      "title": "小微贷产品培训考试试卷",
      "sections": [
        {
          "type": "singleChoice",
          "title": "一、单选题（每题4分，共60分）",
          "questions": [
            {
              "id": 1,
              "content": "\"小微贷\"产品的主要依据文件不包括以下哪项？",
              "options": [
                "A. 《江苏省普惠金融发展风险补偿基金管理办法》",
                "B. 《江苏省\"小微贷\"工作方案(2025-2027年)》",
                "C. 《商业银行资本管理办法》",
                "D. 省联社有关信贷业务管理制度"
              ],
              "answer": "C",
              "explanation": "根据1.1目的部分，\"小微贷\"产品依据文件中未提及《商业银行资本管理办法》。"
            },
            {
              "id": 2,
              "content": "\"小微贷\"产品的适用对象是？",
              "options": [
                "A. 江苏省内所有企业",
                "B. 江苏省内注册的小型、微型企业",
                "C. 全国范围内的小微企业",
                "D. 江苏省内大型企业"
              ],
              "answer": "B",
              "explanation": "根据1.2范围部分，明确说明适用于江苏省内注册的小型、微型企业。"
            },
            {
              "id": 3,
              "content": "\"小微贷\"产品的主要用途是？",
              "options": [
                "A. 固定资产投资",
                "B. 生产经营周转",
                "C. 个人消费",
                "D. 房地产开发"
              ],
              "answer": "B",
              "explanation": "根据1.3定义部分，\"小微贷\"是用于生产经营周转的短期流动资金贷款。"
            },
            {
              "id": 4,
              "content": "以下哪个部门负责\"小微贷\"业务的审查、审批？",
              "options": [
                "A. 公司银行部",
                "B. 经办支行",
                "C. 授信审批部",
                "D. 信贷管理部"
              ],
              "answer": "C",
              "explanation": "根据2.1职责分工部分，授信审批部负责审查、审批工作。"
            },
            {
              "id": 5,
              "content": "\"小微贷\"业务的管理依托于哪个平台实现？",
              "options": [
                "A. 江苏省综合金融服务平台",
                "B. 人民银行征信系统",
                "C. 银保监会监管系统",
                "D. 本行内部管理系统"
              ],
              "answer": "A",
              "explanation": "根据1.4其他部分，明确依托江苏省综合金融服务平台中的\"普惠基金专版\"。"
            },
            {
              "id": 6,
              "content": "小微企业的划型标准依据是？",
              "options": [
                "A. 《商业银行小微企业贷款管理办法》",
                "B. 《关于印发中小企业划型标准规定的通知》",
                "C. 《小微企业贷款风险管理办法》",
                "D. 《江苏省小微企业认定标准》"
              ],
              "answer": "B",
              "explanation": "根据1.2范围部分，明确依据工信部联企业〔2011〕300号文件。"
            },
            {
              "id": 7,
              "content": "公司银行部在\"小微贷\"业务中的职责不包括？",
              "options": [
                "A. 对接风险补偿金管理机构",
                "B. 制定实施细则",
                "C. 直接办理贷款业务",
                "D. 指导支行营销拓展"
              ],
              "answer": "C",
              "explanation": "根据2.1职责分工部分，直接办理贷款业务由经办支行负责。"
            },
            {
              "id": 8,
              "content": "信贷管理部主要负责\"小微贷\"业务的哪个环节？",
              "options": [
                "A. 营销拓展",
                "B. 贷中、贷后管理",
                "C. 审查审批",
                "D. 风险补偿"
              ],
              "answer": "B",
              "explanation": "根据2.1职责分工部分，信贷管理部负责贷中、贷后管理。"
            },
            {
              "id": 9,
              "content": "\"小微贷\"产品的实施细则是哪个版本的？",
              "options": [
                "A. 1.0版",
                "B. 2.0版",
                "C. 3.0版",
                "D. 4.0版"
              ],
              "answer": "B",
              "explanation": "文档标题明确为\"小微贷\"产品实施细则(2.0版，2025年)。"
            },
            {
              "id": 10,
              "content": "\"小微贷\"业务经办行包括？",
              "options": [
                "A. 江苏省内支行(含二级支行)",
                "B. 全国所有分支机构",
                "C. 仅总行营业部",
                "D. 仅一级支行"
              ],
              "answer": "A",
              "explanation": "根据2.1职责分工部分，明确江苏省内支行(含二级支行)是经办行。"
            },
            {
              "id": 11,
              "content": "以下哪项不是\"小微贷\"产品的特点？",
              "options": [
                "A. 短期流动资金贷款",
                "B. 用于生产经营周转",
                "C. 长期固定资产贷款",
                "D. 面向小微企业"
              ],
              "answer": "C",
              "explanation": "根据1.3定义部分，\"小微贷\"是短期流动资金贷款，不是长期固定资产贷款。"
            },
            {
              "id": 12,
              "content": "风险补偿工作主要由哪个部门协助进行？",
              "options": [
                "A. 授信审批部",
                "B. 公司银行部",
                "C. 信贷管理部",
                "D. 经办支行"
              ],
              "answer": "B",
              "explanation": "根据2.1职责分工部分，公司银行部负责协助进行风险补偿工作。"
            },
            {
              "id": 13,
              "content": "\"小微贷\"产品的管理平台全称是？",
              "options": [
                "A. 江苏省普惠金融发展风险补偿基金专版",
                "B. 江苏省小微企业金融服务平台",
                "C. 江苏省银行信贷管理系统",
                "D. 江苏省金融监管平台"
              ],
              "answer": "A",
              "explanation": "根据1.4其他部分，明确为\"省普惠金融发展风险补偿基金专版\"。"
            },
            {
              "id": 14,
              "content": "\"小微贷\"实施细则的制定和解释由哪个部门负责？",
              "options": [
                "A. 授信审批部",
                "B. 公司银行部",
                "C. 信贷管理部",
                "D. 风险管理部门"
              ],
              "answer": "B",
              "explanation": "根据2.1职责分工部分，公司银行部负责实施细则的制定和解释。"
            },
            {
              "id": 15,
              "content": "\"小微贷\"业务的服务对象必须位于？",
              "options": [
                "A. 本行实体经营支行辖区之内",
                "B. 江苏省内任意地区",
                "C. 长三角地区",
                "D. 全国范围内"
              ],
              "answer": "A",
              "explanation": "根据1.2范围部分，明确企业需处于本行实体经营支行辖区之内。"
            }
          ]
        },
        {
          "type": "multipleChoice",
          "title": "二、多选题（每题4分，共20分）",
          "questions": [
            {
              "id": 16,
              "content": "\"小微贷\"产品的依据文件包括？",
              "options": [
                "A. 《江苏省普惠金融发展风险补偿基金管理办法》",
                "B. 《江苏省\"小微贷\"工作方案(2025-2027年)》",
                "C. 国家法律法规",
                "D. 省联社有关信贷业务管理制度"
              ],
              "answer": [
                "A",
                "B",
                "C",
                "D"
              ],
              "explanation": "根据1.1目的部分，所有选项均被提及为制定依据。"
            },
            {
              "id": 17,
              "content": "以下哪些部门参与\"小微贷\"业务管理？",
              "options": [
                "A. 公司银行部",
                "B. 经办支行",
                "C. 授信审批部",
                "D. 信贷管理部"
              ],
              "answer": [
                "A",
                "B",
                "C",
                "D"
              ],
              "explanation": "根据2.1职责分工部分，所有部门都参与\"小微贷\"业务管理。"
            },
            {
              "id": 18,
              "content": "\"小微贷\"产品的特点包括？",
              "options": [
                "A. 面向小微企业",
                "B. 用于生产经营周转",
                "C. 短期流动资金贷款",
                "D. 依托信息化平台管理"
              ],
              "answer": [
                "A",
                "B",
                "C",
                "D"
              ],
              "explanation": "根据1.3定义和1.4其他部分，所有选项均为\"小微贷\"产品特点。"
            },
            {
              "id": 19,
              "content": "关于\"小微贷\"业务经办行，以下说法正确的是？",
              "options": [
                "A. 包括江苏省内支行",
                "B. 包括二级支行",
                "C. 负责贷款业务办理",
                "D. 负责风险补偿工作"
              ],
              "answer": [
                "A",
                "B",
                "C"
              ],
              "explanation": "根据2.1职责分工部分，风险补偿工作由公司银行部协助，不是经办行职责。"
            },
            {
              "id": 20,
              "content": "\"小微贷\"业务管理涉及的主要环节包括？",
              "options": [
                "A. 营销拓展",
                "B. 审查审批",
                "C. 贷中管理",
                "D. 贷后管理"
              ],
              "answer": [
                "A",
                "B",
                "C",
                "D"
              ],
              "explanation": "根据2.1职责分工部分，所有环节都涉及\"小微贷\"业务管理。"
            }
          ]
        },
        {
          "type": "trueFalse",
          "title": "三、判断题（每题4分，共20分）",
          "questions": [
            {
              "id": 21,
              "content": "\"小微贷\"产品可以用于房地产开发。",
              "answer": "false",
              "explanation": "根据1.3定义部分，\"小微贷\"用于生产经营周转的短期流动资金贷款，不包括房地产开发。"
            },
            {
              "id": 22,
              "content": "公司银行部是\"小微贷\"业务的牵头部门。",
              "answer": "true",
              "explanation": "根据2.1职责分工部分，明确公司银行部是牵头部门。"
            },
            {
              "id": 23,
              "content": "\"小微贷\"业务可以面向全国范围内的小微企业。",
              "answer": "false",
              "explanation": "根据1.2范围部分，仅限于江苏省行政区域内注册的小微企业。"
            },
            {
              "id": 24,
              "content": "信贷管理部负责\"小微贷\"业务的贷前调查工作。",
              "answer": "false",
              "explanation": "根据2.1职责分工部分，信贷管理部负责贷中、贷后管理，贷前调查应为经办支行职责。"
            },
            {
              "id": 25,
              "content": "\"小微贷\"业务依托江苏省综合金融服务平台实现全流程信息化管理。",
              "answer": "true",
              "explanation": "根据1.4其他部分，明确依托该平台实现信息化管理。"
            }
          ]
        }
      ],
      "totalScore": 100
    }
  },
 

#1️⃣ 从 surfaceUpdate 中收集所有 path，处理 List 的 dataBinding
def collect_paths(surface_update: dict) -> set[str]:
    # 收集 dataBinding 路径（这些路径指向数组）
    data_binding_paths = set()

    def walk(node):
        if isinstance(node, dict):
            # 处理 List 组件的 dataBinding
            if "List" in node.get("component", {}):
                comp = node["component"]["List"]
                if "children" in comp and "template" in comp["children"]:
                    template = comp["children"]["template"]
                    if "dataBinding" in template:
                        data_binding_paths.add(template["dataBinding"])

            # 处理普通 path（非模板中的）
            if "path" in node and isinstance(node["path"], str):
                raw_path = node["path"]
                if raw_path.startswith("/"):  # 只收集绝对路径
                    data_binding_paths.add(raw_path)

            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(surface_update)
    return data_binding_paths


#2️⃣ 工具函数：按 path 从 datasource 取值
_MISSING = object()

def get_by_path(data, path: str):
    cur = data
    for part in path.strip("/").split("/"):
        if isinstance(cur, dict):
            if part not in cur:
                return _MISSING
            cur = cur[part]
        elif isinstance(cur, list):
            if not part.isdigit():
                return _MISSING
            idx = int(part)
            if idx >= len(cur):
                return _MISSING
            cur = cur[idx]
        else:
            return _MISSING
    return cur


# 3️⃣ 工具函数：按 path 往 dict 里写值（自动建结构）
def set_by_path(root: dict, path: str, value):
    parts = path.strip("/").split("/")
    cur = root

    for i, part in enumerate(parts):
        is_last = i == len(parts) - 1
        next_part = parts[i + 1] if not is_last else None

        if part.isdigit():
            idx = int(part)
            while len(cur) <= idx:
                cur.append({})
            if is_last:
                cur[idx] = value
            else:
                if not isinstance(cur[idx], (dict, list)):
                    cur[idx] = [] if next_part.isdigit() else {}
                cur = cur[idx]
        else:
            if is_last:
                cur[part] = value
            else:
                if part not in cur:
                    cur[part] = [] if next_part.isdigit() else {}
                cur = cur[part]


# 4️⃣ 用 path 驱动生成「最小 dataModel」
def build_minimal_data_model(paths: set[str], datasource: dict) -> dict:
    model = {}

    for path in paths:
        value = get_by_path(datasource, path)

        # 🚨 核心：未命中的 path，直接跳过
        if value is _MISSING:
            continue

        # 如果你希望 None 也不下发
        if value is None:
            continue

        set_by_path(model, path, value)

    return model

# 5️⃣ Python dict → A2UI contents（关键一步）
def to_a2ui_contents(data):
    contents = []

    if isinstance(data, dict):
        for k, v in data.items():
            if isinstance(v, dict):
                contents.append({
                    "key": k,
                    "valueMap": to_a2ui_contents(v)
                })
            elif isinstance(v, list):
                contents.append({
                    "key": k,
                    "valueMap": [
                        {
                            "key": str(idx),
                            "valueMap": to_a2ui_contents(item)
                        }
                        for idx, item in enumerate(v)
                    ]
                })
            else:
                contents.append({
                    "key": k,
                    "valueString": str(v)
                })

    elif isinstance(data, list):
        # 这个分支理论上不会再走到
        for idx, item in enumerate(data):
            contents.append({
                "key": str(idx),
                "valueMap": to_a2ui_contents(item)
            })

    return contents


#6️⃣ 最终 assemble（你真正要用的）
def assemble_a2ui(surface_update: dict, datasource: dict):
    paths = collect_paths(surface_update)
    data_model = build_minimal_data_model(paths, datasource)

    # 获取第一个组件的 id 作为 root
    root_id = "root"
    # surface_update 可能是 {"surfaceUpdate": {...}} 结构
    components = surface_update.get("components") or surface_update.get("surfaceUpdate", {}).get("components")
    if components:
        root_id = components[0].get("id", "root")

    return [
        {
            "beginRendering": {
                "surfaceId": "default",
                "root": root_id,
                "styles": {
                    "primaryColor": "#FF0000",
                    "font": "Roboto"
                }
            }
        },
        surface_update,
        {
            "dataModelUpdate": {
                "surfaceId": "default",
                "path": "/",
                "contents": to_a2ui_contents(data_model)
            }
        }
    ]


print(assemble_a2ui(components, dataSource))