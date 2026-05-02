/**
 * VideoCallPage
 * Route: /video-call/:userId
 *
 * Full-screen video call page.
 * Opens as outgoing call (when user clicks 🎥 in chat).
 * Also mounts when callee accepts via IncomingCallBanner and is navigated here.
 *
 * URL search params:
 *   ?incoming=true   → this is the callee's side; auto-accept on mount
 *   ?name=Alice      → remote user's display name (passed via navigate state)
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useWebRTC, CALL_STATE } from "../hooks/useWebRTC";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDuration(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function ConnectionBadge({ status }) {
  const map = {
    new: { label: "Initialising", color: "bg-yellow-500" },
    checking: { label: "Connecting…", color: "bg-yellow-400 animate-pulse" },
    connected: { label: "Connected", color: "bg-green-500" },
    completed: { label: "Connected", color: "bg-green-500" },
    disconnected: { label: "Reconnecting…", color: "bg-orange-400 animate-pulse" },
    failed: { label: "Failed", color: "bg-red-500" },
    closed: { label: "Closed", color: "bg-gray-500" },
  };
  const { label, color } = map[status] || { label: status, color: "bg-gray-500" };
  if (!status) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-medium ${color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
      {label}
    </span>
  );
}

function ControlBtn({ onClick, active, danger, disabled, label, emoji }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`
        flex flex-col items-center gap-1.5 group
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span className={`
        w-14 h-14 rounded-full flex items-center justify-center text-xl
        shadow-lg transition-all duration-150
        ${danger
          ? "bg-red-600 hover:bg-red-500 text-white"
          : active
            ? "bg-white text-gray-900 hover:bg-gray-100"
            : "bg-white/20 hover:bg-white/30 text-white"
        }
      `}>
        {emoji}
      </span>
      <span className="text-[11px] text-white/70 group-hover:text-white/90 transition">
        {label}
      </span>
    </button>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────
export default function VideoCallPage() {
  const { userId: remoteUserId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isIncoming = searchParams.get("incoming") === "true";
  // Remote user name: passed via navigation state or query param
  const remoteName =
    location.state?.remoteName ||
    searchParams.get("name") ||
    "User";

  const { socket, incomingCall, clearIncomingCall } = useSocket();

  // Get current user from localStorage
  const currentUserId = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.id || null;
    } catch {
      return null;
    }
  })();

  const onCallEnd = useCallback(() => {
    // Go back to chat after a short pause so user sees "Call ended"
    setTimeout(() => navigate(`/chat/${remoteUserId}`), 1500);
  }, [navigate, remoteUserId]);

  const rtc = useWebRTC({
    socket,
    currentUserId,
    remoteUserId,
    incomingCall,
    onCallEnd,
  });

  const {
    localVideoRef,
    remoteVideoRef,
    callState,
    connectionStatus,
    isMuted,
    isCameraOff,
    isSharingScreen,
    callDuration,
    error,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMic,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
  } = rtc;

  const hasInitialised = useRef(false);

  // ── On mount: start or accept call ───────────────────────────────────────
  useEffect(() => {
    if (hasInitialised.current) return;
    hasInitialised.current = true;

    if (isIncoming && incomingCall) {
      acceptCall();
      clearIncomingCall();
    } else if (!isIncoming) {
      startCall();
    }
  }, []); // eslint-disable-line

  // ── Derived UI states ─────────────────────────────────────────────────────
  const isConnected = callState === CALL_STATE.IN_CALL;
  const isWaiting =
    callState === CALL_STATE.CALLING ||
    callState === CALL_STATE.CONNECTING ||
    callState === CALL_STATE.RINGING;
  const controlsEnabled = isConnected;

  return (
    <div className="relative h-screen w-screen bg-gray-950 flex flex-col overflow-hidden select-none">

      {/* ── Remote video (full-screen background) ─────────────────────── */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ── Overlay gradient ──────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

      {/* ── Waiting / idle placeholder ────────────────────────────────── */}
      {!isConnected && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full bg-purple-700 flex items-center justify-center text-white text-5xl font-bold mb-5 shadow-2xl ring-4 ring-purple-500/40">
            {remoteName.charAt(0).toUpperCase()}
          </div>
          <p className="text-white text-2xl font-semibold">{remoteName}</p>

          {/* Status */}
          <p className="text-gray-300 mt-2 text-base flex items-center gap-2">
            {callState === CALL_STATE.CALLING && (
              <>
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </span>
                Calling…
              </>
            )}
            {callState === CALL_STATE.RINGING && "Incoming call…"}
            {callState === CALL_STATE.CONNECTING && "Connecting…"}
            {callState === CALL_STATE.ENDED && "Call ended"}
          </p>

          {/* Reject button for incoming */}
          {callState === CALL_STATE.RINGING && (
            <div className="flex gap-6 mt-8">
              <button
                onClick={rejectCall}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-2xl flex items-center justify-center shadow-xl transition"
              >
                📵
              </button>
              <button
                onClick={() => { acceptCall(); clearIncomingCall(); }}
                className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-500 text-2xl flex items-center justify-center shadow-xl transition"
              >
                🎥
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Error banner ──────────────────────────────────────────────── */}
      {error && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-red-800/90 backdrop-blur-sm px-5 py-3 flex items-center justify-between">
          <p className="text-white text-sm">⚠️ {error}</p>
          <button
            onClick={() => navigate(`/chat/${remoteUserId}`)}
            className="text-red-200 hover:text-white text-xs underline ml-4"
          >
            Back to chat
          </button>
        </div>
      )}

      {/* ── Top bar: name + status ─────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-5">
        <div className="flex items-center gap-3">
          {/* Back to chat */}
          <button
            onClick={() => {
              endCall();
            }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition mr-1"
            title="Back to chat"
          >
            ←
          </button>
          <div>
            <p className="text-white font-semibold text-lg leading-tight">{remoteName}</p>
            {isConnected && (
              <p className="text-green-400 text-sm">{formatDuration(callDuration)}</p>
            )}
          </div>
        </div>

        <ConnectionBadge status={connectionStatus} />
      </div>

      {/* ── Screen share badge ─────────────────────────────────────────── */}
      {isSharingScreen && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-blue-600/90 backdrop-blur-sm text-white text-xs px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
          <span>🖥️</span> You are sharing your screen
        </div>
      )}

      {/* ── Local preview (picture-in-picture) ────────────────────────── */}
      <div className="absolute bottom-28 right-5 z-20 w-36 h-24 md:w-44 md:h-28 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-gray-900">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${!isSharingScreen ? "[transform:scaleX(-1)]" : ""}`}
        />
        {isCameraOff && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
            <span className="text-2xl">📷</span>
            <span className="text-white text-xs ml-1">Off</span>
          </div>
        )}
        <div className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-white/60">
          You
        </div>
      </div>

      {/* ── Control bar ───────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-6 pt-4 px-8 flex items-end justify-center gap-5 md:gap-8">
        {/* Mic */}
        <ControlBtn
          onClick={toggleMic}
          active={!isMuted}
          disabled={!controlsEnabled}
          emoji={isMuted ? "🔇" : "🎤"}
          label={isMuted ? "Unmute" : "Mute"}
        />

        {/* Camera */}
        <ControlBtn
          onClick={toggleCamera}
          active={!isCameraOff}
          disabled={!controlsEnabled}
          emoji={isCameraOff ? "📷" : "🎥"}
          label={isCameraOff ? "Cam On" : "Cam Off"}
        />

        {/* End call (centre, biggest) */}
        <button
          onClick={endCall}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-3xl flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95"
          title="End Call"
        >
          📵
        </button>

        {/* Screen share */}
        <ControlBtn
          onClick={isSharingScreen ? stopScreenShare : startScreenShare}
          active={isSharingScreen}
          disabled={!controlsEnabled}
          emoji="🖥️"
          label={isSharingScreen ? "Stop Share" : "Share Screen"}
        />

        {/* Back to chat without ending */}
        <ControlBtn
          onClick={() => navigate(`/chat/${remoteUserId}`)}
          disabled={false}
          emoji="💬"
          label="Chat"
        />
      </div>
    </div>
  );
}









// import { useEffect, useRef, useState, useCallback } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { useSocket } from "../context/SocketContext";
// import { useWebRTC, CALL_STATE } from "../hooks/useWebRTC";

// // ── Helpers ───────────────────────────────────────────────────────────────────
// function formatDuration(sec) {
//   const m = Math.floor(sec / 60).toString().padStart(2, "0");
//   const s = (sec % 60).toString().padStart(2, "0");
//   return `${m}:${s}`;
// }

// function ConnectionBadge({ status }) {
//   const map = {
//     new: { label: "Initialising", color: "bg-yellow-500" },
//     checking: { label: "Connecting…", color: "bg-yellow-400 animate-pulse" },
//     connected: { label: "Connected", color: "bg-green-500" },
//     completed: { label: "Connected", color: "bg-green-500" },
//     disconnected: { label: "Reconnecting…", color: "bg-orange-400 animate-pulse" },
//     failed: { label: "Failed", color: "bg-red-500" },
//     closed: { label: "Closed", color: "bg-gray-500" },
//   };
//   const { label, color } = map[status] || { label: status, color: "bg-gray-500" };
//   if (!status) return null;
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-medium ${color}`}>
//       <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
//       {label}
//     </span>
//   );
// }

