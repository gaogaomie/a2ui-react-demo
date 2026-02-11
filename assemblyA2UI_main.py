import json


def main(surface_update: str, datasource: str) -> dict:
    def normalize_json_str(s: str) -> str:
        if not isinstance(s, str):
            return s
    
        s = s.strip()
    
        # 处理 ```json ... ``` 或 ``` ... ```
        if s.startswith("```") and s.endswith("```"):
            lines = s.splitlines()
            # 去掉第一行 ``` 或 ```json
            if lines[0].startswith("```"):
                lines = lines[1:]
            # 去掉最后一行 ```
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            s = "\n".join(lines).strip()
    
        return s

    
    # 将输入的 JSON 字符串转换为字典
    try:
        surface_update_dict = json.loads(normalize_json_str(surface_update))
        datasource_dict = json.loads(normalize_json_str(datasource))
    except json.JSONDecodeError as e:
        return {"result1": f"ERROR: JSON解析失败 - {str(e)}"}
    

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


    # 调用主逻辑
    result_list = assemble_a2ui(surface_update_dict, datasource_dict)
    
    # 将结果列表转换为 JSON 字符串返回
    return {'result1': json.dumps(result_list, ensure_ascii=False)}






obj={
  "surface_update": "```json\n{\n\"surfaceUpdate\": {\n\"surfaceId\": \"default\",\n\"components\": [\n{\n\"id\": \"root-column\",\n\"component\": {\n\"Column\": {\n\"children\": {\n\"explicitList\": [\"title-heading\", \"food-list\"]\n}\n}\n}\n},\n{\n\"id\": \"title-heading\",\n\"component\": {\n\"Text\": {\n\"text\": {\n\"literalString\": \"苏州TOP6美食\"\n},\n\"usageHint\": \"h1\"\n}\n}\n},\n{\n\"id\": \"food-list\",\n\"component\": {\n\"List\": {\n\"direction\": \"vertical\",\n\"children\": {\n\"template\": {\n\"componentId\": \"food-card-template\",\n\"dataBinding\": \"/items\"\n}\n}\n}\n}\n},\n{\n\"id\": \"food-card-template\",\n\"component\": {\n\"Card\": {\n\"child\": \"card-content\"\n}\n}\n},\n{\n\"id\": \"card-content\",\n\"component\": {\n\"Row\": {\n\"children\": {\n\"explicitList\": [\"food-image\", \"food-info\"]\n}\n}\n}\n},\n{\n\"id\": \"food-image\",\n\"component\": {\n\"Image\": {\n\"url\": {\n\"path\": \"image\"\n},\n\"usageHint\": \"mediumFeature\"\n}\n}\n},\n{\n\"id\": \"food-info\",\n\"component\": {\n\"Column\": {\n\"children\": {\n\"explicitList\": [\"food-name\", \"food-location\", \"food-description\"]\n}\n}\n}\n},\n{\n\"id\": \"food-name\",\n\"component\": {\n\"Text\": {\n\"text\": {\n\"path\": \"name\"\n},\n\"usageHint\": \"h3\"\n}\n}\n},\n{\n\"id\": \"food-location\",\n\"component\": {\n\"Text\": {\n\"text\": {\n\"path\": \"location\"\n},\n\"usageHint\": \"caption\"\n}\n}\n},\n{\n\"id\": \"food-description\",\n\"component\": {\n\"Text\": {\n\"text\": {\n\"path\": \"description\"\n},\n\"usageHint\": \"body\"\n}\n}\n}\n]\n}\n}\n```",
  "datasource": "{\n\"items\":[\n{\"name\":\"松鼠桂鱼\",\"description\":\"苏州传统名菜，鱼肉外酥里嫩，酸甜可口\",\"image\":\"https://picsum.photos/300/300\",\"location\":\"松鹤楼\"},\n{\"name\":\"响油鳝糊\",\"description\":\"鳝鱼丝滑嫩，浇上热油滋滋作响，香气扑鼻\",\"image\":\"https://picsum.photos/300/300\",\"location\":\"得月楼\"},\n{\"name\":\"苏式汤面\",\"description\":\"细面筋道，汤头鲜美，浇头丰富\",\"image\":\"https://picsum.photos/300/300\",\"location\":\"同得兴\"},\n{\"name\":\"蟹粉小笼\",\"description\":\"皮薄馅多，汤汁鲜美，蟹香浓郁\",\"image\":\"https://picsum.photos/300/300\",\"location\":\"鼎泰丰\"},\n{\"name\":\"桂花糖芋艿\",\"description\":\"香甜软糯，桂花香气浓郁\",\"image\":\"https://picsum.photos/300/300\",\"location\":\"平江路小吃街\"},\n{\"name\":\"碧螺虾仁\",\"description\":\"虾仁鲜嫩，碧螺春茶香清新\",\"image\":\"https://picsum.photos/300/300\",\"location\":\"吴门人家\"}\n]\n}"
}

result = main(obj['surface_update'], obj['datasource'])
print(result["result1"])