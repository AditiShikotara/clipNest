import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { store } from "./app/store";
import AuthBootstrap from "./app/AuthBootstrap";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthBootstrap>
          <App />
        </AuthBootstrap>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#181818",
              color: "#f1f1f1",
              border: "1px solid #303030",
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
