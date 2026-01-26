import type { Types } from "@a2ui/lit/0.8";
import { VideoPlayer } from "@douyinfe/semi-ui";
import { memo } from "react";
import { useA2UIComponent } from "../../hooks/useA2UIComponent";
import type { A2UIComponentProps } from "../../types";

export const Video = memo(function Video({
  node,
  surfaceId,
}: A2UIComponentProps<Types.VideoNode>) {
  const { resolveString } = useA2UIComponent(node, surfaceId);
  const props = node.properties;

  const url = resolveString(props.url);

  if (!url) {
    return null;
  }

  const style: React.CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    flex: node.weight ?? "initial",
  };

  return (
    <div data-id={node.id} style={style}>
      <VideoPlayer
        src={url}
        theme="light"
        controlsList={[
          "play",
          "time",
          "volume",
          "playbackRate",
          "fullscreen",
          "pictureInPicture",
        ]}
      />
    </div>
  );
});

export default Video;
