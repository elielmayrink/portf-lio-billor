// Authentication management
function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token;
}

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

function logout() {
  clearToken();
  window.location.href = "index.html";
}

// Check authentication on page load for protected pages
document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname.split("/").pop();

  // Pages that require authentication
  const protectedPages = [
    "dashboard.html",
    "users.html",
    "trucks.html",
    "drivers.html",
  ];

  if (protectedPages.includes(currentPage) && !isAuthenticated()) {
    window.location.href = "index.html";
  }

  // If on login page and already authenticated, redirect to dashboard
  if (currentPage === "index.html" && isAuthenticated()) {
    window.location.href = "dashboard.html";
  }
});
