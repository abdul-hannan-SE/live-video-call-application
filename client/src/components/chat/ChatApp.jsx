// ChatApp.jsx
import React, { useEffect, useState, useContext } from "react";
import { socketContext } from "../../context/socket";
import ChatList from "./ChatList";
import SelectedUser from "./SelectedUser";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "../../api";
import { addUserList, addActiveUsers } from "../../features/userSlice";
import { clearAlert, showAlert } from "../../features";

const ChatApp = () => {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [users] = useSelector((state) => state.user.userList);
  const activeUsers = useSelector((state) => state.user.activeUserList);
  const user = useSelector((state) => state.user.user);

  const [selectedUser, setSelectedUser] = useState();
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };
  const ctx = useContext(socketContext);
  const handleMessage = () => alert(`Message ${selectedUser.username}`);

  const alert = (msg, severity) => {
    dispatch(showAlert({ message: msg, severity: severity }));
    setTimeout(() => {
      dispatch(clearAlert());
    }, 2000);
  };
  const isOnline = () => {
    return activeUsers.some(
      (activeUser) => activeUser.userId === selectedUser._id
    );
  };
  const isSelf = () => {
    return user._id === selectedUser._id;
  };

  const handleCall = (type) => {
    if (!isOnline()) {
      alert(`${selectedUser.username} is Offline`);
      return;
    } else if (isSelf()) {
      alert("Cannot place self call", "error");
      return;
    } else if (!user) {
      alert("Please login to have fun chat", "info");
      navigateTo("/login");
    } else
      navigateTo(`/${type}`, {
        state: { selectedUser: selectedUser, callType: type },
      });
  };

  useEffect(() => {
    const fetchUserList = async () => {
      const res = await getAllUsers();
      if (res.success) {
        dispatch(addUserList(res.data));
      }
    };
    fetchUserList();
  }, []);

  useEffect(() => {
    ctx?.socketRef?.on("getUsers", (activeUsers) => {
      handleGetActiveUsers(activeUsers);
    });
    // return () => ctx.socketRef.off("getUsers");
  }, [ctx?.socketRef]);

  const handleGetActiveUsers = (activeUsers) => {
    dispatch(addActiveUsers(activeUsers));
  };
  return (
    <div className="flex w-full h-screen bg-gray-100">
      <ChatList users={users} onSelectUser={handleSelectUser} />
      {/* <Outlet/> */}
      <SelectedUser
        user={selectedUser}
        onMessage={handleMessage}
        onAudioCall={() => {
          handleCall("audioCall");
        }}
        onVideoCall={() => {
          handleCall("videoCall");
        }}
      />
    </div>
  );
};

export default ChatApp;
