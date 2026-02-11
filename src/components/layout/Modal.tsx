import type { Types } from "@a2ui/lit/0.8";
import { Modal as AntdModal } from "antd";
import { memo, useState } from "react";
import { ComponentNode } from "../../core/ComponentNode";
import type { A2UIComponentProps } from "../../types";

/**
 * Modal component - displays content in a dialog overlay.
 *
 * The entryPointChild component triggers the modal to open.
 * The contentChild is displayed inside the modal dialog.
 */
export const Modal = memo(function Modal({
  node,
  surfaceId,
}: A2UIComponentProps<Types.ModalNode>) {
  const { entryPointChild, contentChild } = node.properties;
  const component = node as Types.ModalNode;

  const [visible, setVisible] = useState(false);
  const style: React.CSSProperties = {
    flex: component.weight ?? "initial",
  };

  return (
    <div id={component.id} style={style}>
      {entryPointChild && (
        <div onClick={() => setVisible(true)}>
          <ComponentNode node={entryPointChild} surfaceId={surfaceId} />
        </div>
      )}
      <AntdModal
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        {contentChild && (
          <ComponentNode node={contentChild} surfaceId={surfaceId} />
        )}
      </AntdModal>
    </div>
  );
});

export default Modal;
