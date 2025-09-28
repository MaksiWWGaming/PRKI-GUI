<template>
  <div class="register-page">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <!-- Left Side - Registration Form -->
        <div class="col-lg-7 d-flex justify-content-center">
          <div class="register-form-container w-100 p-4">
            <!-- Mobile Header -->
            <div class="d-lg-none text-center mb-4">
              <i class="bi bi-lightning-charge-fill fs-1 text-primary"></i>
              <h2 class="mt-2">Create Account</h2>
              <p class="text-muted">Join Vue App today</p>
            </div>

            <!-- Desktop Header -->
            <div class="d-none d-lg-block text-center mb-4">
              <h2 class="fw-bold text-dark mb-2">Create Your Account</h2>
              <p class="text-muted">
                Fill in the information below to get started
              </p>
            </div>

            <!-- Alert Messages -->
            <div
              v-if="$route.query.error"
              class="alert alert-warning alert-dismissible fade show"
              role="alert"
            >
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ $route.query.error }}
              <button
                type="button"
                class="btn-close"
                @click="clearQueryParams"
              ></button>
            </div>

            <div
              v-if="$route.query.message"
              class="alert alert-info alert-dismissible fade show"
              role="alert"
            >
              <i class="bi bi-info-circle me-2"></i>
              {{ $route.query.message }}
              <button
                type="button"
                class="btn-close"
                @click="clearQueryParams"
              ></button>
            </div>

            <!-- Registration Form -->
            <RegisterForm
              :show-role-selection="false"
              @success="handleRegistrationSuccess"
              @error="handleRegistrationError"
              @switch-to-login="handleSwitchToLogin"
            />

            <!-- Additional Information -->
            <div class="text-center mt-4">
              <div class="row">
                <div class="col-12">
                  <hr class="my-4" />
                  <div class="row text-start">
                    <div class="col-md-6 mb-3">
                      <div class="d-flex align-items-start">
                        <i
                          class="bi bi-shield-check text-success me-3 fs-5 mt-1"
                        ></i>
                        <div>
                          <h6 class="mb-1">Secure & Private</h6>
                          <small class="text-muted"
                            >Your personal information is encrypted and
                            protected</small
                          >
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <div class="d-flex align-items-start">
                        <i
                          class="bi bi-lightning-charge text-warning me-3 fs-5 mt-1"
                        ></i>
                        <div>
                          <h6 class="mb-1">Instant Access</h6>
                          <small class="text-muted"
                            >Start exploring immediately after
                            registration</small
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Branding -->
        <div class="col-lg-5 d-none d-lg-flex bg-success text-white">
          <div
            class="d-flex flex-column justify-content-center align-items-center w-100 p-5"
          >
            <div class="text-center">
              <i class="bi bi-person-plus-fill display-1 text-warning mb-4"></i>
              <h1 class="display-5 fw-bold mb-4">Join Our Community!</h1>
              <p class="lead mb-4">
                Create your account and become part of our growing community.
                Discover amazing features and connect with fellow Pokémon
                enthusiasts.
              </p>

              <!-- Benefits List -->
              <div class="row text-start mt-5">
                <div class="col-12">
                  <div class="benefit-item mb-4">
                    <i
                      class="bi bi-check-circle-fill text-warning me-3 fs-4"
                    ></i>
                    <div>
                      <h6 class="mb-1">Personal Dashboard</h6>
                      <small class="opacity-75"
                        >Get your own personalized dashboard with custom
                        settings</small
                      >
                    </div>
                  </div>
                  <div class="benefit-item mb-4">
                    <i class="bi bi-collection text-warning me-3 fs-4"></i>
                    <div>
                      <h6 class="mb-1">Pokémon Explorer</h6>
                      <small class="opacity-75"
                        >Browse and search through hundreds of Pokémon</small
                      >
                    </div>
                  </div>
                  <div class="benefit-item mb-4">
                    <i class="bi bi-people text-warning me-3 fs-4"></i>
                    <div>
                      <h6 class="mb-1">Community Features</h6>
                      <small class="opacity-75"
                        >Connect with other users and share your
                        discoveries</small
                      >
                    </div>
                  </div>
                  <div class="benefit-item mb-4">
                    <i class="bi bi-gear text-warning me-3 fs-4"></i>
                    <div>
                      <h6 class="mb-1">Advanced Features</h6>
                      <small class="opacity-75"
                        >Access premium features and customization
                        options</small
                      >
                    </div>
                  </div>
                  <!-- Stats -->
                  <div class="row mt-5">
                    <div class="col-4 text-center">
                      <h3 class="fw-bold text-warning">1000+</h3>
                      <small class="opacity-75">Pokémon</small>
                    </div>
                    <div class="col-4 text-center">
                      <h3 class="fw-bold text-warning">500+</h3>
                      <small class="opacity-75">Users</small>
                    </div>
                    <div class="col-4 text-center">
                      <h3 class="fw-bold text-warning">24/7</h3>
                      <small class="opacity-75">Support</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title text-success">
              <i class="bi bi-check-circle-fill me-2"></i>
              Registration Successful!
            </h5>
          </div>
          <div class="modal-body">
            <div class="text-center">
              <div class="mb-3">
                <i
                  class="bi bi-person-check-fill text-success"
                  style="font-size: 3rem"
                ></i>
              </div>
              <h6 class="mb-3">Welcome to PokéDex Online!</h6>
              <p class="text-muted mb-3">
                Your account has been created successfully. You are now logged
                in and ready to explore.
              </p>
              <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Redirecting...</span>
              </div>
              <p class="mb-0 small text-muted">
                Redirecting you to your dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import RegisterForm from "@/components/RegisterForm.vue";

