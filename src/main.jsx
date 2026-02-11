import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.tsx";
import "./index.css";

import { ConfigProvider } from 'antd';
import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider locale={locale}>
   <App />
   </ConfigProvider>
  </StrictMode>,
);
