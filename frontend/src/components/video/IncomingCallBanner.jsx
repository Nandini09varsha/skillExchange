/**
 * IncomingCallBanner
 * ──────────────────
 * Floating toast notification that appears on ANY page when another user
 * initiates a call. Mounted once in App.jsx, always listening.
 *
 * On Accept → navigates to /video-call/:callerId?incoming=true
 * On Decline → emits reject-call and dismisses
 *
 * Props:
 *   incomingCall      – { from, fromName, callId, offer } from SocketContext
 *   socket            – shared socket from SocketContext
 *   onAccept          – called before navigation (clears incomingCall state)
 *   onReject          – called on decline (clears incomingCall state)
 */

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function IncomingCallBanner({ incomingCall, socket, onAccept, onReject }) {
  const navigate = useNavigate();
  const audioCtxRef = useRef(null);
  const ringTimerRef = useRef(null);
  const stoppedRef = useRef(false);

  // ── Ringing tone using Web Audio API (no audio file needed) ───────────────
  useEffect(() => {
    if (!incomingCall) return;
    stoppedRef.current = false;

    const playBeep = () => {
      if (stoppedRef.current) return;
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ctx;

        // Two-tone phone ring: 440 Hz + 480 Hz
        [440, 480].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
          gain.gain.setValueAtTime(0.08, ctx.currentTime + 0.35);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
          osc.start(ctx.currentTime + i * 0.01);
          osc.stop(ctx.currentTime + 0.55);
        });

        // Ring again after 1.8 s
        ringTimerRef.current = setTimeout(playBeep, 1800);
      } catch (_) {}
    };

    playBeep();

    return () => {
      stoppedRef.current = true;
      clearTimeout(ringTimerRef.current);
      try { audioCtxRef.current?.close(); } catch (_) {}
    };
  }, [incomingCall?.callId]); // re-run only if a new call arrives

  if (!incomingCall) return null;

  const handleAccept = () => {
    onAccept(); // clears SocketContext.incomingCall
    navigate(`/video-call/${incomingCall.from}?incoming=true`, {
      state: { remoteName: incomingCall.fromName },
    });
  };

  const handleReject = () => {
    socket?.emit("reject-call", {
      to: incomingCall.from,
      callId: incomingCall.callId,
    });
    onReject();
  };

  return (
    <>
      <style>{`
        @keyframes ss-slide-in {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes ss-avatar-pulse {
          0%, 100% { box-shadow: 0 0 0 0   rgba(34,197,94, 0.5); }
          50%       { box-shadow: 0 0 0 14px rgba(34,197,94, 0);   }
        }
      `}</style>

      {/* Banner card */}
      <div
        className="fixed top-5 right-5 z-[200] w-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{
          background: "linear-gradient(135deg, #1a2634 0%, #202c33 100%)",
          animation: "ss-slide-in 0.35s cubic-bezier(.22,.68,0,1.2) forwards",
        }}
      >
        {/* Coloured top stripe */}
        <div className="h-1 bg-gradient-to-r from-green-500 to-teal-400" />

        <div className="p-4">
          {/* Caller info row */}
          <div className="flex items-center gap-3 mb-4">
            {/* Pulsing avatar */}
            <div
              className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0"
              style={{ animation: "ss-avatar-pulse 1.4s infinite" }}
            >
              {incomingCall.fromName?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-white font-semibold leading-tight">
                {incomingCall.fromName || "Someone"}
              </p>
              <p className="text-green-400 text-sm flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
                Incoming video call…
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleReject}
              className="flex-1 py-2.5 rounded-full bg-red-600 hover:bg-red-500 active:bg-red-700
                         text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              📵 Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 py-2.5 rounded-full bg-green-600 hover:bg-green-500 active:bg-green-700
                         text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              🎥 Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
