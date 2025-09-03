// Login form handling
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});

async function handleLogin(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const credentials = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  let originalText = "";
  const submitBtn = event.target.querySelector('button[type="submit"]');

  try {
    // Show loading state
    if (submitBtn) {
      originalText = submitBtn.textContent;
      submitBtn.textContent = "Entrando...";
      submitBtn.disabled = true;
    }

    const response = await api.login(credentials);

    if (response.success) {
      // Store token
      setToken(response.data.accessToken);

      // Redirect to dashboard
      window.location.href = "dashboard.html";
    } else {
      showError("Erro no login: " + response.message);
    }
  } catch (error) {
    console.error("Login error:", error);
    showError("Erro no login: " + error.message);
  } finally {
    // Reset button state
    if (submitBtn && originalText) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
}

function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";

    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorDiv.style.display = "none";
    }, 5000);
  }
}
