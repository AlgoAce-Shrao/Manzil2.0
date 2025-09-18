async function sendChatMessage(text) {
  const res = await apiRequest('/llm/chat', 'POST', { message: text });
  return res.reply || 'No reply';
}

(function initChatbot(){
  const input = document.getElementById('chatInput');
  const btn = document.getElementById('sendBtn');
  const box = document.getElementById('chatbox');
  const chatWindow = document.getElementById('chatWindow');
  const chatToggle = document.getElementById('chatToggle');
  const closeChat = document.getElementById('closeChat');
  
  if (!input || !btn || !box || !chatWindow || !chatToggle) return;

  function append(role, text) {
    const messageDiv = document.createElement('div');
    messageDiv.style.marginBottom = '10px';
    messageDiv.style.padding = '8px 12px';
    messageDiv.style.borderRadius = '8px';
    
    if (role === 'You') {
      messageDiv.style.background = 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))';
      messageDiv.style.color = 'white';
      messageDiv.style.marginLeft = '20px';
    } else {
      messageDiv.style.background = 'var(--bg-dark)';
      messageDiv.style.color = 'var(--text-light)';
      messageDiv.style.marginRight = '20px';
    }
    
    messageDiv.innerHTML = `<strong>${role}:</strong> ${text}`;
    box.appendChild(messageDiv);
    box.scrollTop = box.scrollHeight;
  }

  async function handleSend(){
    const msg = input.value.trim();
    if (!msg) return;
    append('You', msg);
    input.value = '';
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.style.marginBottom = '10px';
    typingDiv.style.padding = '8px 12px';
    typingDiv.style.background = 'var(--bg-dark)';
    typingDiv.style.color = 'var(--text-light)';
    typingDiv.style.marginRight = '20px';
    typingDiv.innerHTML = '<strong>AI:</strong> <em>Typing...</em>';
    box.appendChild(typingDiv);
    box.scrollTop = box.scrollHeight;
    
    try {
      const reply = await sendChatMessage(msg);
      box.removeChild(typingDiv); // Remove typing indicator
      append('AI', reply);
    } catch (e) {
      box.removeChild(typingDiv); // Remove typing indicator
      append('AI', 'Sorry, something went wrong.');
    }
  }

  // Toggle chat window
  chatToggle.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
  });

  // Close chat window
  closeChat.addEventListener('click', () => {
    chatWindow.style.display = 'none';
  });

  // Send message
  btn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Add welcome message
  append('AI', 'Hello! I\'m your AI career assistant. How can I help you today?');
})();
