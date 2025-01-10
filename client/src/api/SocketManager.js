// src/socketManager.js
import io from "socket.io-client";

class SocketManager {
  constructor() {
    this.socket = null;
  }

  connect(url, options) {
    if (!this.socket) {
      this.socket = io(url, options);
    }
    return this.socket;
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Method to listen to any event
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Method to emit an event
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

const socketManager = new SocketManager();
export default socketManager;
