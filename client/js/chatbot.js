async function sendChatMessage(text) {
  const res = await apiRequest('/llm/chat', 'POST', { message: text });
  return res.reply || 'No reply';
}

(function initChatbot(){
  const input = document.getElementById('chatInput');
  const btn = document.getElementById('sendBtn');
  const box = document.getElementById('chatbox');
  if (!input || !btn || !box) return;

  function append(role, text) {
    const p = document.createElement('p');
    p.textContent = `${role}: ${text}`;
    box.appendChild(p);
    box.scrollTop = box.scrollHeight;
  }

  async function handleSend(){
    const msg = input.value.trim();
    if (!msg) return;
    append('You', msg);
    input.value = '';
    try {
      const reply = await sendChatMessage(msg);
      append('AI', reply);
    } catch (e) {
      append('AI', 'Sorry, something went wrong.');
    }
  }

  btn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
})();
