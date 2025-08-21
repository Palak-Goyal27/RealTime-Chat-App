// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static frontend files (index.html, style.css, client.js, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected");

  let username = "";

  socket.on("join", (name) => {
    username = name;
    socket.broadcast.emit("chatMessage", {
      user: "🟢 System",
      text: `${username} joined the chat`,
      time: getTime(),
    });
  });

  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", { ...msg, time: getTime() });
  });

  socket.on("typing", (user) => {
    socket.broadcast.emit("typing", user);
  });

  socket.on("disconnect", () => {
    if (username) {
      io.emit("chatMessage", {
        user: "🔴 System",
        text: `${username} left the chat`,
        time: getTime(),
      });
    }
  });
});

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
