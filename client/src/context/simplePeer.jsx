import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import Peer from "simple-peer";
import { socketContext } from "./socket";
const PeerContext = createContext();

const PeerContextProvider = ({ children }) => {
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);

  const [callEnded, setCallEnded] = useState(false);
  const connectionRef = useRef();
  const ctx = useContext(socketContext);

  useEffect(() => {
    ctx.socketRef.on("calluser", (callData) => {
      setCall({
        isReceivedCall: true,
        caller: callData.caller,
        callerName: callData.callerName,
        signal: callData.signal,
        callType: callData.type,
      });
    });
  }, []);

  const callUser = ({ srcObject, caller, callerName, receiver, type }) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: srcObject,
    });

    peer.on("signal", (data) => {
      ctx.socketRef.emit("calluser", {
        callData: {
          caller: caller,
          receiver: receiver,
          callerName: callerName,
          callType: type,
          signal: data,
        },
      });
    });

    peer.on("stream", (remoteStream) => {
      console.log("Stream received at calluser call");
      setRemoteStream(remoteStream);
    });

    ctx.socketRef.on("callaccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = ({ stream, srcObject }) => {
    console.log("Answering call");
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: srcObject,
    });
    peer.on("signal", (data) => {
      console.log("answering call");
      ctx.socketRef.emit("callaccepted", { signal: data, caller: call.caller });
    });

    peer.on("stream", (remoteStream) => {
      console.log("Srream received at answer call");
      setCallAccepted(true);
      setRemoteStream(remoteStream);
      // userAudio = remoteStream;
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    console.log("Leaving call");
    setCallEnded(true);
    setCallAccepted(false);
    if (connectionRef.current) {
      console.log("destroying peer conn");
      connectionRef.current.destroy();
    }
  };

  return (
    <PeerContext.Provider
      value={{
        call,
        callAccepted,
        callEnded,
        callUser,
        leaveCall,
        answerCall,
        remoteStream,
        setCall,
        setCallAccepted,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};

export { PeerContextProvider };
export const usePeer = () => useContext(PeerContext);
