<template>
  <div class="register-form">
    <form @submit.prevent="handleSubmit" novalidate>
      <!-- Username Field -->
      <div class="mb-3">
        <label for="username" class="form-label">
          <i class="bi bi-person me-2"></i>
          Username *
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
          placeholder="Choose a username"
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

      <!-- Email Field -->
      <div class="mb-3">
        <label for="email" class="form-label">
          <i class="bi bi-envelope me-2"></i>
          Email Address *
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-control"
          :class="{
            'is-invalid': errors.email,
            'is-valid': formData.email && !errors.email && touched.email,
          }"
          placeholder="Enter your email address"
          :disabled="isLoading"
          @blur="validateField('email')"
          @input="clearFieldError('email')"
          autocomplete="email"
          required
        />
        <div v-if="errors.email" class="invalid-feedback">
          <i class="bi bi-exclamation-circle me-1"></i>
          {{ errors.email }}
        </div>
        <div v-else class="form-text">Please enter a valid email address.</div>
      </div>

      <!-- Password Field -->
      <div class="mb-3">
        <label for="password" class="form-label">
          <i class="bi bi-lock me-2"></i>
          Password *
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
            placeholder="Create a strong password"
            :disabled="isLoading"
            @blur="validateField('password')"
            @input="clearFieldError('password')"
            autocomplete="new-password"
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

        <!-- Password Strength Indicator -->
        <div v-if="formData.password" class="password-strength mt-2">
          <div class="progress" style="height: 4px">
            <div
              class="progress-bar"
              :class="passwordStrengthClass"
              :style="{ width: passwordStrengthPercentage + '%' }"
            ></div>
          </div>
          <small class="text-muted">
            Password strength:
            <span :class="passwordStrengthTextClass">{{
              passwordStrengthText
            }}</span>
          </small>
        </div>
      </div>

      <!-- Confirm Password Field -->
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">
          <i class="bi bi-lock-fill me-2"></i>
          Confirm Password *
        </label>
        <div class="input-group">
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="form-control"
            :class="{
              'is-invalid': errors.confirmPassword,
              'is-valid':
                formData.confirmPassword &&
                !errors.confirmPassword &&
                touched.confirmPassword,
            }"
            placeholder="Confirm your password"
            :disabled="isLoading"
            @blur="validateField('confirmPassword')"
            @input="clearFieldError('confirmPassword')"
            autocomplete="new-password"
            required
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="toggleConfirmPasswordVisibility"
            :disabled="isLoading"
            :title="showConfirmPassword ? 'Hide password' : 'Show password'"
          >
            <i
              :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
            ></i>
          </button>
        </div>
        <div v-if="errors.confirmPassword" class="invalid-feedback d-block">
          <i class="bi bi-exclamation-circle me-1"></i>
          {{ errors.confirmPassword }}
        </div>
        <div v-else class="form-text">Please confirm your password.</div>
      </div>

      <!-- Role Selection (Optional) -->
      <div v-if="showRoleSelection" class="mb-3">
        <label for="role" class="form-label">
          <i class="bi bi-person-badge me-2"></i>
          Account Type
        </label>
        <select
          id="role"
          v-model="formData.role"
          class="form-select"
          :disabled="isLoading"
        >
          <option value="user">Regular User</option>
          <option value="admin">Administrator</option>
        </select>
        <div class="form-text">
          Choose your account type. Admin accounts have additional privileges.
        </div>
      </div>

      <!-- Terms and Conditions -->
      <div class="mb-3 form-check">
        <input
          id="acceptTerms"
          v-model="formData.acceptTerms"
          type="checkbox"
          class="form-check-input"
          :class="{ 'is-invalid': errors.acceptTerms }"
          :disabled="isLoading"
          @change="validateField('acceptTerms')"
          required
        />
        <label for="acceptTerms" class="form-check-label">
          I agree to the
          <a
            href="#"
            class="text-decoration-none"
            @click.prevent="$emit('show-terms')"
          >
            Terms and Conditions
          </a>
          and
          <a
            href="#"
            class="text-decoration-none"
            @click.prevent="$emit('show-privacy')"
          >
            Privacy Policy
          </a>
          *
        </label>
        <div v-if="errors.acceptTerms" class="invalid-feedback d-block">
          <i class="bi bi-exclamation-circle me-1"></i>
          {{ errors.acceptTerms }}
        </div>
      </div>

      <!-- Newsletter Subscription -->
      <div class="mb-3 form-check">
        <input
          id="subscribeNewsletter"
          v-model="formData.subscribeNewsletter"
          type="checkbox"
          class="form-check-input"
          :disabled="isLoading"
        />
        <label for="subscribeNewsletter" class="form-check-label">
          Subscribe to our newsletter for updates and news
        </label>
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
          <i v-else class="bi bi-person-plus me-2"></i>
          {{ isLoading ? "Creating Account..." : "Create Account" }}
        </button>
      </div>

      <!-- Additional Actions -->
      <div class="text-center mt-3">
        <p class="mb-0">
          Already have an account?
          <a
            href="#"
            class="text-decoration-none fw-medium"
            @click.prevent="$emit('switch-to-login')"
          >
            Sign in here
          </a>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useAuthStore } from "@/stores/auth";

