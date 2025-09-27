<template>
  <div class="login-form">
    <form @submit.prevent="handleSubmit" novalidate>
      <!-- Username Field -->
      <div class="mb-3">
        <label for="username" class="form-label">
          <i class="bi bi-person me-2"></i>
          Username
        </label>
        <input
          id="username"
          v-model="formData.username"
          type="text"
          class="form-control"
          :class="{
            'is-invalid': errors.username,
            'is-valid':
              formData.username && !errors.username && touched.username,
          }"
          placeholder="Enter your username"
          :disabled="isLoading"
          @blur="validateField('username')"
          @input="clearFieldError('username')"
          autocomplete="username"
          required
        />
        <div v-if="errors.username" class="invalid-feedback">
          <i class="bi bi-exclamation-circle me-1"></i>
          {{ errors.username }}
        </div>
        <div v-else class="form-text">
          Username must be at least 4 characters long and contain only letters
          and numbers.
        </div>
      </div>

      <!-- Password Field -->
      <div class="mb-3">
        <label for="password" class="form-label">
          <i class="bi bi-lock me-2"></i>
          Password
        </label>
        <div class="input-group">
          <input
            id="password"
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            :class="{
              'is-invalid': errors.password,
              'is-valid':
                formData.password && !errors.password && touched.password,
            }"
            placeholder="Enter your password"
            :disabled="isLoading"
            @blur="validateField('password')"
            @input="clearFieldError('password')"
            autocomplete="current-password"
            required
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="togglePasswordVisibility"
            :disabled="isLoading"
            :title="showPassword ? 'Hide password' : 'Show password'"
          >
            <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </button>
        </div>
        <div v-if="errors.password" class="invalid-feedback d-block">
          <i class="bi bi-exclamation-circle me-1"></i>
          {{ errors.password }}
        </div>
        <div v-else class="form-text">
          Password must be at least 8 characters with 1 uppercase, 1 number, and
          1 special character.
        </div>
      </div>

      <!-- Remember Me -->
      <div class="mb-3 form-check">
        <input
          id="rememberMe"
          v-model="formData.rememberMe"
          type="checkbox"
          class="form-check-input"
          :disabled="isLoading"
        />
        <label for="rememberMe" class="form-check-label"> Remember me </label>
      </div>

      <!-- Error Message -->
      <div v-if="generalError" class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle me-2"></i>
        {{ generalError }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="alert alert-success" role="alert">
        <i class="bi bi-check-circle me-2"></i>
        {{ successMessage }}
      </div>

      <!-- Submit Button -->
      <div class="d-grid gap-2">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isLoading || !isFormValid"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </span>
          <i v-else class="bi bi-box-arrow-in-right me-2"></i>
          {{ isLoading ? "Signing in..." : "Sign In" }}
        </button>
      </div>

      <!-- Additional Actions -->
      <div class="text-center mt-3">
        <p class="mb-2">
          <a
            href="#"
            class="text-decoration-none"
            @click.prevent="$emit('forgot-password')"
          >
            Forgot your password?
          </a>
        </p>
        <p class="mb-0">
          Don't have an account?
          <a
            href="#"
            class="text-decoration-none fw-medium"
            @click.prevent="$emit('switch-to-register')"
          >
            Sign up here
          </a>
        </p>
      </div>

      <!-- Demo Credentials -->
      <div v-if="showDemoCredentials" class="mt-4 p-3 bg-light rounded">
        <h6 class="mb-2">
          <i class="bi bi-info-circle me-2"></i>
          Demo Credentials
        </h6>
        <div class="row">
          <div class="col-12">
            <small class="text-muted d-block mb-1">Admin Account:</small>
            <code class="d-block mb-2"
              >Username: admin | Password: Admin123!</code
            >
            <button
              type="button"
              class="btn btn-sm btn-outline-primary"
              @click="fillDemoCredentials"
              :disabled="isLoading"
            >
              Use Demo Credentials
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useAuthStore } from "@/stores/auth";

// Props
const props = defineProps({
  showDemoCredentials: {
    type: Boolean,
    default: true,
  },
  autoFocus: {
    type: Boolean,
    default: true,
  },
});

