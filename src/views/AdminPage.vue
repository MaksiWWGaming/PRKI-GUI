<template>
  <div class="admin-page">
    <div class="container-fluid py-4">
      <!-- Admin Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card bg-warning text-dark">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h1 class="card-title mb-2">
                    <i class="bi bi-gear-fill me-3"></i>
                    Admin Panel
                  </h1>
                  <p class="card-text mb-0">
                    <i class="bi bi-shield-check me-2"></i>
                    Administrator Dashboard - Manage system settings
                    <span class="badge bg-dark ms-3">
                      <i class="bi bi-person-fill me-1"></i>
                      {{ authStore.user?.username }}
                    </span>
                  </p>
                </div>
                <div class="col-md-4 text-md-end">
                  <div class="admin-actions">
                    <router-link to="/dashboard" class="btn btn-outline-dark">
                      <i class="bi bi-arrow-left me-1"></i>
                      Back to Dashboard
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Navigation Tabs -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header p-0">
              <ul class="nav nav-tabs card-header-tabs" role="tablist">
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'users' }"
                    @click="activeTab = 'users'"
                    type="button"
                  >
                    <i class="bi bi-people me-2"></i>
                    User Management
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'settings' }"
                    @click="activeTab = 'settings'"
                    type="button"
                  >
                    <i class="bi bi-sliders me-2"></i>
                    System Settings
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link"
                    :class="{ active: activeTab === 'logs' }"
                    @click="activeTab = 'logs'"
                    type="button"
                  >
                    <i class="bi bi-journal-text me-2"></i>
                    Activity Logs
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="row">
        <div class="col-12">
          <!-- User Management Tab -->
          <div v-if="activeTab === 'users'" class="tab-content">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-people me-2"></i>
                  User Management
                </h5>
              </div>
              <div class="card-body">
                <div v-if="users.length === 0" class="text-center py-4">
                  <i class="bi bi-person-x fs-1 text-muted"></i>
                  <p class="text-muted mt-2">No users found</p>
                </div>
                <div v-else class="table-responsive">
                  <table class="table table-hover">
                    <thead class="table-light">
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="user in users" :key="user.id">
                        <td>
                          <div class="d-flex align-items-center">
                            <div
                              class="user-avatar bg-primary text-white rounded-circle me-2"
                            >
                              <i class="bi bi-person-fill"></i>
                            </div>
                            <strong>{{ user.username }}</strong>
                          </div>
                        </td>
                        <td>{{ user.email }}</td>
                        <td>
                          <span
                            class="badge"
                            :class="
                              user.role === 'admin'
                                ? 'bg-warning text-dark'
                                : 'bg-secondary'
                            "
                          >
                            {{ user.role }}
                          </span>
                        </td>
                        <td>
                          <small>{{ formatDate(user.createdAt) }}</small>
                        </td>
                        <td>
                          <span class="badge bg-success">Active</span>
                        </td>
                        <td>
                          <div class="btn-group btn-group-sm">
                            <button
                              class="btn btn-outline-primary"
                              @click="editUser(user)"
                              :disabled="user.id === authStore.user?.id"
                              title="Edit User"
                            >
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button
                              class="btn btn-outline-danger"
                              @click="deleteUser(user)"
                              :disabled="user.id === authStore.user?.id"
                              title="Delete User"
                            >
                              <i class="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- System Settings Tab -->
          <div v-else-if="activeTab === 'settings'" class="tab-content">
            <div class="row">
              <div class="col-lg-6 mb-4">
                <div class="card">
                  <div class="card-header">
                    <h6 class="mb-0">
                      <i class="bi bi-gear me-2"></i>
                      Application Settings (Demo)
                    </h6>
                  </div>
                  <div class="card-body">
                    <div
                      class="setting-item d-flex justify-content-between align-items-center mb-3"
                    >
                      <div>
                        <div class="fw-medium">Maintenance Mode</div>
                        <small class="text-muted"
                          >Enable maintenance mode for system updates</small
                        >
                      </div>
                      <div class="form-check form-switch">
                        <input
                          v-model="settings.maintenanceMode"
                          class="form-check-input"
                          type="checkbox"
                          id="maintenanceMode"
                        />
                      </div>
                    </div>

                    <div
                      class="setting-item d-flex justify-content-between align-items-center mb-3"
                    >
                      <div>
                        <div class="fw-medium">User Registration</div>
                        <small class="text-muted"
                          >Allow new users to register accounts</small
                        >
                      </div>
                      <div class="form-check form-switch">
                        <input
                          v-model="settings.allowRegistration"
                          class="form-check-input"
                          type="checkbox"
                          id="allowRegistration"
                        />
                      </div>
                    </div>

                    <button class="btn btn-primary" @click="saveSettings">
                      <i class="bi bi-check-circle me-2"></i>
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>

              <div class="col-lg-6 mb-4">
                <div class="card">
                  <div class="card-header">
                    <h6 class="mb-0">
                      <i class="bi bi-database me-2"></i>
                      Data Management
                    </h6>
                  </div>
                  <div class="card-body">
                    <div class="d-grid gap-2">
                      <button class="btn btn-outline-info" @click="exportData">
                        <i class="bi bi-download me-2"></i>
                        Export Data
                      </button>
                      <button
                        class="btn btn-outline-warning"
                        @click="clearCache"
                      >
                        <i class="bi bi-arrow-clockwise me-2"></i>
                        Clear Cache
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Logs Tab -->
          <div v-else-if="activeTab === 'logs'" class="tab-content">
            <div class="card">
              <div
                class="card-header d-flex justify-content-between align-items-center"
              >
                <h5 class="mb-0">
                  <i class="bi bi-journal-text me-2"></i>
                  Activity Logs (Demo)
                </h5>
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="refreshLogs"
                >
                  <i class="bi bi-arrow-clockwise me-1"></i>
                  Refresh
                </button>
              </div>
              <div class="card-body">
                <div class="logs-container">
                  <div
                    v-for="(log, index) in activityLogs"
                    :key="index"
                    class="log-entry d-flex align-items-start py-2"
                    :class="{
                      'border-bottom': index < activityLogs.length - 1,
                    }"
                  >
                    <div class="log-icon me-3">
                      <i :class="getLogIcon(log.type)" class="fs-5"></i>
                    </div>
                    <div class="flex-grow-1">
                      <div class="log-message">{{ log.message }}</div>
                      <div class="log-details">
                        <small class="text-muted">
                          <i class="bi bi-person me-1"></i>{{ log.user }}
                          <i class="bi bi-clock ms-3 me-1"></i
                          >{{ log.timestamp }}
                        </small>
                      </div>
                    </div>
                    <div class="log-type">
                      <span class="badge" :class="getLogBadgeClass(log.type)">
                        {{ log.type }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useEntitiesStore } from "@/stores/entities";

