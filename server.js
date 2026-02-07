// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Ping route
app.get("/ping", (req, res) => {
  res.send("Server is alive ✅");
});

// Maps
const connectedUsers = new Map();
const rooms = new Map();
let roomCounter = 1;
// In-memory media store (NO DB)
const mediaStore = new Map();
/*
  mediaId => {
    buffer: Buffer,
    viewOnce: boolean,
    viewedBy: Set(socket.id)
  }
*/

// Room helpers
function createRoom() {
  const roomId = `room-${roomCounter++}`;
  rooms.set(roomId, new Set());
  return roomId;
}

function findAvailableRoom() {
  for (const [roomId, members] of rooms.entries()) {
    if (members.size < 2) return roomId;
  }
  return null;
}

function getUsernamesInRoom(roomId) {
  const members = rooms.get(roomId) || new Set();
  const names = [];
  for (const socketId of members) {
    const uname = connectedUsers.get(socketId);
    if (uname) names.push(uname);
  }
  return names;
}
function isAdmin(username) {
  return ["thejus", "Thejus", "THEJUS"].includes(username);
}

// Socket.io logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Assign room
  let roomId = findAvailableRoom() || createRoom();
  socket.join(roomId);
  rooms.get(roomId).add(socket.id);
  socket.data.roomId = roomId;

  socket.emit("room assigned", roomId);
  io.to(roomId).emit("update users", getUsernamesInRoom(roomId));

  // Username setup
  socket.on("new user", (username) => {
    if (!username) return;
    connectedUsers.set(socket.id, username);
    io.to(roomId).emit("update users", getUsernamesInRoom(roomId));
  });
  // ===== Admin wallpaper upload =====
socket.on("set wallpaper", (data) => {
  const username = connectedUsers.get(socket.id);
  if (!isAdmin(username)) return;

  if (!data?.buffer || !data?.mime) return;

  io.to(roomId).emit("wallpaper updated", {
    buffer: data.buffer,
    mime: data.mime
  });
});
socket.on("return bg", () => {
  const username = connectedUsers.get(socket.id);
  if (!isAdmin(username)) return;

  // 🔥 Broadcast reset to room (NO STORAGE)
  io.to(roomId).emit("reset wallpaper");
});
socket.on("clear chat", () => {
  const username = connectedUsers.get(socket.id);
  if (!isAdmin(username)) return;

  io.to(roomId).emit("clear chat");
});


  // Chat messages (NO DUPLICATE TO SENDER)
  socket.on("chat message", (msg) => {
    socket.broadcast.to(roomId).emit("chat message", msg);
  });

  // Voice messages (NO DUPLICATE TO SENDER)
  socket.on("voice message", (msg) => {
    socket.broadcast.to(roomId).emit("voice message", msg);
  });
  // Image message
socket.on("send image", (data) => {
  /*
    data = {
      buffer: ArrayBuffer,
      viewOnce: boolean
    }
  */
if (!data?.buffer) return;

if (data.buffer.byteLength > 5 * 1024 * 1024) {
  return; // reject images > 5MB
}

  const mediaId = `media-${Date.now()}-${Math.random()}`;

  mediaStore.set(mediaId, {
    buffer: Buffer.from(data.buffer),
    viewOnce: data.viewOnce,
    viewedBy: new Set()
  });

  // Notify receiver that an image exists
  socket.broadcast.to(roomId).emit("new image", {
    mediaId,
    viewOnce: data.viewOnce
  });
});
// View image
socket.on("view image", (mediaId) => {
  const media = mediaStore.get(mediaId);
  if (!media) return;

  if (media.viewOnce && media.viewedBy.has(socket.id)) return;

  media.viewedBy.add(socket.id);

  socket.emit("image data", {
    mediaId,
    buffer: media.buffer
  });

  if (media.viewOnce) {
    mediaStore.delete(mediaId);
    io.to(roomId).emit("image expired", mediaId);
  }
});

  // Typing indicators
  socket.on("typing", (user) => socket.to(roomId).emit("typing", user));
  socket.on("stop typing", (user) => socket.to(roomId).emit("stop typing", user));

  // Recording indicators
  socket.on("start recording", (user) => socket.to(roomId).emit("start recording", user));
  socket.on("stop recording", (user) => socket.to(roomId).emit("stop recording", user));

  // Delete message
  socket.on("delete message", (data) => {
    io.to(roomId).emit("delete message", data);
  });
 //Disconnect
socket.on("disconnect", () => {
  // Cleanup media viewed by disconnected user
  for (const [id, media] of mediaStore.entries()) {
    media.viewedBy.delete(socket.id);
  }

  rooms.get(roomId)?.delete(socket.id);
  connectedUsers.delete(socket.id);

  if (rooms.get(roomId)?.size === 0) {
    rooms.delete(roomId);
    console.log(`${roomId} deleted (empty)`);
  } else {
    io.to(roomId).emit("update users", getUsernamesInRoom(roomId));
  }

  console.log("User disconnected:", socket.id);
});
}); 

// Config route
app.get("/config", (req, res) => {
  res.json({
    musicEnabled: process.env.MUSIC_ENABLED === "true",
  });
});

// Render port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);