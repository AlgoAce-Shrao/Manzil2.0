document.getElementById("sendBtn").addEventListener("click", async () => {
  const input = document.getElementById("chatInput").value;
  const chatbox = document.getElementById("chatbox");

  chatbox.innerHTML += `<p><b>You:</b> ${input}</p>`;
  const res = await apiRequest("/career/chat", "POST", { message: input });
  chatbox.innerHTML += `<p><b>AI:</b> ${res.reply}</p>`;
});