// Composables
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// State
const showSuccessModal = ref(false);

// Methods
async function handleRegistrationSuccess(data) {
  showSuccessModal.value = true;

  // Redirect after a short delay
  setTimeout(async () => {
    await router.push("/dashboard");
  }, 3000);
}

function handleRegistrationError(error) {
  console.error("Registration error:", error);
  // Error is already handled by the RegisterForm component
}

function handleSwitchToLogin() {
  router.push("/login");
}

function clearQueryParams() {
  router.replace({ query: {} });
}

// Lifecycle
onMounted(() => {
  // Initialize auth store
  authStore.initializeStore();

  // If user is already authenticated, redirect to dashboard
  if (authStore.isAuthenticated) {
    router.push("/dashboard");
  }
});
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.register-page .row {
  min-height: 100vh;
}

.bg-success {
  background: linear-gradient(135deg, var(--bs-success) 0%, #157347 100%);
  position: relative;
  overflow: hidden;
}

.bg-success::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="hexagons" width="28" height="49" patternUnits="userSpaceOnUse"><polygon points="14,1 26,7 26,21 14,27 2,21 2,7" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/><polygon points="14,28 26,34 26,48 14,54 2,48 2,34" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23hexagons)"/></svg>');
  pointer-events: none;
}

.bg-success > div {
  position: relative;
  z-index: 1;
}

.register-form-container {
  max-width: 600px;
  margin: 0 auto;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  animation: slideInRight 0.6s ease forwards;
  opacity: 0;
}

.benefit-item:nth-child(1) {
  animation-delay: 0.2s;
}

.benefit-item:nth-child(2) {
  animation-delay: 0.4s;
}

.benefit-item:nth-child(3) {
  animation-delay: 0.6s;
}

.benefit-item:nth-child(4) {
  animation-delay: 0.8s;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.alert {
  border: none;
  border-radius: 0.75rem;
}

.alert-warning {
  background-color: rgba(255, 193, 7, 0.1);
  color: #856404;
}

.alert-info {
  background-color: rgba(13, 202, 240, 0.1);
  color: #055160;
}

.modal.show {
  display: block;
}

.modal-content {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

.terms-content,
.privacy-content {
  max-height: 400px;
  overflow-y: auto;
}

.terms-content h6,
.privacy-content h6 {
  color: var(--bs-primary);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.terms-content h6:first-child,
.privacy-content h6:first-child {
  margin-top: 0;
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

/* Stats animation */
.row.mt-5 .col-4 {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.row.mt-5 .col-4:nth-child(1) {
  animation-delay: 1s;
}

.row.mt-5 .col-4:nth-child(2) {
  animation-delay: 1.2s;
}

.row.mt-5 .col-4:nth-child(3) {
  animation-delay: 1.4s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .register-page {
    background: linear-gradient(135deg, var(--bs-success) 0%, #157347 100%);
    color: white;
  }

  .register-form-container {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
    color: #212529;
    margin: 2rem 1rem;
  }
}

@media (max-width: 576px) {
  .register-form-container {
    margin: 1rem 0.5rem;
    padding: 2rem 1.5rem !important;
  }

  .display-5 {
    font-size: 1.75rem;
  }

  .row.text-start .col-md-6 {
    margin-bottom: 1rem;
  }
}

/* Focus states for accessibility */
.btn:focus,
.form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

/* Loading animation */
.spinner-border {
  animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}
</style>