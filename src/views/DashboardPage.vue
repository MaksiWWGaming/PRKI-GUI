<template>
  <div class="dashboard-page">
    <div class="container-fluid py-4">
      <!-- Welcome Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h1 class="card-title mb-2">
                    <i class="bi bi-speedometer2 me-3"></i>
                    Welcome back, {{ authStore.user?.username }}!
                  </h1>
                  <p class="card-text mb-0">
                    <i class="bi bi-calendar-event me-2"></i>
                    {{ currentDate }}
                    <span
                      v-if="authStore.isAdmin"
                      class="badge bg-warning text-dark ms-3"
                    >
                      <i class="bi bi-star-fill me-1"></i>
                      Administrator
                    </span>
                  </p>
                </div>
                <div class="col-md-4 text-md-end">
                  <div class="dashboard-stats">
                    <div class="stat-item">
                      <i class="bi bi-clock-history fs-4 opacity-75"></i>
                      <div class="ms-2">
                        <small class="opacity-75">Last login</small>
                        <div class="fw-bold">{{ lastLoginTime }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="row mb-4">
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body text-center">
              <div
                class="stat-icon bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-3"
              >
                <i class="bi bi-collection fs-3"></i>
              </div>
              <h3 class="fw-bold text-primary">{{ pokemonStats.total }}</h3>
              <p class="text-muted mb-0">Pokémon Discovered</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body text-center">
              <div
                class="stat-icon bg-success bg-opacity-10 text-success rounded-circle mx-auto mb-3"
              >
                <i class="bi bi-search fs-3"></i>
              </div>
              <h3 class="fw-bold text-success">{{ userStats.searches }}</h3>
              <p class="text-muted mb-0">Searches Performed</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body text-center">
              <div
                class="stat-icon bg-warning bg-opacity-10 text-warning rounded-circle mx-auto mb-3"
              >
                <i class="bi bi-heart-fill fs-3"></i>
              </div>
              <h3 class="fw-bold text-warning">{{ userStats.favorites }}</h3>
              <p class="text-muted mb-0">Favorite Pokémon</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mb-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body text-center">
              <div
                class="stat-icon bg-info bg-opacity-10 text-info rounded-circle mx-auto mb-3"
              >
                <i class="bi bi-calendar-check fs-3"></i>
              </div>
              <h3 class="fw-bold text-info">{{ userStats.daysActive }}</h3>
              <p class="text-muted mb-0">Days Active</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Left Column -->
        <div class="col-lg-8">
          <!-- Recent Activity -->
          <div class="card mb-4">
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <h5 class="mb-0">
                <i class="bi bi-activity me-2 text-primary"></i>
                Recent Activity
              </h5>
              <button
                class="btn btn-sm btn-outline-primary"
                @click="refreshActivity"
              >
                <i class="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </button>
            </div>
            <div class="card-body">
              <div v-if="recentActivity.length === 0" class="text-center py-4">
                <i class="bi bi-inbox fs-1 text-muted"></i>
                <p class="text-muted mt-2">No recent activity</p>
                <router-link to="/" class="btn btn-primary">
                  <i class="bi bi-search me-2"></i>
                  Start Exploring
                </router-link>
              </div>
              <div v-else class="activity-list">
                <div
                  v-for="(activity, index) in recentActivity"
                  :key="index"
                  class="activity-item d-flex align-items-center py-3"
                  :class="{
                    'border-bottom': index < recentActivity.length - 1,
                  }"
                >
                  <div class="activity-icon me-3">
                    <i :class="activity.icon" class="fs-5"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-medium">{{ activity.title }}</div>
                    <small class="text-muted">{{ activity.description }}</small>
                  </div>
                  <div class="activity-time">
                    <small class="text-muted">{{ activity.time }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-lightning-charge me-2 text-warning"></i>
                Quick Actions
              </h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <router-link
                    to="/"
                    class="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <i class="bi bi-house-door fs-2 mb-2"></i>
                    <span class="fw-medium">Explore Pokémon</span>
                    <small class="text-muted">Browse the collection</small>
                  </router-link>
                </div>
                <div class="col-md-6">
                  <button
                    class="btn btn-outline-success w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                    @click="showProfileModal = true"
                  >
                    <i class="bi bi-person-gear fs-2 mb-2"></i>
                    <span class="fw-medium">Edit Profile</span>
                    <small class="text-muted">Update your information</small>
                  </button>
                </div>
                <div v-if="authStore.isAdmin" class="col-md-6">
                  <router-link
                    to="/admin"
                    class="btn btn-outline-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                  >
                    <i class="bi bi-gear-fill fs-2 mb-2"></i>
                    <span class="fw-medium">Admin Panel</span>
                    <small class="text-muted">Manage entities</small>
                  </router-link>
                </div>
                <div class="col-md-6">
                  <button
                    class="btn btn-outline-danger w-100 h-100 d-flex flex-column align-items-center justify-content-center py-3"
                    @click="handleLogout"
                  >
                    <i class="bi bi-box-arrow-right fs-2 mb-2"></i>
                    <span class="fw-medium">Sign Out</span>
                    <small class="text-muted">End your session</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="col-lg-4">
          <!-- User Profile Card -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-person-circle me-2 text-info"></i>
                Profile Information
              </h5>
            </div>
            <div class="card-body">
              <div class="text-center mb-3">
                <div
                  class="profile-avatar bg-primary text-white rounded-circle mx-auto mb-3"
                >
                  <i class="bi bi-person-fill fs-1"></i>
                </div>
                <h6 class="fw-bold">{{ authStore.user?.username }}</h6>
                <p class="text-muted small mb-0">{{ authStore.user?.email }}</p>
                <span class="badge bg-primary mt-2">{{
                  authStore.user?.role
                }}</span>
              </div>

              <div class="profile-details">
                <div
                  class="detail-item d-flex justify-content-between py-2 border-bottom"
                >
                  <span class="text-muted">Member since</span>
                  <span class="fw-medium">{{ memberSince }}</span>
                </div>
                <div
                  class="detail-item d-flex justify-content-between py-2 border-bottom"
                >
                  <span class="text-muted">Account type</span>
                  <span class="fw-medium text-capitalize">{{
                    authStore.user?.role
                  }}</span>
                </div>
                <div class="detail-item d-flex justify-content-between py-2">
                  <span class="text-muted">Status</span>
                  <span class="badge bg-success">Active</span>
                </div>
              </div>

              <button
                class="btn btn-primary w-100 mt-3"
                @click="showProfileModal = true"
              >
                <i class="bi bi-pencil me-2"></i>
                Edit Profile
              </button>
            </div>
          </div>

          <!-- System Status -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-cpu me-2 text-success"></i>
                System Status
              </h5>
            </div>
            <div class="card-body">
              <div
                class="status-item d-flex justify-content-between align-items-center mb-3"
              >
                <div>
                  <div class="fw-medium">API Status</div>
                  <small class="text-muted">PokeAPI Connection</small>
                </div>
                <span class="badge bg-success">
                  <i class="bi bi-check-circle me-1"></i>
                  Online
                </span>
              </div>

              <div
                class="status-item d-flex justify-content-between align-items-center mb-3"
              >
                <div>
                  <div class="fw-medium">Database</div>
                  <small class="text-muted">Local Storage</small>
                </div>
                <span class="badge bg-success">
                  <i class="bi bi-check-circle me-1"></i>
                  Connected
                </span>
              </div>

              <div
                class="status-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <div class="fw-medium">Authentication</div>
                  <small class="text-muted">Session Status</small>
                </div>
                <span class="badge bg-success">
                  <i class="bi bi-shield-check me-1"></i>
                  Secure
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Edit Modal -->
    <div
      v-if="showProfileModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-person-gear me-2"></i>
              Edit Profile
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="showProfileModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateProfile">
              <div class="mb-3">
                <label for="profileUsername" class="form-label">Username</label>
                <input
                  id="profileUsername"
                  v-model="profileForm.username"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="profileEmail" class="form-label">Email</label>
                <input
                  id="profileEmail"
                  v-model="profileForm.email"
                  type="email"
                  class="form-control"
                  required
                />
              </div>
              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                <small
                  >Profile updates are simulated in this demo
                  application.</small
                >
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showProfileModal = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="updateProfile"
            >
              <i class="bi bi-check-circle me-2"></i>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useEntitiesStore } from "@/stores/entities";

