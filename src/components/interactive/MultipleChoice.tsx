import type { Primitives, Types } from "@a2ui/lit/0.8";
import { Checkbox, Radio, Select } from "antd";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useA2UIComponent } from "../../hooks/useA2UIComponent";
import type { A2UIComponentProps } from "../../types";

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

interface Option {
  label: Primitives.StringValue;
  value: string;
}

export const MultipleChoice = memo(function MultipleChoice({
  node,
  surfaceId,
}: A2UIComponentProps<Types.MultipleChoiceNode>) {
  const { resolveString, setValue, getValue } = useA2UIComponent(
    node,
    surfaceId,
  );
  const props = node.properties;
  const options = (props.options as Option[]) ?? [];
  const maxSelections = props.maxAllowedSelections ?? 1;
  const selectionsPath = props.selections?.path;
  const isMultiple = maxSelections !== 1;

  /** ---------- 初始化 ---------- */
  const getInitialSelections = (): string[] => {
    if (!selectionsPath) return [];
    const data = getValue(selectionsPath);
    if (Array.isArray(data)) return data.map(String);
    if (data !== null && data !== undefined) return [String(data)];
    return [];
  };

  const [selections, setSelections] = useState<string[]>(getInitialSelections);

  /** ---------- 外部同步 ---------- */
  useEffect(() => {
    if (!selectionsPath) return;

    const externalValue = getValue(selectionsPath);
    if (externalValue === null || externalValue === undefined) {
      setSelections([]);
      return;
    }

    setSelections(
      Array.isArray(externalValue)
        ? externalValue.map(String)
        : [String(externalValue)],
    );
  }, [selectionsPath, getValue]);

  /** ---------- 数据回写 ---------- */
  const updateSelections = useCallback(
    (next: string[]) => {
      const nextSelections = isMultiple
        ? next.slice(0, maxSelections)
        : next.slice(0, 1);

      setSelections(nextSelections);

      if (selectionsPath) {
        const value = isMultiple ? nextSelections : (nextSelections[0] ?? "");
        setValue(selectionsPath, value);
      }
    },
    [isMultiple, maxSelections, selectionsPath, setValue, node.id],
  );

  /** ---------- Option 数据 ---------- */
  const optionItems = useMemo(
    () =>
      options.map((opt) => ({
        label: resolveString(opt.label),
        value: opt.value,
      })),
    [options, resolveString],
  );

  /** ---------- 容器样式 ---------- */

  const style: React.CSSProperties = {
    flex: node.weight ?? "initial",
    width: "100%",
  };

  if (isMultiple && optionItems.length > 5) {
    return (
      <Select
        data-id={node.id}
        mode="multiple"
        value={selections}
        onChange={(value) => updateSelections(value as string[])}
        style={style}
      >
        {optionItems.map((opt) => (
          <Select.Option key={opt.value} value={opt.value}>
            {opt.label}
          </Select.Option>
        ))}
      </Select>
    );
  }

  if (isMultiple) {
    return (
      <CheckboxGroup
        data-id={node.id}
        value={selections}
        onChange={(value) => updateSelections(value as string[])}
        style={style}
      >
        {optionItems.map((opt) => (
          <Checkbox key={opt.value} value={opt.value}>
            {opt.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
    );
  }

  return (
    <RadioGroup
      data-id={node.id}
      value={selections[0] ?? ""}
      onChange={(e) => updateSelections([e.target.value])}
      style={style}
    >
      {optionItems.map((opt) => (
        <Radio key={opt.value} value={opt.value}>
          {opt.label}
        </Radio>
      ))}
    </RadioGroup>
  );
});

export default MultipleChoice;
