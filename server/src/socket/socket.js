const EventEmitter = require("events");
const socketio = require("socket.io");

class SocketManager extends EventEmitter {
  static io = null;
  static users = [];

  constructor() {
    super();
  }

  // Initialize socket.io with an HTTP server and setup event listeners
  static init(httpServer) {
    console.log("Initializing socket connection...");

    SocketManager.io = socketio(httpServer, {
      cors: { origin: true },
    });

    SocketManager.io.on("connection", (socket) => {
      console.log("Client connected with socket id:", socket.id);
      SocketManager.#setupSocketListeners(socket);
    });

    return SocketManager.io;
  }

  // Setup individual socket event listeners
  static #setupSocketListeners(socket) {
    socket.on("addUser", (userId) =>
      SocketManager.#handleAddUser(socket, userId)
    );
    socket.on("removeUser", (userId) => SocketManager.handleRemoveUser(userId));

    socket.on("calluser", (callData) => {
      SocketManager.handleCall(callData, socket);
    });

    socket.on("callaccepted", ({ signal, caller }) =>
      SocketManager.handleCallAccepted({ signal, caller })
    );
    socket.on("disconnect", () => SocketManager.handleDisconnect(socket));
  }

  // Handle user addition
  static #handleAddUser(socket, userId) {
    SocketManager.addUser(userId, socket.id);
    SocketManager.io.emit("getUsers", SocketManager.users);
    socket.emit("success", userId);
  }

  // Handle user removal
  static handleRemoveUser(userId) {
    SocketManager.removeUser(userId);

    SocketManager.io.emit("getUsers", SocketManager.users);
  }

  // Handle audio call event
  static handleCall(callData, socket) {
    console.log("call received");

    console.log(
      callData.callData.receiver,
      callData.callData.caller,
      callData.callData.callerName
    );

    const receiverSocketId = SocketManager.getUserSocket(
      callData.callData.receiver
    );
    console.log(receiverSocketId);
    if (receiverSocketId) {
      SocketManager.io.to(receiverSocketId).emit("calluser", callData.callData);
    } else {
      // If the receiver is not connected (socketId not found), notify the caller
      socket.emit("error", {
        message: `User with ID ${callData.receiver} is not online.`,
      });
      console.log(
        `Receiver with ID ${callData.receiver} not connected, call could not be initiated.`
      );
    }
  }
  static handleCallAccepted({ signal, caller }) {
    const receiverSocketId = SocketManager.getUserSocket(caller);
    console.log("call accepted : ", caller, receiverSocketId);

    SocketManager.io.to(receiverSocketId).emit("callaccepted", signal);
  }
  // Handle user disconnection
  static handleDisconnect(socket) {
    SocketManager.removeUserBySocketId(socket.id);
    SocketManager.io.emit("getUsers", SocketManager.users);
  }

  // Add a user to the users list if not already present
  static addUser(userId, socketId) {
    if (!SocketManager.users.some((user) => user.userId === userId)) {
      SocketManager.users.push({ userId, socketId });
    }
  }

  // Remove a user by their userId
  static removeUser(userId) {
    SocketManager.users = SocketManager.users.filter(
      (user) => user.userId !== userId
    );
  }

  // Remove a user by their socketId (on disconnect)
  static removeUserBySocketId(socketId) {
    SocketManager.users = SocketManager.users.filter(
      (user) => user.socketId !== socketId
    );
  }

  // Get user socketId by userId
  static getUserSocket(userId) {
    const user = SocketManager.users.find((user) => user.userId === userId);
    console.log(user);

    return user ? user.socketId : null;
  }

  // Get the io instance
  static getIO() {
    if (!SocketManager.io) {
      throw new Error("Socket.io not initialized!");
    }
    return SocketManager.io;
  }
}

module.exports = SocketManager;
