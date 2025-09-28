<template>
  <div class="login-page">
    <div class="container-fluid h-100">
      <div class="row h-100">
        <!-- Left Side - Branding -->
        <div class="col-lg-6 d-none d-lg-flex bg-primary text-white">
          <div
            class="d-flex flex-column justify-content-center align-items-center w-100 p-5"
          >
            <div class="text-center">
              <i
                class="bi bi-lightning-charge-fill display-1 text-warning mb-4"
              ></i>
              <h1 class="display-4 fw-bold mb-4">Welcome Back!</h1>
              <p class="lead mb-4">
                Sign in to access your dashboard, manage your profile, and
                explore all the features our Vue application has to offer.
              </p>

              <!-- Features List -->
              <div class="row text-start mt-5">
                <div class="col-12">
                  <div class="d-flex align-items-center mb-3">
                    <i
                      class="bi bi-check-circle-fill text-warning me-3 fs-4"
                    ></i>
                    <div>
                      <h6 class="mb-1">Secure Authentication</h6>
                      <small class="opacity-75"
                        >Your data is protected with industry-standard
                        security</small
                      >
                    </div>
                  </div>
                  <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-speedometer2 text-warning me-3 fs-4"></i>
                    <div>
                      <h6 class="mb-1">Personal Dashboard</h6>
                      <small class="opacity-75"
                        >Access your personalized dashboard and settings</small
                      >
                    </div>
                  </div>
                  <div class="d-flex align-items-center mb-3">
                    <i class="bi bi-collection text-warning me-3 fs-4"></i>
                    <div>
                      <h6 class="mb-1">Pokémon Collection</h6>
                      <small class="opacity-75"
                        >Explore and discover amazing Pokémon data</small
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="col-lg-6 d-flex align-items-center justify-content-center">
          <div class="login-form-container w-100 p-4">
            <!-- Mobile Header -->
            <div class="d-lg-none text-center mb-4">
              <i class="bi bi-lightning-charge-fill fs-1 text-primary"></i>
              <h2 class="mt-2">Sign In</h2>
              <p class="text-muted">Welcome back to Vue App</p>
            </div>

            <!-- Desktop Header -->
            <div class="d-none d-lg-block text-center mb-4">
              <h2 class="fw-bold text-dark mb-2">Sign In</h2>
              <p class="text-muted">
                Enter your credentials to access your account
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

            <!-- Login Form -->
            <LoginForm
              :show-demo-credentials="true"
              @success="handleLoginSuccess"
              @error="handleLoginError"
              @forgot-password="handleForgotPassword"
              @switch-to-register="handleSwitchToRegister"
            />

            <!-- Additional Links -->
            <div class="text-center mt-4">
              <div class="row">
                <div class="col-12">
                  <hr class="my-4" />
                  <p class="text-muted small mb-3">
                    By signing in, you agree to our
                    <a href="#" class="text-decoration-none"
                      >Terms of Service</a
                    >
                    and
                    <a href="#" class="text-decoration-none">Privacy Policy</a>
                  </p>
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
              Login Successful!
            </h5>
          </div>
          <div class="modal-body">
            <div class="text-center">
              <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Redirecting...</span>
              </div>
              <p class="mb-0">
                Welcome back! Redirecting you to your dashboard...
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
import LoginForm from "@/components/LoginForm.vue";

// Composables
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// State
const showSuccessModal = ref(false);

// Methods
async function handleLoginSuccess(data) {
  showSuccessModal.value = true;

  // Redirect after a short delay
  setTimeout(async () => {
    const redirectPath = route.query.redirect || "/dashboard";
    await router.push(redirectPath);
  }, 2000);
}

function handleLoginError(error) {
  console.error("Login error:", error);
  // Error is already handled by the LoginForm component
}

function handleForgotPassword() {
  // In a real app, this would navigate to a forgot password page
  alert(
    "Forgot password functionality would be implemented here. For demo purposes, use the admin credentials provided."
  );
}

function handleSwitchToRegister() {
  router.push("/register");
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
.login-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.login-page .row {
  min-height: 100vh;
}

.bg-primary {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #0056b3 100%);
  position: relative;
  overflow: hidden;
}

.bg-primary::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
  pointer-events: none;
}

.bg-primary > div {
  position: relative;
  z-index: 1;
}

.login-form-container {
  max-width: 500px;
  margin: 0 auto;
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

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

/* Animation for features list */
.d-flex.align-items-center {
  animation: slideInLeft 0.6s ease forwards;
  opacity: 0;
}

.d-flex.align-items-center:nth-child(1) {
  animation-delay: 0.2s;
}

.d-flex.align-items-center:nth-child(2) {
  animation-delay: 0.4s;
}

.d-flex.align-items-center:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .login-page {
    background: linear-gradient(135deg, var(--bs-primary) 0%, #0056b3 100%);
    color: white;
  }

  .login-form-container {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
    color: #212529;
    margin: 2rem 1rem;
  }
}

@media (max-width: 576px) {
  .login-form-container {
    margin: 1rem 0.5rem;
    padding: 2rem 1.5rem !important;
  }

  .display-4 {
    font-size: 2rem;
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