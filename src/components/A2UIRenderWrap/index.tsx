import { A2UIProvider } from "@/core/A2UIProvider";
import A2UIRenderer from "@/core/A2UIRenderer";
import { useA2UI } from "@/hooks/useA2UI";
import { Types } from "@/types";
import { cloneDeep } from "lodash-es";
import React, { memo, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

type Message = Record<string, any>;

export function replaceSurfaceIdInMessages<T extends Message[]>(
  messages: T,
  surfaceId: string,
): T {
  const next = cloneDeep(messages);

  next.forEach((message) => {
    // 每个 message 只有一个 key，比如 surfaceUpdate / beginRendering
    Object.values(message).forEach((payload) => {
      if (payload && typeof payload === "object" && "surfaceId" in payload) {
        payload.surfaceId = surfaceId;
      }
    });
  });

  return next;
}

interface A2UIRenderWrapProps {
  messages: Types.ServerToClientMessage[];
  onAction?: (action: Types.A2UIClientEventMessage) => void;
}

const A2UIRenderWrap = memo(({ messages, onAction }: A2UIRenderWrapProps) => {
  if (!messages?.length) return null;

  const surfaceIdRef = React.useRef<string>();

  if (!surfaceIdRef.current) {
    surfaceIdRef.current = uuidv4();
  }

  const surfaceId = surfaceIdRef.current;

  const processedMessages = useMemo(
    () => replaceSurfaceIdInMessages(messages, surfaceId),
    [messages, surfaceId],
  );

  return <TestRenderer messages={processedMessages} surfaceId={surfaceId} />;
});

export default A2UIRenderWrap;

export function TestRenderer({
  messages,
  surfaceId = "default",
}: {
  messages: Types.ServerToClientMessage[];
  surfaceId?: string;
}) {
  const { processMessages } = useA2UI();

  useEffect(() => {
    processMessages(messages);
  }, [messages, processMessages]);

  return <A2UIRenderer surfaceId={surfaceId} />;
}

export function TestWrapper({
  children,
  onAction,
  theme,
}: {
  children: ReactNode;
  onAction?: (action: Types.A2UIClientEventMessage) => void;
  theme?: Types.Theme;
}) {
  return (
    <A2UIProvider onAction={onAction} theme={theme}>
      {children}
    </A2UIProvider>
  );
}
