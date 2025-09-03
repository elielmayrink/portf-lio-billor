// Users management functionality
let users = [];

// Check authentication on page load
document.addEventListener("DOMContentLoaded", function () {
  if (!isAuthenticated()) {
    window.location.href = "index.html";
    return;
  }

  loadUsers();
  setupEventListeners();
});

function setupEventListeners() {
  const userForm = document.getElementById("userForm");
  if (userForm) {
    userForm.addEventListener("submit", handleCreateUser);
  }
}

async function loadUsers() {
  try {
    showMessage("Carregando usuários...", "info");

    const response = await api.get("/users");

    if (response.success) {
      users = response.data.data || [];
      renderUsersTable();
      showMessage(`${users.length} usuário(s) carregado(s)`, "success");
    } else {
      showMessage("Erro ao carregar usuários", "error");
    }
  } catch (error) {
    console.error("Error loading users:", error);
    showMessage("Erro ao carregar usuários: " + error.message, "error");
  }
}

function renderUsersTable() {
  const tbody = document.getElementById("usersTableBody");

  if (users.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align: center;">Nenhum usuário encontrado</td></tr>';
    return;
  }

  tbody.innerHTML = users
    .map(
      (user) => `
        <tr>
            <td>${user.id}</td>
            <td>${user.email}</td>
            <td><span class="status-badge status-${user.role}">${
        user.role
      }</span></td>
            <td>${formatDate(user.createdAt)}</td>
            <td>${formatDate(user.updatedAt)}</td>
            <td class="action-buttons">
                <button onclick="editUser('${
                  user.id
                }')" class="btn btn-edit">Editar</button>
                <button onclick="deleteUser('${
                  user.id
                }')" class="btn btn-delete">Deletar</button>
            </td>
        </tr>
    `
    )
    .join("");
}

async function handleCreateUser(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };

  try {
    showMessage("Criando usuário...", "info");

    const response = await api.post("/users", userData);

    if (response.success) {
      showMessage("Usuário criado com sucesso!", "success");
      event.target.reset();
      hideCreateForm();
      loadUsers(); // Reload the table
    } else {
      showMessage("Erro ao criar usuário: " + response.message, "error");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    showMessage("Erro ao criar usuário: " + error.message, "error");
  }
}

async function editUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    showMessage("Usuário não encontrado", "error");
    return;
  }

  // For now, just show a simple edit form
  // In a real app, you'd have a modal or separate edit page
  const newEmail = prompt("Novo email:", user.email);
  if (!newEmail) return;

  try {
    showMessage("Atualizando usuário...", "info");

    const response = await api.patch(`/users/${userId}`, { email: newEmail });

    if (response.success) {
      showMessage("Usuário atualizado com sucesso!", "success");
      loadUsers(); // Reload the table
    } else {
      showMessage("Erro ao atualizar usuário: " + response.message, "error");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    showMessage("Erro ao atualizar usuário: " + error.message, "error");
  }
}

async function deleteUser(userId) {
  if (!confirm("Tem certeza que deseja deletar este usuário?")) {
    return;
  }

  try {
    showMessage("Deletando usuário...", "info");

    const response = await api.delete(`/users/${userId}`);

    if (response.success) {
      showMessage("Usuário deletado com sucesso!", "success");
      loadUsers(); // Reload the table
    } else {
      showMessage("Erro ao deletar usuário: " + response.message, "error");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    showMessage("Erro ao deletar usuário: " + error.message, "error");
  }
}

function showCreateForm() {
  document.getElementById("createUserForm").style.display = "block";
}

function hideCreateForm() {
  document.getElementById("createUserForm").style.display = "none";
  document.getElementById("userForm").reset();
}

function showMessage(message, type = "info") {
  const messagesDiv = document.getElementById("messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}-message`;
  messageDiv.textContent = message;

  messagesDiv.appendChild(messageDiv);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 5000);
}

function formatDate(dateString) {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return dateString;
  }
}
