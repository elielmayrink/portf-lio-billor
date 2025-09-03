// Drivers management listing (+ quick CRUD)
let drivers = [];
let usersForSelect = [];

document.addEventListener("DOMContentLoaded", function () {
  if (!isAuthenticated()) {
    window.location.href = "index.html";
    return;
  }

  Promise.all([loadUsersForSelect(), loadDrivers()]).then(() => {
    setupEventListeners();
  });
});

function setupEventListeners() {
  const form = document.getElementById("driverForm");
  if (form) form.addEventListener("submit", handleCreateDriver);
}

async function loadUsersForSelect() {
  try {
    const res = await api.get("/users");
    if (res.success) {
      const dataset = res.data?.data ?? [];
      usersForSelect = dataset;
      const select = document.getElementById("userId");
      if (select) {
        select.innerHTML =
          '<option value="">Selecione um usuário...</option>' +
          dataset
            .map(
              (u) => `<option value="${u.id}">${u.email} (${u.role})</option>`
            )
            .join("");
      }
    }
  } catch (_) {}
}

async function loadDrivers() {
  try {
    showMessage("Carregando motoristas...", "info");

    const response = await api.get("/drivers");

    if (response.success) {
      const payload = response.data;
      drivers = payload.data || [];
      renderDriversTable();
      showMessage(`${drivers.length} motoristas carregados`, "success");
    } else {
      showMessage("Erro ao carregar motoristas", "error");
    }
  } catch (error) {
    console.error("Error loading drivers:", error);
    showMessage("Erro ao carregar motoristas: " + error.message, "error");
  }
}

function renderDriversTable() {
  const tbody = document.getElementById("driversTableBody");

  if (!drivers || drivers.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align: center;">Nenhum motorista encontrado</td></tr>';
    return;
  }

  tbody.innerHTML = drivers
    .map(
      (d) => `
        <tr>
            <td>${d.id}</td>
            <td>${d.name}</td>
            <td>${d.license}</td>
            <td>${d.status}</td>
            <td>${d.userId}</td>
            <td>${formatDate(d.createdAt)}</td>
            <td>${formatDate(d.updatedAt)}</td>
            <td class="action-buttons">
              <button class="btn btn-edit" onclick="editDriver('${
                d.id
              }')">Editar</button>
              <button class="btn btn-delete" onclick="deleteDriver('${
                d.id
              }')">Deletar</button>
            </td>
        </tr>
    `
    )
    .join("");
}

function validateDriverForm({ name, license, userId }) {
  if (!name || name.trim().length < 3)
    return "Nome deve ter ao menos 3 caracteres";
  if (!/^\d{11}$/.test(license)) return "CNH deve ter 11 dígitos numéricos";
  if (!userId) return "Selecione um usuário";
  return null;
}

async function handleCreateDriver(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const payload = {
    name: String(formData.get("name")),
    license: String(formData.get("license")),
    userId: String(formData.get("userId")),
  };

  const validationError = validateDriverForm(payload);
  if (validationError) {
    showMessage(validationError, "error");
    return;
  }

  try {
    showMessage("Criando motorista...", "info");
    const res = await api.post("/drivers", payload);
    if (res.success) {
      showMessage("Motorista criado com sucesso!", "success");
      event.target.reset();
      hideCreateForm();
      await loadDrivers();
    } else {
      showMessage("Erro ao criar motorista: " + res.message, "error");
    }
  } catch (err) {
    showMessage("Erro ao criar motorista: " + err.message, "error");
  }
}

async function editDriver(id) {
  const d = drivers.find((x) => x.id === id);
  if (!d) return showMessage("Motorista não encontrado", "error");

  const newName = prompt("Novo nome:", d.name);
  if (newName === null) return;
  const newLicense = prompt("Nova CNH (11 dígitos):", d.license);
  if (newLicense === null) return;
  const newStatus = prompt(
    "Novo status (active|inactive|suspended|pending):",
    d.status
  );
  if (newStatus === null) return;

  const validationError = validateDriverForm({
    name: newName,
    license: newLicense,
    userId: d.userId,
  });
  if (validationError) {
    showMessage(validationError, "error");
    return;
  }

  try {
    showMessage("Atualizando motorista...", "info");
    const res = await api.patch(`/drivers/${id}`, {
      name: newName,
      license: newLicense,
      status: newStatus,
    });
    if (res.success) {
      showMessage("Motorista atualizado!", "success");
      await loadDrivers();
    } else {
      showMessage("Erro ao atualizar motorista: " + res.message, "error");
    }
  } catch (err) {
    showMessage("Erro ao atualizar motorista: " + err.message, "error");
  }
}

async function deleteDriver(id) {
  if (!confirm("Tem certeza que deseja deletar este motorista?")) return;
  try {
    showMessage("Deletando motorista...", "info");
    const res = await api.delete(`/drivers/${id}`);
    if (res.success || res.data === null) {
      showMessage("Motorista deletado!", "success");
      await loadDrivers();
    } else {
      showMessage("Erro ao deletar motorista: " + res.message, "error");
    }
  } catch (err) {
    showMessage("Erro ao deletar motorista: " + err.message, "error");
  }
}

function showCreateForm() {
  document.getElementById("createDriverForm").style.display = "block";
}

function hideCreateForm() {
  document.getElementById("createDriverForm").style.display = "none";
  const form = document.getElementById("driverForm");
  if (form) form.reset();
}

function showMessage(message, type = "info") {
  const messagesDiv = document.getElementById("messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}-message`;
  messageDiv.textContent = message;
  messagesDiv.appendChild(messageDiv);
  setTimeout(() => {
    if (messageDiv.parentNode) messageDiv.parentNode.removeChild(messageDiv);
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
