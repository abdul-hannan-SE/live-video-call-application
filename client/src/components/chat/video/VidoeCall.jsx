import React, { useState, useRef, useEffect } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaPhone,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import "tailwindcss/tailwind.css";
import { usePeer } from "../../../context/simplePeer";
import { showBackdrop, clearBackdrop } from "../../../features/bacdropSlice";
import { showAlert, clearAlert } from "../../../features/alertSlice";
import { useLocation, useNavigate } from "react-router-dom";
const VideoCallScreen = () => {
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const navigateTo = useNavigate();
  const {
    remoteStream,
    callUser,
    callAccepted,
    leaveCall,
    callEndded,
    answerCall,
    setCall,
    setCallAccepted,
  } = usePeer();

  const [callPlaced, setCallPlaced] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [callAnswered, setCallAnswered] = useState(false);
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const [selectedUser, setSelectedUser] = useState(
    location.state?.selectedUser || null
  );
  const dispatch = useDispatch();

  const alert = (msg, severity) => {
    dispatch(showAlert({ message: msg, severity: severity }));
    setTimeout(() => {
      dispatch(clearAlert());
    }, 2000);
  };
  const backdrop = () => {
    dispatch(showBackdrop());

    setTimeout(() => {
      dispatch(clearBackdrop());
    }, 3000);
  };

  useEffect(() => {
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

        const mediaStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );
        localStreamRef.current = mediaStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        const errorMessage =
          error.name === "NotFoundError"
            ? "No video or audio devices found. Please connect them."
            : error.name === "NotAllowedError"
            ? "Camera and microphone permissions denied."
            : "Error accessing media devices.";
        console.error(errorMessage, error);
        alert(errorMessage, "error");
      }
    };

    startWebcam();
    return () => {
      setCallAccepted(false);
      setCallAnswered(false);
      setCallPlaced(false);
      setCall({});
      location.state = null;

      console.log("Cleaning up...");
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log("Remote stream is : ", remoteStream);
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const placeCall = () => {
    setCallPlaced(true);
    backdrop();
    callUser({
      srcObject: localStreamRef.current,
      caller: user._id,
      callerName: user.username,
      receiver: selectedUser._id,
      type: location.state.callType,
    });
  };
  const acceptCall = () => {
    backdrop();
    answerCall({
      stream: localStreamRef.current,
      srcObject: localStreamRef.current,
    });
    setCallAnswered(true);
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        if (track.kind === "audio") track.enabled = !audioEnabled;
      });
    }
    setAudioEnabled((prev) => !prev);
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        if (track.kind === "video") track.enabled = !videoEnabled;
      });
    }
    setVideoEnabled((prev) => !prev);
  };

  const declineCall = () => {
    if (localStreamRef.current) {
      // Stop all tracks to release the camera and microphone
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
    if (location.state?.receiverSide) {
      setCall({});
      setCallAnswered(false);
      location.state = null;
    }
    setCallPlaced(false);
    leaveCall();
    navigateTo(-1, { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8">Video Call</h1>

      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Local Video */}
        <div className="relative w-full h-72 sm:h-96 bg-black rounded-lg overflow-hidden shadow-xl">
          <div className="w-full h-full object-cover">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            {/* <Webcam
              audio={false}
              height={720}
              ref={localStream}
              screenshotFormat="image/jpeg"
              width={1280}
            /> */}
          </div>
          <span className="absolute bottom-2 left-2 text-xs bg-black bg-opacity-70 px-2 py-1 rounded text-white">
            You
          </span>
        </div>

        {/* Remote Video */}
        <div className="relative w-full h-72 sm:h-96 bg-black rounded-lg overflow-hidden shadow-xl">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-2 left-2 text-xs bg-black bg-opacity-70 px-2 py-1 rounded text-white">
            {location.state?.receiverSide
              ? location.state.callerName
              : location.state.selectedUser.username}
          </span>
        </div>
      </div>
      <div className={location.state?.receiverSide ? "hidden" : ""}>
        {!callAccepted && callPlaced && (
          <div className="mt-8 flex items-center justify-center space-x-6">
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110">
              <FaPhoneSlash size={24} onClick={declineCall} />
            </button>
          </div>
        )}

        {!callAccepted && !callPlaced && (
          <div className="mt-8 flex items-center justify-center space-x-6">
            <button
              onClick={placeCall}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110"
            >
              <FaPhone size={24} />
            </button>
          </div>
        )}
        {callAccepted && callPlaced && (
          <div className="mt-8 flex items-center justify-center space-x-6">
            {/* End Call */}
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110">
              <FaPhoneSlash size={24} onClick={declineCall} />
            </button>

            {/* Toggle Audio */}
            <button
              onClick={toggleAudio}
              className={`py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 ${
                !audioEnabled
                  ? "bg-red-600 line-through"
                  : "bg-gray-500 hover:bg-gray-600"
              } text-white`}
            >
              {!audioEnabled ? (
                <FaMicrophoneSlash size={24} />
              ) : (
                <FaMicrophone size={24} />
              )}
            </button>

            {/* Toggle Video */}
            <button
              onClick={toggleVideo}
              className={`py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 ${
                !videoEnabled
                  ? "bg-red-600 line-through"
                  : "bg-gray-500 hover:bg-gray-600"
              } text-white`}
            >
              {videoEnabled ? (
                <FaVideo size={24} />
              ) : (
                <FaVideoSlash size={24} />
              )}
            </button>
          </div>
        )}
      </div>
      {/* {
         state: { callAccepted: true, caller: caller, receiverSide: true } 
      
      } */}
      {location.state?.receiverSide ? (
        (callAnswered && (
          <div className="mt-8 flex items-center justify-center space-x-6">
            {/* End Call */}
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110">
              <FaPhoneSlash size={24} onClick={declineCall} />
            </button>

            {/* Toggle Audio */}
            <button
              onClick={toggleAudio}
              className={`py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 ${
                !audioEnabled
                  ? "bg-red-600 line-through"
                  : "bg-gray-500 hover:bg-gray-600"
              } text-white`}
            >
              {!audioEnabled ? (
                <FaMicrophoneSlash size={24} />
              ) : (
                <FaMicrophone size={24} />
              )}
            </button>

            {/* Toggle Video */}
            <button
              onClick={toggleVideo}
              className={`py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 ${
                !videoEnabled
                  ? "bg-red-600 line-through"
                  : "bg-gray-500 hover:bg-gray-600"
              } text-white`}
            >
              {videoEnabled ? (
                <FaVideo size={24} />
              ) : (
                <FaVideoSlash size={24} />
              )}
            </button>
          </div>
        )) ||
        (!callAnswered && (
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110">
            <FaPhone size={24} onClick={acceptCall} />
            <span>Answer Call</span>
          </button>
        ))
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default VideoCallScreen;
