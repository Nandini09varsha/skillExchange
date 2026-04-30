/**
 * useWebRTC
 * ─────────
 * Encapsulates all WebRTC + Socket.IO signaling for a single peer call.
 * Designed to be used ONLY inside the VideoCallPage component.
 *
 * Props:
 *   socket        – shared socket from SocketContext
 *   currentUserId – logged-in user's MongoDB _id
 *   remoteUserId  – the other user's MongoDB _id
 *   incomingCall  – { from, fromName, callId, offer } | null  (from SocketContext)
 *   onCallEnd     – callback to navigate away when call ends
 *
 * Returns: { localVideoRef, remoteVideoRef, callState, isMuted, isCameraOff,
 *             isSharingScreen, callDuration, error, connectionStatus,
 *             startCall, acceptCall, rejectCall, endCall,
 *             toggleMic, toggleCamera, startScreenShare, stopScreenShare }
 */

import { useRef, useState, useEffect, useCallback } from "react";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

// call states
export const CALL_STATE = {
  IDLE: "idle",
  CALLING: "calling",     // outgoing, waiting for answer
  RINGING: "ringing",     // incoming, waiting for user to accept
  CONNECTING: "connecting", // SDP exchanged, ICE in progress
  IN_CALL: "in-call",
  ENDED: "ended",
};

