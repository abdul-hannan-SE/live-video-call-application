import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { usePeer } from "../../../context/simplePeer";
import { clearAlert, showAlert } from "../../../features";

const AudioCall = () => {
  const currentUser = useSelector((state) => state.user.user);
  const location = useLocation();
  const navigateTo = useNavigate();
  const [stream, setStream] = useState(null);
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(
    location.state.selectedUser || null
  );

  const { userAudio, leaveCall } = usePeer(); // Updated context to include `connectToPeer`
  const alert = (msg, severity) => {
    dispatch(showAlert({ message: msg, severity: severity }));
    setTimeout(() => {
      dispatch(clearAlert());
    }, 2000);
  };
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((currentStream) => {
        setStream(currentStream);
      })
      .catch((error) => {
        alert("Please allow audio to start call");
        navigateTo(-1);
      });
  }, []);

  const handleEndCall = () => {
    leaveCall();
    navigateTo(-1);
  };

  const handleBack = () => {
    navigateTo(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      {/* Back Button at the top */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 text-white bg-gray-600 p-2 rounded-full hover:bg-gray-500"
      >
        &larr; {/* Left arrow icon */}
      </button>

      <h2 className="text-white text-2xl mb-4">Audio Call</h2>

      {/* Display User's Avatar */}
      <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mb-6">
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt="User Avatar"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-gray-300">No Avatar</span>
        )}
      </div>

      {/* Hidden Audio Element for Incoming Audio */}
      <audio
        ref={userAudio} // Ref to play the remote audio stream
        autoPlay
        className="hidden"
      ></audio>

      {/* Call Controls */}
      <div className="flex space-x-4">
        <button
          onClick={handleEndCall}
          className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
        >
          End Call
        </button>
        <button
          className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600"
          onClick={() => {
            if (userAudio.current) {
              userAudio.current.muted = !userAudio.current.muted;
            }
          }}
        >
          Mute
        </button>
      </div>
    </div>
  );
};

export default AudioCall;