// function ControlBtn({ onClick, active, danger, disabled, label, emoji }) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       title={label}
//       className={`
//         flex flex-col items-center gap-1.5 group
//         ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
//       `}
//     >
//       <span className={`
//         w-14 h-14 rounded-full flex items-center justify-center text-xl
//         shadow-lg transition-all duration-150
//         ${danger
//           ? "bg-red-600 hover:bg-red-500 text-white"
//           : active
//             ? "bg-white text-gray-900 hover:bg-gray-100"
//             : "bg-white/20 hover:bg-white/30 text-white"
//         }
//       `}>
//         {emoji}
//       </span>
//       <span className="text-[11px] text-white/70 group-hover:text-white/90 transition">
//         {label}
//       </span>
//     </button>
//   );
// }

// // ── Page Component ────────────────────────────────────────────────────────────
// export default function VideoCallPage() {
//   const { userId: remoteUserId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Remote user name: passed via navigation state
//   const remoteName = location.state?.remoteName || "User";

//   const { socket } = useSocket();

//   // Get current user from localStorage
//   const currentUserId = (() => {
//     try {
//       return JSON.parse(localStorage.getItem("user"))?.id || null;
//     } catch {
//       return null;
//     }
//   })();

//   const onCallEnd = useCallback(() => {
//     // Go back to chat after a short pause so user sees "Call ended"
//     setTimeout(() => navigate(`/chat/${remoteUserId}`), 1500);
//   }, [navigate, remoteUserId]);

