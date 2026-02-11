import { ComponentRegistry } from "./ComponentRegistry";

// Content components
import { AudioPlayer } from "../components/content/AudioPlayer";
import { Chart } from "../components/content/Chart";
import { Divider } from "../components/content/Divider";
import { Icon } from "../components/content/Icon";
import { Image } from "../components/content/Image";
import { Text } from "../components/content/Text";
import { Video } from "../components/content/Video";
import { Empty } from "../components/content/Empty";
import { Table } from "../components/content/Table";

// Layout components
import { Card } from "../components/layout/Card";
import { Column } from "../components/layout/Column";
import { List } from "../components/layout/List";
import { Row } from "../components/layout/Row";

// Interactive components
import { Button } from "../components/interactive/Button";
import { CheckBox } from "../components/interactive/CheckBox";
import { DateTimeInput } from "../components/interactive/DateTimeInput";
import { MultipleChoice } from "../components/interactive/MultipleChoice";
import { Slider } from "../components/interactive/Slider";
import { TextField } from "../components/interactive/TextField";
import { Modal } from "../components/layout/Modal";

/**
 * Registers all standard A2UI components in the registry.
 *
 * @param registry - The component registry to populate
 */
export function registerDefaultCatalog(registry: ComponentRegistry): void {
  // Content components (small, load immediately)
  registry.register("Text", { component: Text });
  registry.register("Image", { component: Image });
  registry.register("Icon", { component: Icon });
  registry.register("Divider", { component: Divider });
  registry.register("Video", { component: Video });
  registry.register("AudioPlayer", { component: AudioPlayer });
  registry.register("Empty", { component: Empty });
  registry.register("Table", { component: Table });
  registry.register("Chart", { component: Chart });

  // Layout components
  registry.register("Row", { component: Row });
  registry.register("Column", { component: Column });
  registry.register("List", { component: List });
  registry.register("Card", { component: Card });

  // Lazy-loaded layout components (larger, less common)
  registry.register("Tabs", {
    component: () => import("../components/layout/Tabs"),
    lazy: true,
  });
  // registry.register('Modal', {
  //   component: () => import('../components/layout/Modal'),
  //   lazy: true,
  // });
  registry.register("Modal", { component: Modal });

  // Interactive components
  registry.register("Button", { component: Button });
  registry.register("TextField", { component: TextField });
  registry.register("CheckBox", { component: CheckBox });
  registry.register("Slider", { component: Slider });
  registry.register("DateTimeInput", { component: DateTimeInput });
  registry.register("MultipleChoice", { component: MultipleChoice });
}

/**
 * Initialize the default catalog in the singleton registry.
 * Call this once at app startup.
 */
export function initializeDefaultCatalog(): void {
  registerDefaultCatalog(ComponentRegistry.getInstance());
}
