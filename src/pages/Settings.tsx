import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function Settings() {
  return <>
    <h1>Settings Page</h1>
  </>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Settings />
  </StrictMode>,
);

