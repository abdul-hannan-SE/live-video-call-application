import React, { useEffect, useState, useContext, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearAlert, showBackdrop, clearBackdrop } from "../../features/";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useNavigate } from "react-router-dom";
import { usePeer } from "../../context/simplePeer";

const AlertMessage = () => {
  const navigateTo = useNavigate();
  const { call } = usePeer();
  const { message, severity, type } = useSelector((state) => state.alert);
  const dispatch = useDispatch();
  // State to control the Dialog visibility
  const [openDialog, setOpenDialog] = useState(false);

  // Open dialog only if the alert type is "call"
  useEffect(() => {
    setOpenDialog(true);
  }, [type]);

  // Action when user accepts the call
  const handleAccept = async (callType) => {
    setOpenDialog(false);
    dispatch(clearAlert());
    if (callType === "audioCall") {
      call.isReceivedCall = true;
      navigateTo("/audioCall");
    } else if (
      (callType === "videoCall",
      {
        state: {
          callAccepted: true,
          caller: call.caller,
          receiverSide: true,
          callerName: call.callerName,
        },
      })
    ) {
      call.isReceivedCall = true;
      navigateTo("/videoCall", {
        state: {
          callAccepted: true,
          caller: call.caller,
          receiverSide: true,
          callerName: call.callerName,
        },
      });
    }

    // Navigate based on call type
  };

  // Action when user declines the call
  const handleDecline = () => {
    setOpenDialog(false);
    dispatch(clearAlert());
  };

  // Only show the alert if there is a message
  if (!message) return null;

  return (
    <>
      {/* Default Alert Message for non-call types */}
      {!type && (
        <div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50"
          style={{ zIndex: 1000 }}
        >
          <Alert
            severity={severity || "info"}
            onClose={() => dispatch(clearAlert())}
            className="shadow-lg"
          >
            <AlertTitle>{severity}</AlertTitle>
            {message}
          </Alert>
        </div>
      )}

      {/* Call Dialog that shows when type is 'call' */}
      {type && (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Incoming Call</DialogTitle>
          <DialogContent>
            <div>
              <p>{message}</p>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDecline} color="secondary">
              Decline
            </Button>
            {type === "audio" ? (
              <Button onClick={() => handleAccept("audio")} color="primary">
                Accept
              </Button>
            ) : (
              <Button onClick={() => handleAccept("video")} color="primary">
                Accept
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default AlertMessage;
