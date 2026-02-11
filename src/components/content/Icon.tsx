import type { Types } from "@a2ui/lit/0.8";
import * as AntIcons from "@ant-design/icons";
import { memo } from "react";
import { useA2UIComponent } from "../../hooks/useA2UIComponent";
import { classMapToString, stylesToObject } from "../../lib/utils";
import type { A2UIComponentProps } from "../../types";

/**
 * 将首字母大写，适配 Ant Design 图标命名
 * e.g., "shoppingCart" -> "ShoppingCart"
 */
function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 获取 Ant Design 图标组件
 * @param name 图标名称（camelCase 或 PascalCase）
 * @returns 图标组件或 null
 */
function getAntIcon(name: string): React.ComponentType<any> | null {
  // 转换为 PascalCase
  const pascalName = toPascalCase(name);

  // Ant Design 图标映射表
  const iconMap: Record<string, React.ComponentType<any>> = {
    // 常用图标
    home: AntIcons.HomeOutlined,
    user: AntIcons.UserOutlined,
    settings: AntIcons.SettingOutlined,
    search: AntIcons.SearchOutlined,
    plus: AntIcons.PlusOutlined,
    minus: AntIcons.MinusOutlined,
    close: AntIcons.CloseOutlined,
    check: AntIcons.CheckOutlined,
    info: AntIcons.InfoCircleOutlined,
    warning: AntIcons.WarningOutlined,
    error: AntIcons.CloseCircleOutlined,
    success: AntIcons.CheckCircleOutlined,
    star: AntIcons.StarOutlined,
    starFilled: AntIcons.StarFilled,
    heart: AntIcons.HeartOutlined,
    heartFilled: AntIcons.HeartFilled,
    delete: AntIcons.DeleteOutlined,
    edit: AntIcons.EditOutlined,
    save: AntIcons.SaveOutlined,
    download: AntIcons.DownloadOutlined,
    upload: AntIcons.UploadOutlined,
    share: AntIcons.ShareAltOutlined,
    copy: AntIcons.CopyOutlined,
    link: AntIcons.LinkOutlined,

    mail: AntIcons.MailOutlined,
    phone: AntIcons.PhoneOutlined,
    location: AntIcons.EnvironmentOutlined,
    calendar: AntIcons.CalendarOutlined,
    clock: AntIcons.ClockCircleOutlined,
    arrowRight: AntIcons.ArrowRightOutlined,
    arrowLeft: AntIcons.ArrowLeftOutlined,
    arrowUp: AntIcons.ArrowUpOutlined,
    arrowDown: AntIcons.ArrowDownOutlined,
    menu: AntIcons.MenuOutlined,
    more: AntIcons.MoreOutlined,
    filter: AntIcons.FilterOutlined,
    sort: AntIcons.SortAscendingOutlined,
    refresh: AntIcons.ReloadOutlined,
    zoomIn: AntIcons.ZoomInOutlined,
    zoomOut: AntIcons.ZoomOutOutlined,
    folder: AntIcons.FolderOutlined,
    file: AntIcons.FileOutlined,
    image: AntIcons.FileImageOutlined,
    video: AntIcons.VideoCameraOutlined,
    audio: AntIcons.AudioOutlined,
    lock: AntIcons.LockOutlined,
    unlock: AntIcons.UnlockOutlined,
    eye: AntIcons.EyeOutlined,
    eyeInvisible: AntIcons.EyeInvisibleOutlined,
    bell: AntIcons.BellOutlined,
    gift: AntIcons.GiftOutlined,
    tag: AntIcons.TagOutlined,
    tags: AntIcons.TagsOutlined,
    dashboard: AntIcons.DashboardOutlined,
    chart: AntIcons.LineChartOutlined,
    table: AntIcons.TableOutlined,
    list: AntIcons.UnorderedListOutlined,
    grid: AntIcons.AppstoreOutlined,
    shop: AntIcons.ShopOutlined,
    cart: AntIcons.ShoppingCartOutlined,
    wallet: AntIcons.WalletOutlined,
    bank: AntIcons.BankOutlined,
    creditCard: AntIcons.CreditCardOutlined,
    security: AntIcons.SafetyOutlined,
    help: AntIcons.QuestionCircleOutlined,
    support: AntIcons.CustomerServiceOutlined,
    document: AntIcons.FileTextOutlined,
    folderOpen: AntIcons.FolderOpenOutlined,
    cloud: AntIcons.CloudOutlined,
    cloudDownload: AntIcons.CloudDownloadOutlined,
    cloudUpload: AntIcons.CloudUploadOutlined,
    wifi: AntIcons.WifiOutlined,

    volume: AntIcons.SoundOutlined,
    mute: AntIcons.StopOutlined,
    play: AntIcons.PlayCircleOutlined,
    pause: AntIcons.PauseCircleOutlined,

    forward: AntIcons.ForwardOutlined,
    backward: AntIcons.BackwardOutlined,
    skip: AntIcons.StepForwardOutlined,
    rewind: AntIcons.StepBackwardOutlined,
    fullScreen: AntIcons.FullscreenOutlined,
    fullScreenExit: AntIcons.FullscreenExitOutlined,
    scan: AntIcons.ScanOutlined,
    qr: AntIcons.QrcodeOutlined,
    barCode: AntIcons.BarcodeOutlined,
    camera: AntIcons.CameraOutlined,

    message: AntIcons.MessageOutlined,
    notification: AntIcons.NotificationOutlined,
    comment: AntIcons.CommentOutlined,
    like: AntIcons.LikeOutlined,
    dislike: AntIcons.DislikeOutlined,

    plusCircle: AntIcons.PlusCircleOutlined,
    minusCircle: AntIcons.MinusCircleOutlined,
    closeCircle: AntIcons.CloseCircleOutlined,
    checkCircle: AntIcons.CheckCircleOutlined,
    infoCircle: AntIcons.InfoCircleOutlined,
    warningCircle: AntIcons.WarningOutlined,
    exclamationCircle: AntIcons.ExclamationCircleOutlined,
    loading: AntIcons.LoadingOutlined,
    sync: AntIcons.SyncOutlined,
    redo: AntIcons.RedoOutlined,
    undo: AntIcons.UndoOutlined,

    alignLeft: AntIcons.AlignLeftOutlined,
    alignCenter: AntIcons.AlignCenterOutlined,
    alignRight: AntIcons.AlignRightOutlined,
    bold: AntIcons.BoldOutlined,
    italic: AntIcons.ItalicOutlined,
    underline: AntIcons.UnderlineOutlined,
    strikethrough: AntIcons.StrikethroughOutlined,
    font: AntIcons.FontSizeOutlined,
    color: AntIcons.BgColorsOutlined,
    highlight: AntIcons.HighlightOutlined,
    linkUrl: AntIcons.LinkOutlined,

    orderedList: AntIcons.OrderedListOutlined,
    unorderedList: AntIcons.UnorderedListOutlined,

    code: AntIcons.CodeOutlined,
    imagePlus: AntIcons.PictureOutlined,
    videoPlus: AntIcons.VideoCameraAddOutlined,
    attach: AntIcons.PaperClipOutlined,
    paperclip: AntIcons.PaperClipOutlined,
  };

  // 先尝试精确匹配，再尝试不区分大小写
  return (
    iconMap[pascalName] ||
    iconMap[name] ||
    Object.entries(iconMap).find(
      ([key]) => key.toLowerCase() === name.toLowerCase(),
    )?.[1] ||
    null
  );
}

/**
 * Icon component - renders an icon using Ant Design Icons.
 *
 * This matches the Ant Design icon library naming convention (PascalCase).
 *
 * @example Usage with Ant Design icons:
 * - "home" -> HomeOutlined icon
 * - "user" -> UserOutlined icon
 * - "shoppingCart" -> ShoppingCartOutlined icon
 */
export const Icon = memo(function Icon({
  node,
  surfaceId,
}: A2UIComponentProps<Types.IconNode>) {
  const { theme, resolveString } = useA2UIComponent(node, surfaceId);
  const props = node.properties;

  const iconName = resolveString(props.name);

  if (!iconName) {
    return null;
  }

  const IconComponent = getAntIcon(iconName);

  if (!IconComponent) {
    // 如果找不到图标，显示默认图标或提示
    return (
      <section
        className={classMapToString(theme.components.Icon)}
        style={stylesToObject(theme.additionalStyles?.Icon)}
      >
        <AntIcons.QuestionOutlined className="text-slate-400" />
      </section>
    );
  }

  return (
    <section
      className={classMapToString(theme.components.Icon)}
      style={stylesToObject(theme.additionalStyles?.Icon)}
    >
      <IconComponent />
    </section>
  );
});

export default Icon;
