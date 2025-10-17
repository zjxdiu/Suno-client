import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import "./i18n"; // Import i18n configuration
import { ThemeProvider } from "./components/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <App />
  </ThemeProvider>
);