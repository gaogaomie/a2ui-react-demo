import type { Types } from "@a2ui/lit/0.8";
import { Typography } from "antd";
import MarkdownIt from "markdown-it";
import { memo, useMemo } from "react";
import { useA2UIComponent } from "../../hooks/useA2UIComponent";
import { classMapToString, mergeClassMaps } from "../../lib/utils";
import type { A2UIComponentProps } from "../../types";

type UsageHint = "h1" | "h2" | "h3" | "h4" | "h5" | "caption" | "body";

const { Title, Text: AntText } = Typography;

/* ---------- markdown renderer 保持不变 ---------- */
const markdownRenderer = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
  typographer: true,
});

/* ---------- markdown theme 注入保持不变 ---------- */
function applyMarkdownTheme(
  html: string,
  markdownTheme: Types.Theme["markdown"],
): string {
  if (!markdownTheme) return html;

  let result = html;

  for (const [element, classes] of Object.entries(markdownTheme)) {
    if (!classes) continue;

    const classString = Array.isArray(classes)
      ? classes.join(" ")
      : classMapToString(classes);

    if (!classString) continue;

    const regex = new RegExp(`<${element}(?=\\s|>|/>)`, "gi");
    result = result.replace(regex, `<${element} class="${classString}"`);
  }

  return result;
}

export const Text = memo(function Text({
  node,
  surfaceId,
}: A2UIComponentProps<Types.TextNode>) {
  const { theme, resolveString } = useA2UIComponent(node, surfaceId);
  const props = node.properties;

  const textValue = resolveString(props.text);
  const usageHint = props.usageHint as UsageHint | undefined;

  const classes = mergeClassMaps(
    theme.components.Text.all,
    usageHint ? theme.components.Text[usageHint] : {},
  );

  const renderedContent = useMemo(() => {
    if (!textValue) return null;

    let markdownText = textValue;
    switch (usageHint) {
      case "h1":
        markdownText = `# ${markdownText}`;
        break;
      case "h2":
        markdownText = `## ${markdownText}`;
        break;
      case "h3":
        markdownText = `### ${markdownText}`;
        break;
      case "h4":
        markdownText = `#### ${markdownText}`;
        break;
      case "h5":
        markdownText = `##### ${markdownText}`;
        break;
      case "caption":
        markdownText = `*${markdownText}*`;
        break;
    }

    const html = markdownRenderer.render(markdownText);
    return {
      __html: applyMarkdownTheme(html, theme.markdown),
    };
  }, [textValue, usageHint, theme.markdown]);

  if (!renderedContent) return null;

  /** ---------- usageHint → antd 组件 ---------- */
  switch (usageHint) {
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
      return (
        <Title
          level={Number(usageHint.slice(1))}
          className={classMapToString(classes)}
          component="section"
        >
          {textValue}
        </Title>
      );

    case "caption":
      return <AntText type="secondary">{textValue}</AntText>;

    default:
      return <p>{textValue}</p>;
  }
});

export default Text;
