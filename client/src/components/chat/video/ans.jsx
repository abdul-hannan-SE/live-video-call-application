import React, { useEffect, useRef } from "react";
import { usePeer } from "../../../context/simplePeer";

const WebcamCapture = () => {
  const { remoteStream, answerCall, callAccepted } = usePeer();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const startWebcam = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideoInput = devices.some(
        (device) => device.kind === "videoinput"
      );
      const hasAudioInput = devices.some(
        (device) => device.kind === "audioinput"
      );

      if (!hasVideoInput && !hasAudioInput) {
        throw new Error("No video or audio devices available");
      }

      const constraints = {
        video: hasVideoInput,
        audio: hasAudioInput,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (error) {
      if (error.name === "NotFoundError") {
        console.error(
          "No camera or microphone found. Please connect a device."
        );
      } else if (error.name === "NotAllowedError") {
        console.error("Permission denied for accessing camera/microphone.");
      } else {
        console.error("Error accessing webcam:", error);
      }
    }
  };

  const ansCall = async () => {
    const stream = await startWebcam();
    answerCall({ stream, srcObject: stream });
  };

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div>
      {/* Local Video */}

      {/* Remote Video */}
      {callAccepted && (
        <video
          playsInline
          ref={remoteVideoRef}
          autoPlay
          style={{ width: "300px", height: "200px", background: "black" }}
        />
      )}

      <button onClick={ansCall}>
        {callAccepted ? "Call in Progress" : "Answer Call"}
      </button>
    </div>
  );
};

export default WebcamCapture;