// Emits
const emit = defineEmits([
  "submit",
  "success",
  "error",
  "forgot-password",
  "switch-to-register",
]);

// Composables
const authStore = useAuthStore();

// State
const formData = ref({
  username: "",
  password: "",
  rememberMe: false,
});

const errors = ref({
  username: "",
  password: "",
});

const touched = ref({
  username: false,
  password: false,
});

const isLoading = ref(false);
const showPassword = ref(false);
const generalError = ref("");
const successMessage = ref("");

// Computed
const isFormValid = computed(() => {
  return (
    formData.value.username &&
    formData.value.password &&
    !errors.value.username &&
    !errors.value.password
  );
});

// Watchers
watch(
  () => authStore.error,
  (newError) => {
    if (newError) {
      generalError.value = newError;
      authStore.clearError();
    }
  }
);

// Methods
function validateField(fieldName) {
  touched.value[fieldName] = true;

  switch (fieldName) {
    case "username":
      errors.value.username = authStore.validateUsername(
        formData.value.username
      );
      break;
    case "password":
      errors.value.password = authStore.validatePassword(
        formData.value.password
      );
      break;
  }
}

function clearFieldError(fieldName) {
  if (errors.value[fieldName]) {
    errors.value[fieldName] = "";
  }
  if (generalError.value) {
    generalError.value = "";
  }
}

function validateForm() {
  validateField("username");
  validateField("password");

  return !errors.value.username && !errors.value.password;
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

function fillDemoCredentials() {
  formData.value.username = "admin";
  formData.value.password = "Admin123!";

  // Clear any existing errors
  errors.value.username = "";
  errors.value.password = "";
  generalError.value = "";
}

async function handleSubmit() {
  if (isLoading.value) return;

  // Clear previous messages
  generalError.value = "";
  successMessage.value = "";

  // Validate form
  if (!validateForm()) {
    return;
  }

  try {
    isLoading.value = true;

    const result = await authStore.login({
      username: formData.value.username,
      password: formData.value.password,
    });

    if (result.success) {
      successMessage.value = result.message;
      emit("success", {
        user: authStore.user,
        rememberMe: formData.value.rememberMe,
      });

      // Clear form after successful login
      setTimeout(() => {
        resetForm();
      }, 1000);
    } else {
      generalError.value = result.message;
      emit("error", result.message);
    }
  } catch (error) {
    const errorMessage = error.message || "An unexpected error occurred";
    generalError.value = errorMessage;
    emit("error", errorMessage);
  } finally {
    isLoading.value = false;
  }
}

function resetForm() {
  formData.value = {
    username: "",
    password: "",
    rememberMe: false,
  };

  errors.value = {
    username: "",
    password: "",
  };

  touched.value = {
    username: false,
    password: false,
  };

  generalError.value = "";
  successMessage.value = "";
  showPassword.value = false;
}

// Expose methods to parent
defineExpose({
  resetForm,
  fillDemoCredentials,
  validateForm,
});
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-control:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

.form-control.is-valid {
  border-color: var(--bs-success);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='m2.3 6.73.94-.94 1.38 1.38L7.7 4.08 6.76 3.14 4.62 5.28z'/%3e%3c/svg%3e");
}

.form-control.is-invalid {
  border-color: var(--bs-danger);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath d='m5.8 4.6 1.4 1.4M7.2 4.6l-1.4 1.4'/%3e%3c/svg%3e");
}

.input-group .btn-outline-secondary {
  border-color: var(--bs-border-color);
}

.input-group .btn-outline-secondary:hover {
  background-color: var(--bs-secondary);
  border-color: var(--bs-secondary);
  color: white;
}

.form-check-input:checked {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

.btn-primary:disabled {
  opacity: 0.65;
}

.alert {
  border: none;
  border-radius: 0.5rem;
}

.alert-danger {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.alert-success {
  background-color: rgba(25, 135, 84, 0.1);
  color: #198754;
}

code {
  background-color: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Animation for form validation */
.form-control {
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.invalid-feedback,
.form-text {
  font-size: 0.875rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .login-form {
    max-width: 100%;
    padding: 0 1rem;
  }
}
</style>