// Composables
const router = useRouter();
const authStore = useAuthStore();
const entitiesStore = useEntitiesStore();

// State
const showProfileModal = ref(false);
const profileForm = ref({
  username: "",
  email: "",
});

const recentActivity = ref([
  {
    icon: "bi bi-search text-primary",
    title: "Searched for Pokémon",
    description: "Explored the Pokémon collection",
    time: "2 hours ago",
  },
  {
    icon: "bi bi-person-check text-success",
    title: "Profile Updated",
    description: "Updated account information",
    time: "1 day ago",
  },
  {
    icon: "bi bi-box-arrow-in-right text-info",
    title: "Logged In",
    description: "Signed in to your account",
    time: "2 days ago",
  },
]);

// Computed
const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const lastLoginTime = computed(() => {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
});

const memberSince = computed(() => {
  if (authStore.user?.createdAt) {
    return new Date(authStore.user.createdAt).toLocaleDateString();
  }
  return new Date().toLocaleDateString();
});

const pokemonStats = computed(() => ({
  total: 1000 + Math.floor(Math.random() * 100),
  discovered: 150 + Math.floor(Math.random() * 50),
}));

const userStats = computed(() => ({
  searches: 25 + Math.floor(Math.random() * 20),
  favorites: 8 + Math.floor(Math.random() * 10),
  daysActive:
    Math.floor(
      (Date.now() -
        new Date(authStore.user?.createdAt || Date.now()).getTime()) /
        (1000 * 60 * 60 * 24)
    ) || 1,
}));

