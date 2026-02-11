import type { Types } from "@a2ui/lit/0.8";
import { DatePicker, TimePicker } from "antd";
import { memo, useCallback, useEffect, useId, useState } from "react";
import { useA2UIComponent } from "../../hooks/useA2UIComponent";
import type { A2UIComponentProps } from "../../types";

/**
 * DateTimeInput component - a date and/or time picker.
 *
 * Supports enabling date, time, or both. Uses native HTML5 date/time inputs.
 */
export const DateTimeInput = memo(function DateTimeInput({
  node,
  surfaceId,
}: A2UIComponentProps<Types.DateTimeInputNode>) {
  const { theme, resolveString, setValue, getValue } = useA2UIComponent(
    node,
    surfaceId,
  );
  const props = node.properties;
  const id = useId();
  const component = node as Types.DateTimeInputNode;
  const valuePath = props.value?.path;
  const initialValue = resolveString(props.value) ?? "";
  const enableDate = props.enableDate ?? true;
  const enableTime = props.enableTime ?? false;

  const [value, setLocalValue] = useState(initialValue);

  const style: React.CSSProperties = {
    flex: component.weight ?? "initial",
    width: "100%",
  };

  // Sync with external data model changes
  useEffect(() => {
    if (valuePath) {
      const externalValue = getValue(valuePath);
      if (externalValue !== null && String(externalValue) !== value) {
        setLocalValue(String(externalValue));
      }
    }
  }, [valuePath, getValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback(
    (value: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = value;
      setLocalValue(newValue);

      // Two-way binding: update data model
      if (valuePath) {
        setValue(valuePath, newValue);
      }
    },
    [valuePath, setValue],
  );

  // Determine input type based on enableDate and enableTime
  let inputType: "date" | "time" | "datetime-local" = "date";
  if (enableDate && enableTime) {
    inputType = "datetime-local";
  } else if (enableTime && !enableDate) {
    inputType = "time";
  }

  console.log("DateTimeInput", {
    enableDate,
    enableTime,
    inputType,
  });
  // Date and Time
  if (enableDate && enableTime) {
    return (
      <div data-id={component.id}>
        <DatePicker
          mode={inputType}
          value={value}
          onChange={handleChange}
          style={style}
          showTime={enableTime}
        />
      </div>
    );
  }

  // Time only
  if (enableTime && !enableDate) {
    return (
      <div data-id={component.id}>
        <TimePicker value={value} onChange={handleChange} style={style} />
      </div>
    );
  }

  // Date only (default)
  return (
    <div data-id={component.id}>
      <DatePicker
        mode={inputType}
        value={value}
        onChange={handleChange}
        style={style}
      />
    </div>
  );
});

export default DateTimeInput;
