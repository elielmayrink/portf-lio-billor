// Trucks management listing
let trucks = [];

document.addEventListener("DOMContentLoaded", function () {
  if (!isAuthenticated()) {
    window.location.href = "index.html";
    return;
  }

  loadTrucks();
  setupEventListeners();
});

function setupEventListeners() {
  const form = document.getElementById("truckForm");
  if (form) form.addEventListener("submit", handleCreateTruck);
}

async function loadTrucks() {
  try {
    showMessage("Carregando caminhões...", "info");

    const response = await api.get("/trucks");

    if (response.success) {
      const payload = response.data;
      trucks = payload.data || [];
      renderTrucksTable();
      showMessage(`${trucks.length} caminhões carregados`, "success");
    } else {
      showMessage("Erro ao carregar caminhões", "error");
    }
  } catch (error) {
    console.error("Error loading trucks:", error);
    showMessage("Erro ao carregar caminhões: " + error.message, "error");
  }
}

function renderTrucksTable() {
  const tbody = document.getElementById("trucksTableBody");

  if (!trucks || trucks.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align: center;">Nenhum caminhão encontrado</td></tr>';
    return;
  }

  tbody.innerHTML = trucks
    .map(
      (truck) => `
        <tr>
            <td>${truck.id}</td>
            <td>${truck.plate}</td>
            <td>${truck.model}</td>
            <td>${truck.year ?? "-"}</td>
            <td>${truck.driverId ?? "-"}</td>
            <td>${formatDate(truck.createdAt)}</td>
            <td>${formatDate(truck.updatedAt)}</td>
            <td class="action-buttons">
              <button class="btn btn-edit" onclick="editTruck('${
                truck.id
              }')">Editar</button>
              <button class="btn btn-delete" onclick="deleteTruck('${
                truck.id
              }')">Deletar</button>
            </td>
        </tr>
    `
    )
    .join("");
}

async function handleCreateTruck(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const payload = {
    plate: String(formData.get("plate")).toUpperCase(),
    model: String(formData.get("model")),
    year: formData.get("year") ? Number(formData.get("year")) : undefined,
  };

  try {
    showMessage("Criando caminhão...", "info");
    const res = await api.post("/trucks", payload);
    if (res.success) {
      showMessage("Caminhão criado com sucesso!", "success");
      event.target.reset();
      hideCreateForm();
      await loadTrucks();
    } else {
      showMessage("Erro ao criar caminhão: " + res.message, "error");
    }
  } catch (err) {
    showMessage("Erro ao criar caminhão: " + err.message, "error");
  }
}

async function editTruck(id) {
  const truck = trucks.find((t) => t.id === id);
  if (!truck) return showMessage("Caminhão não encontrado", "error");

  const newPlate = prompt("Nova placa:", truck.plate);
  if (newPlate === null) return;
  const newModel = prompt("Novo modelo:", truck.model);
  if (newModel === null) return;
  const newYearStr = prompt("Novo ano:", String(truck.year ?? ""));
  if (newYearStr === null) return;
  const newYear = newYearStr ? Number(newYearStr) : undefined;

  try {
    showMessage("Atualizando caminhão...", "info");
    const res = await api.patch(`/trucks/${id}`, {
      plate: newPlate?.toUpperCase(),
      model: newModel,
      year: newYear,
    });
    if (res.success) {
      showMessage("Caminhão atualizado!", "success");
      await loadTrucks();
    } else {
      showMessage("Erro ao atualizar caminhão: " + res.message, "error");
    }
  } catch (err) {
    showMessage("Erro ao atualizar caminhão: " + err.message, "error");
  }
}

async function deleteTruck(id) {
  if (!confirm("Tem certeza que deseja deletar este caminhão?")) return;
  try {
    showMessage("Deletando caminhão...", "info");
    const res = await api.delete(`/trucks/${id}`);
    if (res.success || res.data === null) {
      showMessage("Caminhão deletado!", "success");
      await loadTrucks();
    } else {
      showMessage("Erro ao deletar caminhão: " + res.message, "error");
    }
  } catch (err) {
    showMessage("Erro ao deletar caminhão: " + err.message, "error");
  }
}

function showCreateForm() {
  document.getElementById("createTruckForm").style.display = "block";
}

function hideCreateForm() {
  document.getElementById("createTruckForm").style.display = "none";
  const form = document.getElementById("truckForm");
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
