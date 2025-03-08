import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";

import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import i18n from "./i18n/i18n";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeProvider>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </ThemeProvider>
);