export function useWebRTC({
  socket,
  currentUserId,
  remoteUserId,
  incomingCall,
  onCallEnd,
}) {
  // ── Refs ──────────────────────────────────────────────────────────────────
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);              // RTCPeerConnection
  const localStreamRef = useRef(null);     // camera+mic stream
  const screenStreamRef = useRef(null);    // screen capture stream
  const callTimerRef = useRef(null);
  const pendingCandidatesRef = useRef([]); // ICE candidates buffered before remoteDesc
  const activeCallIdRef = useRef(null);    // callId currently in use

  // ── State ─────────────────────────────────────────────────────────────────
  const [callState, setCallState] = useState(CALL_STATE.IDLE);
  const [connectionStatus, setConnectionStatus] = useState(""); // RTCPeerConnection state
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState(null);

  // ── Timer ─────────────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    setCallDuration(0);
    callTimerRef.current = setInterval(
      () => setCallDuration((d) => d + 1),
      1000
    );
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(callTimerRef.current);
    callTimerRef.current = null;
  }, []);

  // ── Media helpers ─────────────────────────────────────────────────────────
  const stopLocalStream = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
  }, []);

  const stopScreenStream = useCallback(() => {
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
  }, []);

  const closePeerConnection = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    pendingCandidatesRef.current = [];
  }, []);

  // ── Full teardown ─────────────────────────────────────────────────────────
  const fullReset = useCallback(
    (nextState = CALL_STATE.ENDED) => {
      stopTimer();
      stopLocalStream();
      stopScreenStream();
      closePeerConnection();
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      activeCallIdRef.current = null;
      setCallState(nextState);
      setIsMuted(false);
      setIsCameraOff(false);
      setIsSharingScreen(false);
      setConnectionStatus("");
    },
    [stopTimer, stopLocalStream, stopScreenStream, closePeerConnection]
  );

  // ── Get camera + mic ──────────────────────────────────────────────────────
  const getUserMedia = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: true,
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    return stream;
  }, []);

  // ── Drain buffered ICE candidates ─────────────────────────────────────────
  const drainPendingCandidates = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc?.remoteDescription) return;
    for (const c of pendingCandidatesRef.current) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(c));
      } catch (e) {
        console.warn("[WebRTC] queued ICE add failed:", e);
      }
    }
    pendingCandidatesRef.current = [];
  }, []);

  // ── Build RTCPeerConnection ───────────────────────────────────────────────
  const buildPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = ({ candidate }) => {
      if (candidate && socket && remoteUserId) {
        socket.emit("ice-candidate", { to: remoteUserId, candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      setConnectionStatus(pc.connectionState);
      if (pc.connectionState === "connected") {
        setCallState(CALL_STATE.IN_CALL);
      }
      if (pc.connectionState === "failed") {
        setError("Connection failed — check your network and try again.");
        fullReset();
        onCallEnd?.();
      }
      if (pc.connectionState === "disconnected") {
        // Give 6 s grace period before giving up
        setTimeout(() => {
          if (pcRef.current?.connectionState === "disconnected") {
            setError("Remote peer disconnected.");
            fullReset();
            onCallEnd?.();
          }
        }, 6000);
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pcRef.current = pc;
    return pc;
  }, [socket, remoteUserId, fullReset, onCallEnd]);

  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC ACTIONS
  // ─────────────────────────────────────────────────────────────────────────

  // ── Initiate outgoing call ────────────────────────────────────────────────
  const startCall = useCallback(async () => {
    if (!socket || !remoteUserId || !currentUserId) return;
    setError(null);
    try {
      const stream = await getUserMedia();
      const pc = buildPeerConnection();
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const stored = localStorage.getItem("user");
      const fromName = stored ? JSON.parse(stored).name : "Someone";

      socket.emit("call-user", {
        to: remoteUserId,
        from: currentUserId,
        fromName,
        offer,
      });

      setCallState(CALL_STATE.CALLING);
    } catch (err) {
      console.error("[WebRTC] startCall:", err);
      if (err.name === "NotAllowedError") {
        setError("Camera/microphone access denied. Please allow in browser settings.");
      } else {
        setError("Could not start call: " + err.message);
      }
      fullReset(CALL_STATE.IDLE);
    }
  }, [socket, remoteUserId, currentUserId, getUserMedia, buildPeerConnection, fullReset]);

  // ── Accept incoming call ──────────────────────────────────────────────────
  const acceptCall = useCallback(async () => {
    if (!incomingCall) return;
    setError(null);
    activeCallIdRef.current = incomingCall.callId;

    try {
      const stream = await getUserMedia();
      const pc = buildPeerConnection();
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      await pc.setRemoteDescription(
        new RTCSessionDescription(incomingCall.offer)
      );
      await drainPendingCandidates();

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer-call", {
        to: incomingCall.from,
        callId: incomingCall.callId,
        answer,
      });

      setCallState(CALL_STATE.CONNECTING);
      startTimer();
    } catch (err) {
      console.error("[WebRTC] acceptCall:", err);
      setError("Could not join call: " + err.message);
      fullReset(CALL_STATE.IDLE);
    }
  }, [
    incomingCall,
    getUserMedia,
    buildPeerConnection,
    drainPendingCandidates,
    socket,
    startTimer,
    fullReset,
  ]);

  // ── Reject incoming call ──────────────────────────────────────────────────
  const rejectCall = useCallback(() => {
    if (!incomingCall) return;
    socket?.emit("reject-call", {
      to: incomingCall.from,
      callId: incomingCall.callId,
    });
    fullReset(CALL_STATE.IDLE);
    onCallEnd?.();
  }, [incomingCall, socket, fullReset, onCallEnd]);

  // ── End active / outgoing call ────────────────────────────────────────────
  const endCall = useCallback(() => {
    socket?.emit("end-call", {
      to: remoteUserId,
      callId: activeCallIdRef.current,
      hadScreenShare: isSharingScreen,
    });
    fullReset();
    onCallEnd?.();
  }, [socket, remoteUserId, isSharingScreen, fullReset, onCallEnd]);

  // ── Toggle mic ────────────────────────────────────────────────────────────
  const toggleMic = useCallback(() => {
    localStreamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsMuted((m) => !m);
  }, []);

  // ── Toggle camera ─────────────────────────────────────────────────────────
  const toggleCamera = useCallback(() => {
    localStreamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsCameraOff((c) => !c);
  }, []);

  // ── Start screen share ────────────────────────────────────────────────────
  const startScreenShare = useCallback(async () => {
    if (isSharingScreen) return;
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      screenStreamRef.current = screenStream;
      const screenTrack = screenStream.getVideoTracks()[0];

      // Replace video track in peer connection
      const sender = pcRef.current
        ?.getSenders()
        .find((s) => s.track?.kind === "video");
      if (sender) await sender.replaceTrack(screenTrack);

      // Update local preview to show screen
      if (localVideoRef.current && localStreamRef.current) {
        const mixed = new MediaStream([
          screenTrack,
          ...localStreamRef.current.getAudioTracks(),
        ]);
        localVideoRef.current.srcObject = mixed;
      }

      // Auto-revert when browser's "Stop sharing" bar is clicked
      screenTrack.onended = () => stopScreenShare();
      setIsSharingScreen(true);
    } catch (err) {
      if (err.name !== "NotAllowedError") {
        setError("Screen share failed: " + err.message);
      }
    }
  }, [isSharingScreen]); // eslint-disable-line

  // ── Stop screen share ─────────────────────────────────────────────────────
  const stopScreenShare = useCallback(async () => {
    if (!isSharingScreen) return;
    stopScreenStream();

    const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
    if (cameraTrack) {
      const sender = pcRef.current
        ?.getSenders()
        .find((s) => s.track?.kind === "video");
      if (sender) await sender.replaceTrack(cameraTrack);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    }
    setIsSharingScreen(false);
  }, [isSharingScreen, stopScreenStream]);

  // ─────────────────────────────────────────────────────────────────────────
  // SOCKET EVENT LISTENERS
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    // call-answered: callee accepted, we receive SDP answer
    const onCallAnswered = async ({ callId, answer }) => {
      activeCallIdRef.current = callId;
      try {
        await pcRef.current?.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        await drainPendingCandidates();
        setCallState(CALL_STATE.CONNECTING);
        startTimer();
      } catch (e) {
        console.error("[WebRTC] onCallAnswered:", e);
      }
    };

    // ice-candidate: relay candidate to peer connection
    const onIceCandidate = async ({ candidate }) => {
      const pc = pcRef.current;
      if (!pc) return;
      if (pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.warn("[WebRTC] addIceCandidate:", e);
        }
      } else {
        pendingCandidatesRef.current.push(candidate);
      }
    };

    // call-ended: remote side hung up or disconnected
    const onCallEnded = () => {
      setError(null);
      fullReset();
      onCallEnd?.();
    };

    // call-rejected: callee declined
    const onCallRejected = () => {
      setError("Call was declined.");
      fullReset(CALL_STATE.IDLE);
      onCallEnd?.();
    };

    // call-failed: callee is offline
    const onCallFailed = ({ reason }) => {
      setError(reason || "Call could not be connected.");
      fullReset(CALL_STATE.IDLE);
      onCallEnd?.();
    };

    socket.on("call-answered", onCallAnswered);
    socket.on("ice-candidate", onIceCandidate);
    socket.on("call-ended", onCallEnded);
    socket.on("call-rejected", onCallRejected);
    socket.on("call-failed", onCallFailed);

    return () => {
      socket.off("call-answered", onCallAnswered);
      socket.off("ice-candidate", onIceCandidate);
      socket.off("call-ended", onCallEnded);
      socket.off("call-rejected", onCallRejected);
      socket.off("call-failed", onCallFailed);
    };
  }, [socket, drainPendingCandidates, startTimer, fullReset, onCallEnd]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => () => fullReset(CALL_STATE.IDLE), []); // eslint-disable-line

  return {
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
  };
}
