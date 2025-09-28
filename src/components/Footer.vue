<template>
  <footer class="bg-dark text-light py-4 mt-auto">
    <div class="container">
      <div class="row">
        <!-- Company Info -->
        <div class="col-md-4 mb-3">
          <h5 class="fw-bold mb-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Poké_Ball_icon.svg"
              alt="PokeBall"
              width="30"
              height="30"
              class="d-inline-block align-text-top me-2"
            />
            PokéDex Online
          </h5>
          <p class="mb-2">Explore all of your favorite Pokémon in one place!</p>
        </div>

        <!-- Quick Links -->
        <div class="col-md-4 mb-3">
          <h6 class="fw-bold mb-3">Quick Links</h6>
          <ul class="list-unstyled">
            <li class="mb-2">
              <router-link to="/" class="text-decoration-none hover-link">
                <i class="bi bi-house me-2"></i>Home
              </router-link>
            </li>
            <li v-if="authStore.isAuthenticated" class="mb-2">
              <router-link
                to="/dashboard"
                class="text-decoration-none hover-link"
              >
                <i class="bi bi-speedometer2 me-2"></i>Dashboard
              </router-link>
            </li>
            <li v-if="authStore.isAdmin" class="mb-2">
              <router-link to="/admin" class="text-decoration-none hover-link">
                <i class="bi bi-gear me-2"></i>Admin Panel
              </router-link>
            </li>
            <li v-if="!authStore.isAuthenticated" class="mb-2">
              <router-link to="/login" class="text-decoration-none hover-link">
                <i class="bi bi-box-arrow-in-right me-2"></i>Login
              </router-link>
            </li>
            <li v-if="!authStore.isAuthenticated" class="mb-2">
              <router-link
                to="/register"
                class="text-decoration-none hover-link"
              >
                <i class="bi bi-person-plus me-2"></i>Register
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact & Social -->
        <div class="col-md-4 mb-3">
          <h6 class="fw-bold mb-3">Connect With Us</h6>
          <div class="mb-3">
            <p class="small mb-1">
              <i class="bi bi-envelope me-2"></i>
              xxx@xxx.xxx
            </p>
            <p class="small mb-0">
              <i class="bi bi-geo-alt me-2"></i>
              ICT College, Belgrade, Serbia
            </p>
          </div>

          <!-- Social Links -->
          <div class="d-flex gap-3">
            <a
              href="https://www.instagram.com/"
              class="hover-social"
              aria-label="Instagram"
            >
              <i class="bi bi-instagram fs-5"></i>
            </a>
            <a
              href="https://x.com/home?lang=en"
              class="hover-social"
              aria-label="Twitter"
            >
              <i class="bi bi-twitter fs-5"></i>
            </a>
            <a
              href="https://github.com"
              class="hover-social"
              aria-label="GitHub"
            >
              <i class="bi bi-github fs-5"></i>
            </a>
          </div>
        </div>
      </div>

      <hr class="my-4 border-secondary" />

      <!-- Bottom Row -->
      <div class="row align-items-center">
        <div class="col-md-6">
          <p class="small mb-0">
            &copy; {{ currentYear }} Maksim Tadic 110/23. All rights reserved.
          </p>
        </div>
        <div class="col-md-6 text-md-end">
          <div class="d-flex flex-wrap justify-content-md-end gap-3">
            <a href="#" class="small text-decoration-none hover-link"
              >Privacy Policy</a
            >
            <a href="#" class="small text-decoration-none hover-link"
              >Terms of Service</a
            >
            <a href="#" class="small text-decoration-none hover-link"
              >Support</a
            >
          </div>
        </div>
      </div>

      <!-- User Status -->
      <div v-if="authStore.isAuthenticated" class="row mt-3">
        <div class="col-12">
          <div class="alert alert-info py-2 mb-0 small">
            <i class="bi bi-person-check me-2"></i>
            Logged in as <strong>{{ authStore.user.username }}</strong>
            <span
              v-if="authStore.isAdmin"
              class="badge bg-warning text-dark ms-2"
              >Admin</span
            >
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

// Composables
const authStore = useAuthStore();

// Computed
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.hover-link {
  transition: color 0.3s ease;
  color: white;
}

.hover-link:hover {
  color: var(--bs-primary) !important;
}

.hover-social {
  transition: all 0.3s ease;
  color: white;
}

.hover-social:hover {
  color: var(--bs-primary) !important;
  transform: translateY(-2px);
}

footer {
  background: linear-gradient(135deg, #212529 0%, #343a40 100%);
}

.border-secondary {
  opacity: 0.3;
}

.alert-info {
  background-color: rgba(13, 202, 240, 0.1);
  border-color: rgba(13, 202, 240, 0.2);
  color: #0dcaf0;
}

@media (max-width: 768px) {
  .col-md-6.text-md-end {
    text-align: center !important;
    margin-top: 1rem;
  }

  .d-flex.justify-content-md-end {
    justify-content: center !important;
  }
}
</style>