// Composables
const authStore = useAuthStore();
const entitiesStore = useEntitiesStore();

// State
const activeTab = ref("entities");
const users = ref([]);
const settings = ref({
  maintenanceMode: false,
  allowRegistration: true,
});

const activityLogs = ref([
  {
    type: "info",
    message: "User logged in successfully",
    user: "admin",
    timestamp: new Date().toLocaleString(),
  },
  {
    type: "success",
    message: "User created: NewUser123",
    user: "admin",
    timestamp: new Date(Date.now() - 300000).toLocaleString(),
  },
  {
    type: "warning",
    message: "Failed login attempt detected",
    user: "unknown",
    timestamp: new Date(Date.now() - 600000).toLocaleString(),
  },
  {
    type: "error",
    message: "API request failed: Network timeout",
    user: "system",
    timestamp: new Date(Date.now() - 900000).toLocaleString(),
  },
]);

// Computed
const totalUsers = computed(() => {
  try {
    return authStore.getAllUsers().length;
  } catch {
    return 1; // At least the current admin user
  }
});

const systemUptime = computed(() => {
  const uptime = Math.floor(Math.random() * 72) + 1;
  return `${uptime} hours`;
});

// Methods
function loadUsers() {
  try {
    users.value = authStore.getAllUsers();
  } catch (error) {
    console.error("Failed to load users:", error);
    users.value = [];
  }
}

function editUser(user) {
  alert(`Edit user functionality for users is not implemented in this demo.`);
}

