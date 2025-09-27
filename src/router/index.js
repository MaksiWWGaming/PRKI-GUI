import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Import views
import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import AdminPage from "@/views/AdminPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: {
      title: "Home",
      requiresAuth: false,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: {
      title: "Login",
      requiresAuth: false,
      requiresGuest: true, // Redirect authenticated users away from login
    },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
    meta: {
      title: "Register",
      requiresAuth: false,
      requiresGuest: true, // Redirect authenticated users away from register
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
    meta: {
      title: "Dashboard",
      requiresAuth: true,
    },
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminPage,
    meta: {
      title: "Admin Panel",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top when changing routes
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Initialize auth store if not already done
  if (!authStore.user && !authStore.isLoading) {
    authStore.initializeStore();
  }

  // Set page title
  if (to.meta.title) {
    document.title = `Pokédex Online - ${to.meta.title}`;
  } else {
    document.title = "Pokédex Online - Oops!";
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirect to login page with return URL
      next({
        name: "Login",
        query: { redirect: to.fullPath },
      });
      return;
    }

    // Check if route requires admin role
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      // Redirect non-admin users to dashboard
      next({
        name: "Dashboard",
        query: { error: "Access denied: Admin role required" },
      });
      return;
    }
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Redirect authenticated users to dashboard
    next({ name: "Dashboard" });
    return;
  }

  // Allow navigation
  next();
});

export default router;