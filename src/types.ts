import type { Primitives, Types } from "@a2ui/lit/0.8";
import type { ComponentType } from "react";

// Re-export the Types and Primitives namespaces for convenience
export type { Primitives, Types };

// Re-export commonly used types from Types namespace
export type AnyComponentNode = Types.AnyComponentNode;
export type Surface = Types.Surface;
export type SurfaceID = Types.SurfaceID;
export type Theme = Types.Theme;
export type ServerToClientMessage = Types.ServerToClientMessage;
export type A2UIClientEventMessage = Types.A2UIClientEventMessage;
export type Action = Types.Action;
export type DataValue = Types.DataValue;
export type MessageProcessor = Types.MessageProcessor;

// Re-export commonly used types from Primitives namespace
export type StringValue = Primitives.StringValue;
export type NumberValue = Primitives.NumberValue;
export type BooleanValue = Primitives.BooleanValue;

/**
 * Props passed to all A2UI React components.
 */
export interface A2UIComponentProps<
  T extends Types.AnyComponentNode = Types.AnyComponentNode,
> {
  /** The resolved component node from the A2UI message processor */
  node: T;
  /** The surface ID this component belongs to */
  surfaceId: string;
}

/**
 * A function that loads a React component asynchronously.
 */
export type ComponentLoader<
  T extends Types.AnyComponentNode = Types.AnyComponentNode,
> = () => Promise<{
  default: ComponentType<A2UIComponentProps<T>>;
}>;

/**
 * Registration entry for a component in the registry.
 */
export interface ComponentRegistration<
  T extends Types.AnyComponentNode = Types.AnyComponentNode,
> {
  /** The React component or a loader function for lazy loading */
  component: ComponentType<A2UIComponentProps<T>> | ComponentLoader<T>;
  /** If true, the component will be lazy loaded */
  lazy?: boolean;
}

/**
 * Callback for when a user action is dispatched.
 */
export type OnActionCallback = (
  message: Types.A2UIClientEventMessage,
) => void | Promise<void>;

/**
 * Configuration options for the A2UI provider.
 */
export interface A2UIProviderConfig {
  /** Callback invoked when a user action is dispatched (button click, etc.) */
  onAction?: OnActionCallback;
  /** Initial theme configuration */
  theme?: Types.Theme;
}

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
