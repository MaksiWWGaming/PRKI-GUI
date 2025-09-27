<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <!-- Navigation Bar -->
    <NavBar />

    <!-- Main Content -->
    <main class="flex-grow-1">
      <router-view />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";

// Composables
const authStore = useAuthStore();

// Lifecycle
onMounted(() => {
  // Initialize stores on app startup
  authStore.initializeStore();
});
</script>

<style>
/* Import Bootstrap CSS */
@import "bootstrap/dist/css/bootstrap.min.css";
@import "bootstrap-icons/font/bootstrap-icons.css";

/* Global Styles */
:root {
  --bs-primary: #0d6efd;
  --bs-primary-rgb: 13, 110, 253;
  --bs-secondary: #6c757d;
  --bs-success: #198754;
  --bs-info: #0dcaf0;
  --bs-warning: #ffc107;
  --bs-danger: #dc3545;
  --bs-light: #f8f9fa;
  --bs-dark: #212529;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
  color: #212529;
  background-color: #ffffff;
}

#app {
  min-height: 100vh;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Focus styles for accessibility */
.btn:focus,
.form-control:focus,
.form-select:focus,
.form-check-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

/* Custom button styles */
.btn {
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

/* Card styles */
.card {
  border-radius: 0.75rem;
  transition: box-shadow 0.15s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

/* Form styles */
.form-control,
.form-select {
  border-radius: 0.5rem;
  border: 1px solid #ced4da;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

/* Badge styles */
.badge {
  border-radius: 0.375rem;
  font-weight: 500;
}

/* Alert styles */
.alert {
  border-radius: 0.75rem;
  border: none;
}

/* Modal styles */
.modal-content {
  border-radius: 1rem;
  border: none;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

.modal-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 1rem 1rem 0 0;
}

.modal-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0 0 1rem 1rem;
}

/* Table styles */
.table {
  border-radius: 0.5rem;
  overflow: hidden;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

/* Navigation styles */
.navbar {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* Footer styles */
footer {
  margin-top: auto;
}

/* Utility classes */
.text-decoration-none:hover {
  text-decoration: underline !important;
}

.cursor-pointer {
  cursor: pointer;
}

.user-select-none {
  user-select: none;
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

/* Loading spinner */
.spinner-border {
  animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive utilities */
@media (max-width: 576px) {
  .container-fluid {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .card-body {
    padding: 1rem;
  }

  .btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  .display-1 {
    font-size: 3rem;
  }

  .display-4 {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .modal-dialog {
    margin: 1rem;
  }

  .table-responsive {
    font-size: 0.875rem;
  }
}

/* Print styles */
@media print {
  .navbar,
  .footer,
  .btn,
  .modal {
    display: none !important;
  }

  .card {
    border: 1px solid #dee2e6 !important;
    box-shadow: none !important;
  }

  .text-primary,
  .text-success,
  .text-info,
  .text-warning,
  .text-danger {
    color: #212529 !important;
  }
}

/* Dark mode support (for future implementation) */
@media (prefers-color-scheme: dark) {
  /* Dark mode styles would go here */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .btn {
    border-width: 2px;
  }

  .card {
    border-width: 2px;
  }

  .form-control,
  .form-select {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>