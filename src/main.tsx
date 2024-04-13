import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./app/store";
import { ConfigProvider } from "antd";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#e45f2b",
            },
          }}
        >
      <App />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
);