async function deleteUser(user) {
  if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
    try {
      await authStore.deleteUser(user.id);
      loadUsers(); // Refresh the user list
      alert("User deleted successfully!");
    } catch (error) {
      alert(`Failed to delete user: ${error.message}`);
    }
  }
}

function saveSettings() {
  // Simulate saving settings
  localStorage.setItem("admin_settings", JSON.stringify(settings.value));
  alert("Settings saved successfully!");
}

function exportData() {
  // Simulate data export
  const data = {
    entities: entitiesStore.entities,
    users: users.value,
    settings: settings.value,
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vue-app-data-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function clearCache() {
  if (confirm("Are you sure you want to clear the application cache?")) {
    // Clear localStorage except for essential data
    const essentialKeys = ["vue_app_current_user", "vue_app_users"];
    const allKeys = Object.keys(localStorage);

    allKeys.forEach((key) => {
      if (!essentialKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    alert("Cache cleared successfully!");
  }
}

function refreshLogs() {
  // Simulate refreshing logs
  const newLog = {
    type: "info",
    message: "Admin refreshed activity logs",
    user: authStore.user?.username || "admin",
    timestamp: new Date().toLocaleString(),
  };

  activityLogs.value.unshift(newLog);

  // Keep only the last 20 logs
  if (activityLogs.value.length > 20) {
    activityLogs.value = activityLogs.value.slice(0, 20);
  }
}

function getLogIcon(type) {
  const icons = {
    info: "bi bi-info-circle text-info",
    success: "bi bi-check-circle text-success",
    warning: "bi bi-exclamation-triangle text-warning",
    error: "bi bi-x-circle text-danger",
  };
  return icons[type] || "bi bi-circle text-muted";
}

function getLogBadgeClass(type) {
  const classes = {
    info: "bg-info",
    success: "bg-success",
    warning: "bg-warning text-dark",
    error: "bg-danger",
  };
  return classes[type] || "bg-secondary";
}

function formatDate(dateString) {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
}

// Lifecycle
onMounted(() => {
  // Initialize stores
  authStore.initializeStore();
  entitiesStore.initializeStore();

  // Load users
  loadUsers();

  // Load saved settings
  const savedSettings = localStorage.getItem("admin_settings");
  if (savedSettings) {
    try {
      settings.value = { ...settings.value, ...JSON.parse(savedSettings) };
    } catch (error) {
      console.error("Failed to load saved settings:", error);
    }
  }
});
</script>

<style scoped>
.admin-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.nav-tabs .nav-link {
  border: none;
  color: #6c757d;
  font-weight: 500;
}

.nav-tabs .nav-link.active {
  background-color: #fff;
  color: var(--bs-primary);
  border-bottom: 2px solid var(--bs-primary);
}

.nav-tabs .nav-link:hover {
  border-color: transparent;
  color: var(--bs-primary);
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-item {
  text-align: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
}

.info-label {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
}

.user-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.setting-item {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.form-switch .form-check-input {
  width: 2em;
  height: 1em;
}

.logs-container {
  max-height: 500px;
  overflow-y: auto;
}

.log-entry {
  padding: 0.75rem 0;
  transition: background-color 0.2s ease;
}

.log-entry:hover {
  background-color: rgba(var(--bs-primary-rgb), 0.05);
  border-radius: 0.375rem;
  margin: 0 -1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

.log-icon {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.log-message {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.log-details {
  font-size: 0.875rem;
}

.badge {
  font-size: 0.75rem;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .admin-actions {
    text-align: center;
    margin-top: 1rem;
  }

  .admin-actions .btn {
    display: block;
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .nav-tabs {
    flex-wrap: wrap;
  }

  .nav-tabs .nav-link {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
  }

  .table-responsive {
    font-size: 0.875rem;
  }

  .info-item {
    margin-bottom: 1rem;
  }
}

@media (max-width: 576px) {
  .container-fluid {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .card-body {
    padding: 1rem;
  }

  .log-entry {
    flex-direction: column;
    align-items: flex-start;
  }

  .log-icon {
    margin-bottom: 0.5rem;
  }

  .log-type {
    margin-top: 0.5rem;
  }
}
</style>
