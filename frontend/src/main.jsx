import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
<<<<<<< HEAD
import { SocketProvider } from "./context/SocketContext";
=======
>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
<<<<<<< HEAD
      {/* SocketProvider must be inside AuthProvider so it can read useAuth() */}
      <SocketProvider>
        <App />
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);
=======
      <App />
    </AuthProvider>
  </StrictMode>
);

>>>>>>> 95b447386837e20fc0483b1252c4ec9a3ac5e12f
