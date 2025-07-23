const socket = io();
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const typingBox = document.createElement('div');
typingBox.id = "typing";
messages.appendChild(typingBox);

let username = '';

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') sendMessage();
  socket.emit('typing', username);
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (!username) {
    username = usernameInput.value.trim();
    if (!username) return;
    socket.emit('join', username);
  }
  if (!message) return;

  socket.emit('chatMessage', { user: username, text: message });
  messageInput.value = '';
}

socket.on('chatMessage', (data) => {
  const msg = document.createElement('div');
  msg.innerHTML = `<strong>${data.user}</strong> <small style="color:gray">[${data.time}]</small>: ${data.text}`;
  typingBox.innerText = '';
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
});

socket.on('typing', (user) => {
  if (user !== username) {
    typingBox.innerText = `${user} is typing...`;
    clearTimeout(typingBox.timer);
    typingBox.timer = setTimeout(() => {
      typingBox.innerText = '';
    }, 1000);
  }
});

const emojiBtn = document.getElementById('emojiBtn');
const picker = new EmojiButton();

emojiBtn.addEventListener('click', () => {
  picker.togglePicker(emojiBtn);
});

picker.on('emoji', emoji => {
  messageInput.value += emoji;
  messageInput.focus();
});
