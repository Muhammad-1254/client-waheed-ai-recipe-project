import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/index.js";
import { ThemeProvider } from "./providers/theme-provider.jsx";
import { RouterProvider } from "react-router-dom";
import Router from "./components/Router.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import AuthProvider from "./providers/auth-provider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <RouterProvider router={Router} />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
