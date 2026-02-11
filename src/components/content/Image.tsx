import type { Types } from "@a2ui/lit/0.8";
import { Image as AntdImage } from "antd";
import { memo } from "react";
import { useA2UIComponent } from "../../hooks/useA2UIComponent";
import type { A2UIComponentProps } from "../../types";

type UsageHint =
  | "icon"
  | "avatar"
  | "smallFeature"
  | "mediumFeature"
  | "largeFeature"
  | "header";
type FitMode = "contain" | "cover" | "fill" | "none" | "scale-down";

/**
 * Image component - renders an image from a URL with optional sizing and fit modes.
 *
 * Supports usageHint values: icon, avatar, smallFeature, mediumFeature, largeFeature, header
 * Supports fit values: contain, cover, fill, none, scale-down (maps to object-fit via CSS variable)
 */
export const Image = memo(function Image({
  node,
  surfaceId,
}: A2UIComponentProps<Types.ImageNode>) {
  const { resolveString } = useA2UIComponent(node, surfaceId);
  const props = node.properties;
  const component = node as Types.ImageNode;
  const url = resolveString(props.url);
  const usageHint = props.usageHint as UsageHint | undefined;
  // const fit = (props.fit as FitMode) ?? "fill";

  if (!url) {
    return null;
  }

  // 根据 usageHint 设置不同的尺寸
  const getSize = () => {
    switch (usageHint) {
      case "icon":
        return { width: 24, height: 24 };
      case "avatar":
        return { width: 64, height: 64 };
      case "smallFeature":
        return { width: 80, height: 80 };
      case "mediumFeature":
        return { width: 100, height: 100 };
      case "largeFeature":
        return { width: 160, height: 120 };
      case "header":
        return { width: "100%", height: 180 };
      default:
        // 默认尺寸适合卡片内的图片
        return { width: 100, height: 100 };
    }
  };

  const size = getSize();

  const containerStyle: React.CSSProperties = {
    flex: component.weight ?? "initial",
    flexShrink: 0,
    width: size.width,
    height: size.height,
    borderRadius: usageHint === "avatar" ? "50%" : "12px",
    overflow: "hidden",
  };

  // Match Lit structure: <section><img /></section>
  return (
    <div data-id={component.id} style={containerStyle}>
      <img src={url} alt="" />
      <AntdImage src={url} width={"100%"} height={"100%"} preview={true} />
    </div>
  );
});

export default Image;
