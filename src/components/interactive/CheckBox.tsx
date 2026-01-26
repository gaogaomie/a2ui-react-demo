import type { Types } from "@a2ui/lit/0.8";
import { Checkbox as SemiCheckbox } from "@douyinfe/semi-ui";
import { memo, useCallback, useEffect, useId, useState } from "react";
import { useA2UIComponent } from "../../hooks/useA2UIComponent";
import type { A2UIComponentProps } from "../../types";

/**
 * CheckBox component - a boolean toggle with a label.
 *
 * Supports two-way data binding for the checked state.
 */
export const CheckBox = memo(function CheckBox({
  node,
  surfaceId,
}: A2UIComponentProps<Types.CheckboxNode>) {
  const { theme, resolveString, resolveBoolean, setValue, getValue } =
    useA2UIComponent(node, surfaceId);
  const props = node.properties;
  const id = useId();

  const label = resolveString(props.label);
  const valuePath = props.value?.path;
  const initialChecked = resolveBoolean(props.value) ?? false;

  const [checked, setChecked] = useState(initialChecked);

  // Sync with external data model changes
  useEffect(() => {
    if (valuePath) {
      const externalValue = getValue(valuePath);
      if (externalValue !== null && Boolean(externalValue) !== checked) {
        setChecked(Boolean(externalValue));
      }
    }
  }, [valuePath, getValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;
      setChecked(newValue);

      // Two-way binding: update data model
      if (valuePath) {
        setValue(valuePath, newValue);
      }
    },
    [valuePath, setValue],
  );

  const style: React.CSSProperties = {
    flex: node.weight ?? "initial",
  };

  // Use <section> container to match Lit renderer
  return (
    <SemiCheckbox
      data-id={id}
      checked={checked ?? false}
      onChange={handleChange}
      style={style}
    >
      {label}
    </SemiCheckbox>
  );
});

export default CheckBox;
