// src/components/chat/UserProfile.js
import React from "react";

const SelectedUser = ({ user, onMessage, onAudioCall, onVideoCall }) => {
  if (!user) {
    return (
      <div className="w-3/4 flex items-center justify-center text-gray-500">
        Select a user to view their profile
      </div>
    );
  }
  return (
    <div className="w-3/4 p-6 bg-white h-full">
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={user.avatar}
          alt={`${user.username}'s profile picture`}
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={onMessage}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Message
        </button>
        <button
          onClick={onAudioCall}
          className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Audio Call
        </button>
        <button
          onClick={onVideoCall}
          className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Video Call
        </button>
      </div>
    </div>
  );
};

export default SelectedUser;
