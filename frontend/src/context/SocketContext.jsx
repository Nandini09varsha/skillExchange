/**
 * SocketContext
 * ─────────────
 * Provides a SINGLE shared Socket.IO connection for the entire app.
 * This is critical for WebRTC signaling: the incoming-call event must be
 * receivable on ANY page, not just the chat page.
 *
 * Also manages:
 *   • registering the logged-in userId on the socket server
 *   • exposing incomingCall state globally so the IncomingCallBanner
 *     can render from App.jsx no matter which route the user is on
 *
 * Usage:
 *   const { socket, incomingCall, clearIncomingCall } = useSocket();
 */

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

const SOCKET_URL = "http://localhost:5000";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user, isAuth } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null); // { from, fromName, callId, offer }

  // ── Connect / disconnect with auth lifecycle ──────────────────────────────
  useEffect(() => {
    if (!isAuth || !user) {
      // Not logged in — disconnect if there's a stale socket
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    // Create socket once
    const s = io(SOCKET_URL, { autoConnect: true });
    socketRef.current = s;
    setSocket(s);

    s.on("connect", () => {
      // Register so server can route calls to this socket
      s.emit("register", user.id);
      console.log("[Socket] connected & registered userId:", user.id);
    });

    // ── Global incoming-call listener ─────────────────────────────────────
    s.on("incoming-call", (payload) => {
      setIncomingCall(payload);
    });

    // Clear incoming call if callee receives a cancel (caller hung up before answer)
    s.on("call-ended", () => {
      setIncomingCall(null);
    });

    s.on("disconnect", () => {
      console.log("[Socket] disconnected");
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [isAuth, user?.id]); // eslint-disable-line

  const clearIncomingCall = useCallback(() => setIncomingCall(null), []);

  return (
    <SocketContext.Provider value={{ socket, incomingCall, clearIncomingCall }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
