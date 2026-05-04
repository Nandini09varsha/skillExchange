// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { AuthProvider } from "./context/AuthContext";
// <<<<<<< HEAD
// import { SocketProvider } from "./context/SocketContext";
// =======
// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <AuthProvider>
// <<<<<<< HEAD
//       {/* SocketProvider must be inside AuthProvider so it can read useAuth() */}
//       <SocketProvider>
//         <App />
//       </SocketProvider>
//     </AuthProvider>
//   </StrictMode>
// );
// =======
//       <App />
//     </AuthProvider>
//   </StrictMode>
// );

// >>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
