document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await apiRequest("/auth/login", "POST", { email, password });
  if (res.token) {
    localStorage.setItem("token", res.token);
    window.location.href = "index.html";
  } else {
    alert(res.message || "Login failed");
  }
});
