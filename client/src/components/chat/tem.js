import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import { usePeer } from "../../../context/simplePeer";
import { useDispatch, useSelector } from "react-redux";
import { showAlert, clearAlert } from "../../../features";
import { useLocation } from "react-router-dom";
import Webcam from "react-webcam";
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};
const VideoCall = () => {
  const { userVideo, leaveCall, callAccepted, callUser, answerCall, call } =
    usePeer();
  const myVideo = useRef(null);
  const location = useLocation();
  const navigateTo = useNavigate();
  const user = useSelector((state) => state.user.user);
  const users = useSelector((state) => state.user.userList);
  const [stream, setStream] = useState(null);
  const [videoswitch, setvideo] = useState(true);
  const [audioswitch, setaudio] = useState(true);
  const [isCallPlaced, setCallPlaced] = useState(false);
  const [selectedUser, setSelectedUser] = useState(
    location.state.selectedUser ||
      users?.find((user) => user?._id === call?.caller) ||
      null
  );
  const dispatch = useDispatch();

  const handleEndCall = () => {
    setCallPlaced(false);
    leaveCall();
    navigateTo(-1); // Navigate to the previous route (i.e., back to the previous page)
  };

  const handleVideo = () => {
    if (videoswitch) {
      setvideo(false);
      myVideo.current.srcObject.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "video") {
          track.enabled = false;
        }
      });
    } else {
      setvideo(true);
      myVideo.current.srcObject.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "video") {
          track.enabled = true;
        }
      });
    }
  };

  const handleAudio = () => {
    if (audioswitch) {
      setaudio(false);
      myVideo.current.srcObject.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "audio") {
          track.enabled = false;
        }
      });
    } else {
      setaudio(true);
      myVideo.current.srcObject.getTracks().forEach(function (track) {
        if (track.readyState === "live" && track.kind === "audio") {
          track.enabled = true;
        }
      });
    }
  };

  // Function to handle the back button action
  const handleBack = () => {
    setCallPlaced(false);
    navigateTo(-1); // Navigate to the previous route
  };

  const alert = (msg, severity) => {
    dispatch(showAlert({ message: msg, severity: severity }));
    setTimeout(() => {
      dispatch(clearAlert());
    }, 2000);
  };

  const placeCall = () => {
    setCallPlaced(true);
    callUser({
      caller: user._id,
      callerName: user.username,
      receiver: selectedUser._id,
      callType: location.state.callType,
    });
  };

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (myVideo.current) {
          myVideo.current.srcObject = stream;
          console.log("myVideo  : ", myVideo.current.srcObject);
        }
        setStream(stream);
      } catch (error) {
        console.error("Error accessing webcam", error);
      }
    };
    startWebcam();
    if (location.state.callAccepted) {
      users.find((user) => user._id === call.caller);
      setTimeout(() => {}, 3000);
      answerCall();
    }

    return () => {
      myVideo?.current?.srcObject.getTracks().forEach((track) => track.stop());
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      {/* Back Button at the top */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 text-white bg-gray-600 p-2 rounded-full hover:bg-gray-500"
      >
        &larr; {/* Left arrow icon */}
      </button>

      <h2 className="text-white text-2xl mb-4">Video Call</h2>

      {/* Video Containers */}
      <div className="flex flex-col items-center space-y-6">
        {/* User's Video */}
        {!isCallPlaced ? (
          <button
            onClick={placeCall}
            className="bg-green-500 text-white py-3 px-8 rounded-lg hover:bg-green-600 focus:outline-none"
          >
            Make Call
          </button>
        ) : (
          isCallPlaced &&
          !callAccepted && (
            <div className="w-full max-w-4xl bg-gray-600 rounded-lg overflow-hidden">
              <div className="text-2xl text-white text-center py-4">
                {selectedUser?.username + "'s Video"}
              </div>

              <Webcam
                audio={true}
                height={720}
                ref={userVideo}
                screenshotFormat="image/jpeg"
                width={1280}
                videoConstraints={videoConstraints}
              />
            </div>
          ) && (
            <div className="flex items-center justify-center space-x-4">
              <div className="text-lg text-white">{`Calling ${selectedUser.username}...`}</div>
              {/* Spinner Animation */}
              <div className="border-4 border-t-4 border-b-red-500 border-solid rounded-full w-8 h-8 animate-spin"></div>
            </div>
          )
        )}

        {/* My Video */}
        <div className="text-2xl text-white">My Video</div>
        <div className="w-full max-w-3xl bg-gray-500 rounded-lg overflow-hidden">
          <Webcam
            audio={true}
            height={720}
            ref={myVideo}
            screenshotFormat="image/jpeg"
            width={1280}
            videoConstraints={videoConstraints}
          />
        </div>
      </div>

      {/* Call controls */}
      <div className="flex space-x-4 mt-6">
        {/* End Call Button */}
        <button
          onClick={handleEndCall} // Call handleEndCall when clicked
          className="bg-red-500 text-white py-3 px-8 rounded-lg hover:bg-red-600 focus:outline-none"
        >
          End Call
        </button>

        {/* Mute Button */}
        <button
          className="bg-gray-500 text-white py-3 px-8 rounded-lg hover:bg-gray-600 focus:outline-none"
          onClick={handleAudio}
        >
          {audioswitch ? "Turn off audio" : "Turn on audio"}
        </button>

        {/* Stop Video Button */}
        <button
          className="bg-gray-500 text-white py-3 px-8 rounded-lg hover:bg-gray-600 focus:outline-none"
          onClick={handleVideo}
        >
          {videoswitch ? "Turn off video" : "Turn on video"}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