// Props
const props = defineProps({
  showRoleSelection: {
    type: Boolean,
    default: false,
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
  "switch-to-login",
  "show-terms",
  "show-privacy",
]);

// Composables
const authStore = useAuthStore();

// State
const formData = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "user",
  acceptTerms: false,
  subscribeNewsletter: false,
});

const errors = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: "",
});

const touched = ref({
  username: false,
  email: false,
  password: false,
  confirmPassword: false,
  acceptTerms: false,
});

const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const generalError = ref("");
const successMessage = ref("");

// Computed
const isFormValid = computed(() => {
  return (
    formData.value.username &&
    formData.value.email &&
    formData.value.password &&
    formData.value.confirmPassword &&
    formData.value.acceptTerms &&
    !errors.value.username &&
    !errors.value.email &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    !errors.value.acceptTerms
  );
});

const passwordStrength = computed(() => {
  const password = formData.value.password;
  if (!password) return 0;

  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

  return score;
});

const passwordStrengthPercentage = computed(() => {
  return (passwordStrength.value / 6) * 100;
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 2) return "Weak";
  if (strength <= 4) return "Medium";
  return "Strong";
});

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 2) return "bg-danger";
  if (strength <= 4) return "bg-warning";
  return "bg-success";
});

const passwordStrengthTextClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 2) return "text-danger";
  if (strength <= 4) return "text-warning";
  return "text-success";
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
    case "email":
      errors.value.email = authStore.validateEmail(formData.value.email);
      break;
    case "password":
      errors.value.password = authStore.validatePassword(
        formData.value.password
      );
      // Re-validate confirm password if it's been touched
      if (touched.value.confirmPassword) {
        validateField("confirmPassword");
      }
      break;
    case "confirmPassword":
      if (!formData.value.confirmPassword) {
        errors.value.confirmPassword = "Please confirm your password";
      } else if (formData.value.password !== formData.value.confirmPassword) {
        errors.value.confirmPassword = "Passwords do not match";
      } else {
        errors.value.confirmPassword = "";
      }
      break;
    case "acceptTerms":
      errors.value.acceptTerms = formData.value.acceptTerms
        ? ""
        : "You must accept the terms and conditions";
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
  validateField("email");
  validateField("password");
  validateField("confirmPassword");
  validateField("acceptTerms");

  return (
    !errors.value.username &&
    !errors.value.email &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    !errors.value.acceptTerms
  );
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

function toggleConfirmPasswordVisibility() {
  showConfirmPassword.value = !showConfirmPassword.value;
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

    const result = await authStore.register({
      username: formData.value.username,
      email: formData.value.email,
      password: formData.value.password,
      role: formData.value.role,
    });

    if (result.success) {
      successMessage.value = result.message;
      emit("success", {
        user: authStore.user,
        subscribeNewsletter: formData.value.subscribeNewsletter,
      });

      // Clear form after successful registration
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
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    acceptTerms: false,
    subscribeNewsletter: false,
  };

  errors.value = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: "",
  };

  touched.value = {
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    acceptTerms: false,
  };

  generalError.value = "";
  successMessage.value = "";
  showPassword.value = false;
  showConfirmPassword.value = false;
}

// Expose methods to parent
defineExpose({
  resetForm,
  validateForm,
});
</script>

<style scoped>
.register-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

.form-control.is-valid,
.form-select.is-valid {
  border-color: var(--bs-success);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='m2.3 6.73.94-.94 1.38 1.38L7.7 4.08 6.76 3.14 4.62 5.28z'/%3e%3c/svg%3e");
}

.form-control.is-invalid,
.form-select.is-invalid {
  border-color: var(--bs-danger);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath d='m5.8 4.6 1.4 1.4M7.2 4.6l-1.4 1.4'/%3e%3c/svg%3e");
}

.form-check-input.is-invalid {
  border-color: var(--bs-danger);
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

.password-strength .progress {
  border-radius: 2px;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Animation for form validation */
.form-control,
.form-select {
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.invalid-feedback,
.form-text {
  font-size: 0.875rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .register-form {
    max-width: 100%;
    padding: 0 1rem;
  }
}
</style>