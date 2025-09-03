// API client for backend communication
const API_BASE_URL = "http://localhost:3001/api/v1";

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle different response types
      if (response.status === 204) {
        return { success: true, data: null };
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // Auth endpoints
  async login(credentials) {
    return this.post("/auth/login", credentials);
  }

  async getProfile() {
    return this.get("/auth/me");
  }

  // Health check
  async health() {
    return this.get("/health");
  }

  // Users endpoints
  async getUsers(query = {}) {
    const queryString = new URLSearchParams(query).toString();
    const endpoint = queryString ? `/users?${queryString}` : "/users";
    return this.get(endpoint);
  }

  async getUser(id) {
    return this.get(`/users/${id}`);
  }

  async createUser(userData) {
    return this.post("/users", userData);
  }

  async updateUser(id, userData) {
    return this.patch(`/users/${id}`, userData);
  }

  async deleteUser(id) {
    return this.delete(`/users/${id}`);
  }
}

// Create global instance
const api = new ApiClient();
