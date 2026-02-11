import type { Types } from "@a2ui/lit/0.8";
import { Input, InputNumber } from "antd";
import { memo, useCallback, useEffect, useId, useState } from "react";
import { useA2UIComponent } from "../../hooks/useA2UIComponent";
import type { A2UIComponentProps } from "../../types";
const { TextArea } = Input;

type TextFieldType = "shortText" | "longText" | "number" | "date";

/**
 * TextField component - an input field for text entry.
 *
 * Supports various input types and two-way data binding.
 */
export const TextField = memo(function TextField({
  node,
  surfaceId,
}: A2UIComponentProps<Types.TextFieldNode>) {
  const component = node as Types.TextFieldNode;
  const { theme, resolveString, setValue, getValue } = useA2UIComponent(
    node,
    surfaceId,
  );
  const props = node.properties;
  const id = useId();
  const type =
    (props.type as TextFieldType | undefined) || props?.textFieldType;
  const text = props.text;
  const label = resolveString(props.label);
  const textPath = props.text?.path;
  const initialValue = resolveString(props.text) ?? "";
  const validationRegexp = props.validationRegexp;
  const [value, setLocalValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(true);

  // Sync with external data model changes
  useEffect(() => {
    if (textPath) {
      const externalValue = getValue(textPath);
      if (externalValue !== null && String(externalValue) !== value) {
        setLocalValue(String(externalValue));
      }
    }
  }, [textPath, getValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback(
    (e: string) => {
      console.log("handleChange", e.target.value);
      const newValue = e.target.value;
      setLocalValue(newValue);

      // Validate if pattern provided
      if (validationRegexp) {
        setIsValid(new RegExp(validationRegexp).test(newValue));
      }

      // Two-way binding: update data model
      if (textPath) {
        setValue(textPath, newValue);
      }
    },
    [validationRegexp, textPath, setValue],
  );

  const style: React.CSSProperties = {
    flex: component.weight ?? "initial",
    width: "100%",
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: component.weight ?? "initial",
  };

  if (type === "number") {
    return (
      <div id={component.id} style={containerStyle}>
        {label && <label>{label}</label>}
        <InputNumber
          value={value ? Number(value) : undefined}
          onChange={(value) => handleChange(value ?? 0)}
          style={style}
        />
      </div>
    );
  }

  if (type === "longText") {
    return (
      <div id={component.id} style={containerStyle}>
        {label && <label>{label}</label>}
        <TextArea
          value={value ?? ""}
          onChange={(value) => handleChange(value)}
          style={style}
          autosize={{ minRows: 3, maxRows: 10 }}
        />
      </div>
    );
  }

  return (
    <div id={component.id} style={containerStyle}>
      {label && <label>{label}</label>}
      <Input
        value={value ?? ""}
        onChange={(value) => handleChange(value)}
        type={type === "date" ? "text" : "text"}
        style={style}
      />
    </div>
  );
});

export default TextField;
