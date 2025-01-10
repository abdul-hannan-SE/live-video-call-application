import React, { useCallback, useContext, useEffect, useId } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header, Footer, AlertMessage } from "./components";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./api";
import { showAlert, clearAlert, addUser, addActiveUsers } from "./features";
import { socketContext } from "./context/socket";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@mui/styles";
import { showBackdrop, clearBackdrop } from "./features"; // Import the actions
import { useSelector } from "react-redux";
import { usePeer } from "./context/simplePeer";
// Styles for the backdrop
const useStyles = makeStyles((theme) => ({
  backdrop: {
    color: "#8B0000",
  },
}));

function Layout() {
  const ctx = useContext(socketContext);
  const { call } = usePeer();
  const location = useLocation();
  const dispatch = useDispatch();
  const classes = useStyles(); // Custom styles for Backdrop
  const { open } = useSelector((state) => state.backdrop); // Redux state for backdrop visibility

  // Flag to conditionally render header, footer, and alerts
  const isCallRoute =
    location.pathname === "/audioCall" || location.pathname === "/videoCall";
  // Handle success event for socket
  const handleSuccess = (userId) => {
    dispatch(showAlert({ message: "You're online", severity: "info" }));
    // Hide backdrop after success
    setTimeout(() => {
      dispatch(clearAlert()); // Clear alert after 3 seconds
    }, 4000);
  };

  // Handle incoming call event for socket
  const handleIncommingCall = (callData) => {
    ctx.peerRef.connect(callData.callerPeerId);
    callData.receiverPeerId = ctx.peerRef.id;
    ctx.socketRef.emit("receiverPeerId", callData);
    dispatch(
      showAlert({
        message: `Incoming call from ${callData.name}`,
        type: `${callData.type}`,
      })
    );
  };

  // Socket event listeners
  useEffect(() => {
    if (ctx?.socketRef) {
      ctx.socketRef.on("success", (userId) => handleSuccess(userId));
    }
  }, [ctx.socketRef]); // Dependencies for effect

  // Fetch current user and handle alerts and backdrop
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Show backdrop before fetching user
        const res = await getCurrentUser();
        if (res.success) {
          dispatch(addUser(res.data));
          dispatch(showAlert({ message: `Welcome Back ${res.data.username}` }));
          ctx.socketRef.emit("addUser", res.data._id);

          // Clear alert and backdrop after 2 seconds
          setTimeout(() => {
            dispatch(clearAlert()); // Hide backdrop after user data is fetched
          }, 2000);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        dispatch(clearBackdrop()); // Hide backdrop on error
      }
    };

    fetchUser(); // Call fetchUser function on mount
  }, [dispatch, ctx.socketRef]);
  useEffect(() => {
    if (call.isReceivedCall) {
      dispatch(
        showAlert({
          message: "Call recieved from" + call.callerName,
          severity: "success",
          type: "videoCall",
        })
      );
    }
  }, [call.isReceivedCall]);

  return (
    <>
      <AlertMessage /> {/* Display alert messages */}
      {!isCallRoute && <Header />} {/* Conditionally render header */}
      {/* Backdrop component */}
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" /> {/* Show loading spinner */}
      </Backdrop>
      <Outlet /> {/* Render nested routes */}
      {!isCallRoute && <Footer />} {/* Conditionally render footer */}
    </>
  );
}

export default Layout;
