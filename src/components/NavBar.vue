<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
      <!-- Brand -->
      <router-link class="navbar-brand fw-bold" to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Poké_Ball_icon.svg"
          alt="PokeBall"
          width="30"
          height="30"
          class="d-inline-block align-text-top me-2"
        />
        PokéDex Online
      </router-link>

      <!-- Mobile toggle button -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navigation items -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <!-- Public routes -->
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/"
              :class="{ active: $route.name === 'Home' }"
            >
              <i class="bi bi-house-fill me-1"></i>
              Home
            </router-link>
          </li>

          <!-- Authenticated user routes -->
          <li v-if="authStore.isAuthenticated" class="nav-item">
            <router-link
              class="nav-link"
              to="/dashboard"
              :class="{ active: $route.name === 'Dashboard' }"
            >
              <i class="bi bi-speedometer2 me-1"></i>
              Dashboard
            </router-link>
          </li>

          <!-- Admin only routes -->
          <li v-if="authStore.isAdmin" class="nav-item">
            <router-link
              class="nav-link"
              to="/admin"
              :class="{ active: $route.name === 'Admin' }"
            >
              <i class="bi bi-gear-fill me-1"></i>
              Admin Panel
            </router-link>
          </li>
        </ul>

        <!-- User actions -->
        <ul class="navbar-nav">
          <!-- Guest user actions -->
          <template v-if="!authStore.isAuthenticated">
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/login"
                :class="{ active: $route.name === 'Login' }"
              >
                <i class="bi bi-box-arrow-in-right me-1"></i>
                Login
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/register"
                :class="{ active: $route.name === 'Register' }"
              >
                <i class="bi bi-person-plus-fill me-1"></i>
                Register
              </router-link>
            </li>
          </template>

          <!-- Authenticated user actions -->
          <template v-else>
            <!-- User dropdown -->
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person-circle me-2"></i>
                <span class="d-none d-md-inline">{{
                  authStore.user.username
                }}</span>
                <span
                  v-if="authStore.isAdmin"
                  class="badge bg-warning text-dark ms-2"
                  >Admin</span
                >
              </a>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <h6 class="dropdown-header">
                    <i class="bi bi-person-circle me-2"></i>
                    {{ authStore.user.username }}
                  </h6>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <router-link class="dropdown-item" to="/dashboard">
                    <i class="bi bi-speedometer2 me-2"></i>
                    Dashboard
                  </router-link>
                </li>
                <li v-if="authStore.isAdmin">
                  <router-link class="dropdown-item" to="/admin">
                    <i class="bi bi-gear-fill me-2"></i>
                    Admin Panel
                  </router-link>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <button
                    class="dropdown-item text-danger"
                    @click="handleLogout"
                    :disabled="isLoggingOut"
                  >
                    <i class="bi bi-box-arrow-right me-2"></i>
                    <span v-if="isLoggingOut">Logging out...</span>
                    <span v-else>Logout</span>
                  </button>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Composables
const router = useRouter();
const authStore = useAuthStore();

// State
const isLoggingOut = ref(false);

// Methods
async function handleLogout() {
  if (isLoggingOut.value) return;

  try {
    isLoggingOut.value = true;
    authStore.logout();

    // Redirect to home page
    await router.push("/");

    // Show success message (you can replace this with a toast notification)
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    isLoggingOut.value = false;
  }
}
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
}

.nav-link {
  transition: all 0.3s ease;
  border-radius: 0.375rem;
  margin: 0 0.25rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
}

.dropdown-item {
  transition: all 0.3s ease;
  border-radius: 0.375rem;
  margin: 0.125rem 0.5rem;
}

.dropdown-item:hover {
  background-color: var(--bs-primary);
  color: white;
}

.dropdown-item.text-danger:hover {
  background-color: var(--bs-danger);
  color: white;
}

.badge {
  font-size: 0.7rem;
}

@media (max-width: 768px) {
  .nav-link {
    margin: 0.25rem 0;
  }

  .dropdown-menu {
    position: static !important;
    transform: none !important;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.1);
    margin-top: 0.5rem;
  }
}
</style>