//   const rtc = useWebRTC({
//     socket,
//     currentUserId,
//     remoteUserId,
//     incomingCall: null, // No longer using IncomingCallBanner flow
//     onCallEnd,
//   });

//   const {
//     localVideoRef,
//     remoteVideoRef,
//     callState,
//     connectionStatus,
//     isMuted,
//     isCameraOff,
//     isSharingScreen,
//     callDuration,
//     error,
//     startCall,
//     endCall,
//     toggleMic,
//     toggleCamera,
//     startScreenShare,
//     stopScreenShare,
//   } = rtc;

//   const hasInitialised = useRef(false);

//   // ── On mount: automatically start WebRTC call ──────────────────────────
//   // Both users arrive here after accepting the video call request
//   useEffect(() => {
//     if (hasInitialised.current) return;
//     hasInitialised.current = true;

//     // Automatically start the WebRTC connection
//     // The video call request was already accepted in Chat.jsx
//     startCall();
//   }, []); // eslint-disable-line

//   // ── Derived UI states ─────────────────────────────────────────────────────
//   const isConnected = callState === CALL_STATE.IN_CALL;
//   const isWaiting =
//     callState === CALL_STATE.CALLING ||
//     callState === CALL_STATE.CONNECTING ||
//     callState === CALL_STATE.RINGING;
//   const controlsEnabled = isConnected;

//   return (
//     <div className="relative h-screen w-screen bg-gray-950 flex flex-col overflow-hidden select-none">

//       {/* ── Remote video (full-screen background) ─────────────────────── */}
//       <video
//         ref={remoteVideoRef}
//         autoPlay
//         playsInline
//         className="absolute inset-0 w-full h-full object-cover"
//       />

//       {/* ── Overlay gradient ──────────────────────────────────────────── */}
//       <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

//       {/* ── Waiting / idle placeholder ────────────────────────────────── */}
//       {!isConnected && (
//         <div className="absolute inset-0 flex flex-col items-center justify-center">
//           {/* Avatar */}
//           <div className="w-28 h-28 rounded-full bg-purple-700 flex items-center justify-center text-white text-5xl font-bold mb-5 shadow-2xl ring-4 ring-purple-500/40">
//             {remoteName.charAt(0).toUpperCase()}
//           </div>
//           <p className="text-white text-2xl font-semibold">{remoteName}</p>

