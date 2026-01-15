import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function Welcome() {
  return <>
    <h1>Welcome Page</h1>
  </>;
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Welcome />
  </StrictMode>,
);