// Methods
function refreshActivity() {
  // Simulate refreshing activity
  const activities = [
    {
      icon: "bi bi-search text-primary",
      title: "Searched for Pikachu",
      description: "Found electric-type Pokémon",
      time: "Just now",
    },
    {
      icon: "bi bi-heart-fill text-danger",
      title: "Added to Favorites",
      description: "Liked Charizard",
      time: "5 minutes ago",
    },
    {
      icon: "bi bi-eye text-info",
      title: "Viewed Details",
      description: "Checked Blastoise stats",
      time: "10 minutes ago",
    },
  ];

  recentActivity.value = activities;
}

function updateProfile() {
  // Simulate profile update
  alert("Profile updated successfully! (This is a demo simulation)");
  showProfileModal.value = false;
}

async function handleLogout() {
  if (confirm("Are you sure you want to sign out?")) {
    authStore.logout();
    await router.push("/");
  }
}

// Lifecycle
onMounted(() => {
  // Initialize stores
  authStore.initializeStore();
  entitiesStore.initializeStore();

  // Populate profile form
  if (authStore.user) {
    profileForm.value = {
      username: authStore.user.username || "",
      email: authStore.user.email || "",
    };
  }
});
</script>

<style scoped>
.dashboard-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: box-shadow 0.15s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-stats .stat-item {
  display: flex;
  align-items: center;
}

.activity-item {
  transition: background-color 0.2s ease;
}

.activity-item:hover {
  background-color: rgba(var(--bs-primary-rgb), 0.05);
  border-radius: 0.375rem;
  margin: 0 -1rem;
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background-color: rgba(var(--bs-primary-rgb), 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-item:last-child {
  border-bottom: none !important;
}

.status-item {
  padding: 0.5rem 0;
}

.btn-outline-primary:hover,
.btn-outline-success:hover,
.btn-outline-warning:hover,
.btn-outline-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.modal.show {
  display: block;
}

.modal-content {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

.badge {
  font-size: 0.75rem;
}

/* Animation for stats cards */
.col-lg-3 {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.col-lg-3:nth-child(1) {
  animation-delay: 0.1s;
}

.col-lg-3:nth-child(2) {
  animation-delay: 0.2s;
}

.col-lg-3:nth-child(3) {
  animation-delay: 0.3s;
}

.col-lg-3:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-stats {
    text-align: center;
    margin-top: 1rem;
  }

  .stat-item {
    justify-content: center;
  }

  .activity-item {
    flex-direction: column;
    text-align: center;
  }

  .activity-icon {
    margin-bottom: 0.5rem;
  }

  .activity-time {
    margin-top: 0.5rem;
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

  .btn.w-100.h-100 {
    min-height: 100px;
  }
}
</style>