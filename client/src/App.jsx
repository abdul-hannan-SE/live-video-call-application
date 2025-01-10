import { useRef } from "react";
import "./index.css";
import ChatApp from "./components/chat/ChatApp";
import AudioCall from "./components/chat/audio/AudioCall";
import VideoCall from "./components/chat/video/VidoeCall";
import io from "socket.io-client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromChildren,
} from "react-router-dom";
import { Provider } from "react-redux";
import { socketContext } from "./context/socket";
import store from "./store/store";
import Layout from "./Layout";
import { Login, Home, SignUp, NotFound } from "./components";
import { PeerContextProvider } from "./context/simplePeer";
import WebcamCapture from "./components/chat/video/ans";
const routes = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />}>
        <Route path="/" element={<ChatApp />} />
        <Route path="/audioCall" element={<AudioCall />} />
        <Route path="/videoCall" element={<VideoCall />} />
        <Route path="/ans" element={<WebcamCapture />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  const socketRef = useRef();
  socketRef.current = io("http://localhost:9000", {
    transports: ["websocket"],
  });

  return (
    <socketContext.Provider value={{ socketRef: socketRef.current }}>
      <Provider store={store}>
        <PeerContextProvider>
          <RouterProvider router={routes} />
        </PeerContextProvider>
      </Provider>
    </socketContext.Provider>
  );
}

export default App;