//           {/* Status */}
//           <p className="text-gray-300 mt-2 text-base flex items-center gap-2">
//             {callState === CALL_STATE.CALLING && (
//               <>
//                 <span className="flex gap-1">
//                   {[0, 1, 2].map((i) => (
//                     <span
//                       key={i}
//                       className="w-2 h-2 rounded-full bg-green-400 animate-bounce"
//                       style={{ animationDelay: `${i * 0.18}s` }}
//                     />
//                   ))}
//                 </span>
//                 Connecting to call…
//               </>
//             )}
//             {callState === CALL_STATE.CONNECTING && "Connecting…"}
//             {callState === CALL_STATE.ENDED && "Call ended"}
//           </p>
//         </div>
//       )}

//       {/* ── Error banner ──────────────────────────────────────────────── */}
//       {error && (
//         <div className="absolute top-0 left-0 right-0 z-50 bg-red-800/90 backdrop-blur-sm px-5 py-3 flex items-center justify-between">
//           <p className="text-white text-sm">⚠️ {error}</p>
//           <button
//             onClick={() => navigate(`/chat/${remoteUserId}`)}
//             className="text-red-200 hover:text-white text-xs underline ml-4"
//           >
//             Back to chat
//           </button>
//         </div>
//       )}

//       {/* ── Top bar: name + status ─────────────────────────────────────── */}
//       <div className="relative z-10 flex items-center justify-between px-6 pt-5">
//         <div className="flex items-center gap-3">
//           {/* Back to chat */}
//           <button
//             onClick={() => {
//               endCall();
//             }}
//             className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition mr-1"
//             title="Back to chat"
//           >
//             ←
//           </button>
//           <div>
//             <p className="text-white font-semibold text-lg leading-tight">{remoteName}</p>
//             {isConnected && (
//               <p className="text-green-400 text-sm">{formatDuration(callDuration)}</p>
//             )}
//           </div>
//         </div>

//         <ConnectionBadge status={connectionStatus} />
//       </div>

//       {/* ── Screen share badge ─────────────────────────────────────────── */}
//       {isSharingScreen && (
//         <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-blue-600/90 backdrop-blur-sm text-white text-xs px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
//           <span>🖥️</span> You are sharing your screen
//         </div>
//       )}

//       {/* ── Local preview (picture-in-picture) ────────────────────────── */}
//       <div className="absolute bottom-28 right-5 z-20 w-36 h-24 md:w-44 md:h-28 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-gray-900">
//         <video
//           ref={localVideoRef}
//           autoPlay
//           playsInline
//           muted
//           className={`w-full h-full object-cover ${!isSharingScreen ? "[transform:scaleX(-1)]" : ""}`}
//         />
//         {isCameraOff && (
//           <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
//             <span className="text-2xl">📷</span>
//             <span className="text-white text-xs ml-1">Off</span>
//           </div>
//         )}
//         <div className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-white/60">
//           You
//         </div>
//       </div>

//       {/* ── Control bar ───────────────────────────────────────────────── */}
//       <div className="absolute bottom-0 left-0 right-0 z-20 pb-6 pt-4 px-8 flex items-end justify-center gap-5 md:gap-8">
//         {/* Mic */}
//         <ControlBtn
//           onClick={toggleMic}
//           active={!isMuted}
//           disabled={!controlsEnabled}
//           emoji={isMuted ? "🔇" : "🎤"}
//           label={isMuted ? "Unmute" : "Mute"}
//         />

//         {/* Camera */}
//         <ControlBtn
//           onClick={toggleCamera}
//           active={!isCameraOff}
//           disabled={!controlsEnabled}
//           emoji={isCameraOff ? "📷" : "🎥"}
//           label={isCameraOff ? "Cam On" : "Cam Off"}
//         />

//         {/* End call (centre, biggest) */}
//         <button
//           onClick={endCall}
//           className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-3xl flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95"
//           title="End Call"
//         >
//           📵
//         </button>

//         {/* Screen share */}
//         <ControlBtn
//           onClick={isSharingScreen ? stopScreenShare : startScreenShare}
//           active={isSharingScreen}
//           disabled={!controlsEnabled}
//           emoji="🖥️"
//           label={isSharingScreen ? "Stop Share" : "Share Screen"}
//         />

//         {/* Back to chat without ending */}
//         <ControlBtn
//           onClick={() => navigate(`/chat/${remoteUserId}`)}
//           disabled={false}
//           emoji="💬"
//           label="Chat"
//         />
//       </div>
//     </div>
//   );
// }
