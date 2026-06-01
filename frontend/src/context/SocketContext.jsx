import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";

import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SOCKET_URL = import.meta.env.VITE_API_URL;

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user, isAuth } = useAuth();

  const socketRef = useRef(null);

  const [socket, setSocket] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);

  // =================================================
  // SOCKET CONNECTION
  // =================================================
  useEffect(() => {
    if (!isAuth || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }

      return;
    }

    // 🔥 prevent duplicate sockets
    if (socketRef.current) {
      return;
    }

    const s = io(SOCKET_URL, {
      autoConnect: true,
    });

    socketRef.current = s;
    setSocket(s);

    s.on("connect", () => {
      s.emit("register", user.id);
      console.log("[Socket] connected:", s.id);
    });

    // remove old listeners first
    s.off("incoming-call");
    s.off("call-ended");

    s.on("incoming-call", (payload) => {
      setIncomingCall(payload);
    });

    s.on("call-ended", () => {
      setIncomingCall(null);
    });

    s.on("disconnect", () => {
      console.log("[Socket] disconnected");
    });

    return () => {
      s.off("incoming-call");
      s.off("call-ended");

      s.disconnect();

      socketRef.current = null;
      setSocket(null);
    };
  }, [isAuth, user]);

  const clearIncomingCall = useCallback(() => {
    setIncomingCall(null);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        incomingCall,
        clearIncomingCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

const useSocket = () => {
  return useContext(SocketContext);
};

export { useSocket };
