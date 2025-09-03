// Dashboard functionality
document.addEventListener("DOMContentLoaded", function () {
  if (!isAuthenticated()) {
    window.location.href = "index.html";
    return;
  }

  loadUserData();
  checkHealth();
});

async function loadUserData() {
  try {
    const response = await api.getProfile();

    if (response.success) {
      const user = response.data;
      document.getElementById("userEmail").textContent = user.email;
      document.getElementById("userRole").textContent = user.role;
    } else {
      console.error("Failed to load user data:", response.message);
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    if (error.message.includes("401")) {
      // Token expired or invalid
      logout();
    }
  }
}

async function checkHealth() {
  const statusElement = document.getElementById("apiStatus");

  try {
    statusElement.textContent = "Verificando...";
    statusElement.className = "status-indicator checking";

    const response = await api.health();

    if (response.success) {
      statusElement.textContent = "✅ API Online";
      statusElement.className = "status-indicator online";
    } else {
      statusElement.textContent = "❌ API Offline";
      statusElement.className = "status-indicator offline";
    }
  } catch (error) {
    console.error("Health check failed:", error);
    statusElement.textContent = "❌ Erro na verificação";
    statusElement.className = "status-indicator error";
  }
}
