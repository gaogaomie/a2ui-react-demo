import type { Types } from "@a2ui/lit/0.8";
import { Slider as AntdSlider } from "antd";
import { memo, useCallback, useEffect, useState } from "react";
import { useA2UIComponent } from "../../hooks/useA2UIComponent";
import type { A2UIComponentProps } from "../../types";

/**
 * Slider component - a numeric value selector with a range.
 *
 * Supports two-way data binding for the value.
 */
export const Slider = memo(function Slider({
  node,
  surfaceId,
}: A2UIComponentProps<Types.SliderNode>) {
  const { resolveNumber, setValue, getValue } = useA2UIComponent(
    node,
    surfaceId,
  );
  const props = node.properties;

  const valuePath = props.value?.path;
  const initialValue = resolveNumber(props.value) ?? 0;
  const minValue = props.minValue ?? 0;
  const maxValue = props.maxValue ?? 100;

  const [value, setLocalValue] = useState(initialValue);

  // Sync with external data model changes
  useEffect(() => {
    if (valuePath) {
      const externalValue = getValue(valuePath);
      if (externalValue !== null && Number(externalValue) !== value) {
        setLocalValue(Number(externalValue));
      }
    }
  }, [valuePath, getValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback(
    (value: number) => {
      const newValue = value;
      setLocalValue(newValue);

      // Two-way binding: update data model
      if (valuePath) {
        setValue(valuePath, newValue);
      }
    },
    [valuePath, setValue],
  );

  const labelValue = (props as any).label;
  const { resolveString } = useA2UIComponent(node, surfaceId);
  const label = labelValue ? resolveString(labelValue) : "";

  const style: React.CSSProperties = {
    flex: node.weight ?? "initial",
    width: "100%",
  };

  return (
    <>
      <AntdSlider
        data-id={node.id}
        value={value}
        min={minValue}
        max={maxValue}
        onChange={handleChange}
        style={style}
      />
    </>
  );
});

export default Slider;
