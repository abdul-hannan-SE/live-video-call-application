import { createRoot } from "react-dom/client";
import App from "./App"; // make sure App is the default export of App.js
import "./index.css";

createRoot(document.getElementById("root")).render(<App />);
