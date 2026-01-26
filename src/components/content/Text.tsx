import type { Types } from "@a2ui/lit/0.8";
import { MarkdownRender, Rating } from "@douyinfe/semi-ui";
import { memo } from "react";
import { useA2UIComponent } from "../../hooks/useA2UIComponent";
import type { A2UIComponentProps } from "../../types";

type UsageHint = "h1" | "h2" | "h3" | "h4" | "h5" | "caption" | "body";

// Check if text is a star rating pattern (e.g., "★★★★☆")
function parseStarRating(text: string): number | null {
  const starPattern = /^[★☆]+$/;
  if (!starPattern.test(text.trim())) {
    return null;
  }
  const filledStars = (text.match(/★/g) || []).length;
  return filledStars;
}

export const Text = memo(function Text({
  node,
  surfaceId,
}: A2UIComponentProps<Types.TextNode>) {
  const { resolveString } = useA2UIComponent(node, surfaceId);
  const props = node.properties;
  const component = node as Types.TextNode;
  const textValue = resolveString(props.text);
  const usageHint = props.usageHint as UsageHint | undefined;

  if (!textValue) {
    return null;
  }

  const style: React.CSSProperties = {
    flex: component.weight ?? "initial",
  };

  const starRating = parseStarRating(textValue);
  if (starRating !== null) {
    return (
      <Rating
        data-id={component.id}
        value={starRating}
        count={5}
        disabled
        size="small"
        style={{ ...style, display: "flex" }}
      />
    );
  }

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

  // Always use <section> wrapper with markdown rendering (matches Lit structure)
  return (
    <div data-id={component.id} style={style} className="a2ui-text">
      <MarkdownRender raw={markdownText} format="md" />
    </div>
  );
});

export default Text;
