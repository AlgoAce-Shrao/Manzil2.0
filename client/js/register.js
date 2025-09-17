document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await apiRequest("/auth/register", "POST", { name, email, password });
  if (res.token) {
    localStorage.setItem("token", res.token);
    window.location.href = "quiz.html";
  } else {
    alert(res.message || "Registration failed");
  }
});
