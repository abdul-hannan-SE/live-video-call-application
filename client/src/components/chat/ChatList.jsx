import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { socketContext } from "../../context/socket";

const ChatList = ({ onSelectUser }) => {
  const users = useSelector((state) => state.user.userList);
  const currentUser = useSelector((state) => state.user.user);
  const activeUsers = useSelector((state) => state.user.activeUserList);

  return (
    <div className="w-1/4 bg-gray-100 h-full p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      {users.map((user) => (
        <button
          key={user._id}
          onClick={() => onSelectUser(user)}
          className="flex items-center p-2 mb-2 bg-white rounded-lg shadow-md hover:bg-gray-200 w-full relative"
        >
          <div className="relative">
            <img
              src={user.avatar}
              alt={`${user.username}'s avatar`}
              className="w-10 h-10 rounded-full mr-3"
            />
            {activeUsers?.find(
              (person) => person.userId == user._id.toString()
            ) ? (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            ) : (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white rounded-full" />
            )}
          </div>
          <span className="text-lg font-medium">
            {currentUser?.user?.username == user.username ||
            currentUser?._id === user._id
              ? "My"
              : user.username}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ChatList;
