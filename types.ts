export type A2UIComponentType =
  | "text"
  | "card"
  | "list"
  | "button_group"
  | "form"
  | "table"
  | "status";

export interface A2UIAction {
  label: string;
  value: string;
  type: "primary" | "secondary" | "danger";
}

export interface A2UIFormField {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "date" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export interface A2UIComponent {
  type: A2UIComponentType;
  title?: string;
  content?: string;
  items?: any[];
  actions?: A2UIAction[];
  fields?: A2UIFormField[];
  headers?: string[];
  rows?: any[][];
  variant?: "info" | "success" | "warning" | "error";
}

export interface A2UIResponse {
  message: string;
  ui?: A2UIComponent[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "system";
  text: string;
  rawJson?: string;
  ui?: any[];
  timestamp: Date;
}

import React from "react";

export type A2UIMessage =
  | { beginRendering: BeginRendering }
  | { surfaceUpdate: SurfaceUpdate }
  | { dataModelUpdate: DataModelUpdate };

export interface BeginRendering {
  surfaceId: string;
  root: string;
  styles: {
    primaryColor: string;
    font: string;
    [key: string]: any;
  };
}

export interface SurfaceUpdate {
  surfaceId: string;
  components: A2UIComponentDefinition[];
}

export interface A2UIComponentDefinition {
  id: string;
  weight?: number;
  component: {
    [key: string]: any;
  };
}

export interface DataModelUpdate {
  surfaceId: string;
  path: string;
  contents: DataValue[];
}

export interface DataValue {
  key: string;
  valueString?: string;
  valueMap?: DataValue[];
}

export interface Binding {
  literalString?: string;
  path?: string;
}

export interface Action {
  name: string;
  context?: any[];
}

export type A2UICatalog = Record<string, React.FC<any>>;

export interface RenderContext {
  basePath: string;
}
