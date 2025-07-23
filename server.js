io.on('connection', (socket) => {
  console.log('A user connected');

  let username = '';

  socket.on('join', (name) => {
    username = name;
    socket.broadcast.emit('chatMessage', {
      user: '🟢 System',
      text: `${username} joined the chat`,
      time: getTime(),
    });
  });

  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', { ...msg, time: getTime() });
  });

  socket.on('typing', (user) => {
    socket.broadcast.emit('typing', user);
  });

  socket.on('disconnect', () => {
    if (username) {
      io.emit('chatMessage', {
        user: '🔴 System',
        text: `${username} left the chat`,
        time: getTime(),
      });
    }
  });
});

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
