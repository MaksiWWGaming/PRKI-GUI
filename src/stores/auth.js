import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref(null);
  const users = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Default admin user
  const defaultAdmin = {
    id: 1,
    username: "admin",
    password: "Admin123!",
    role: "admin",
    email: "admin@example.com",
    createdAt: new Date().toISOString(),
  };

  // Regex patterns for validation
  const validationPatterns = {
    username: /^[a-zA-Z0-9]{4,}$/, // letters/numbers, min 4 chars
    password:
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, // min 8 chars, 1 uppercase, 1 number, 1 special char
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  };

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const userRole = computed(() => user.value?.role || null);
  const isAdmin = computed(() => user.value?.role === "admin");

  // Initialize store
  function initializeStore() {
    // Load users from localStorage or set default admin
    const storedUsers = localStorage.getItem("vue_app_users");
    if (storedUsers) {
      users.value = JSON.parse(storedUsers);
    } else {
      users.value = [defaultAdmin];
      localStorage.setItem("vue_app_users", JSON.stringify(users.value));
    }

    // Load current user from localStorage
    const storedUser = localStorage.getItem("vue_app_current_user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
  }

  // Validation functions
  function validateUsername(username) {
    if (!username) return "Username is required";
    if (!validationPatterns.username.test(username)) {
      return "Username must be at least 4 characters long and contain only letters and numbers";
    }
    return null;
  }

  function validatePassword(password) {
    if (!password) return "Password is required";
    if (!validationPatterns.password.test(password)) {
      return "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 number, and 1 special character";
    }
    return null;
  }

  function validateEmail(email) {
    if (!email) return "Email is required";
    if (!validationPatterns.email.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  }

  // Check if username already exists
  function isUsernameExists(username, excludeId = null) {
    return users.value.some(
      (u) => u.username === username && u.id !== excludeId
    );
  }

  // Check if email already exists
  function isEmailExists(email, excludeId = null) {
    return users.value.some((u) => u.email === email && u.id !== excludeId);
  }

  // Login function
  async function login(credentials) {
    isLoading.value = true;
    error.value = null;

    try {
      const { username, password } = credentials;

      // Validate input
      const usernameError = validateUsername(username);
      const passwordError = validatePassword(password);

      if (usernameError || passwordError) {
        throw new Error(usernameError || passwordError);
      }

      // Find user
      const foundUser = users.value.find(
        (u) => u.username === username && u.password === password
      );

      if (!foundUser) {
        throw new Error("Invalid username or password");
      }

      // Set current user
      user.value = { ...foundUser };
      delete user.value.password; // Don't store password in current user

      // Save to localStorage
      localStorage.setItem("vue_app_current_user", JSON.stringify(user.value));

      return { success: true, message: "Login successful" };
    } catch (err) {
      error.value = err.message;
      return { success: false, message: err.message };
    } finally {
      isLoading.value = false;
    }
  }

  // Register function
  async function register(userData) {
    isLoading.value = true;
    error.value = null;

    try {
      const { username, password, email, role = "user" } = userData;

      // Validate input
      const usernameError = validateUsername(username);
      const passwordError = validatePassword(password);
      const emailError = validateEmail(email);

      if (usernameError) throw new Error(usernameError);
      if (passwordError) throw new Error(passwordError);
      if (emailError) throw new Error(emailError);

      // Check if username already exists
      if (isUsernameExists(username)) {
        throw new Error("Username already exists");
      }

      // Check if email already exists
      if (isEmailExists(email)) {
        throw new Error("Email already exists");
      }

      // Create new user
      const newUser = {
        id: Date.now(), // Simple ID generation
        username,
        password,
        email,
        role,
        createdAt: new Date().toISOString(),
      };

      // Add to users array
      users.value.push(newUser);

      // Save to localStorage
      localStorage.setItem("vue_app_users", JSON.stringify(users.value));

      // Auto-login the new user
      user.value = { ...newUser };
      delete user.value.password;

      localStorage.setItem("vue_app_current_user", JSON.stringify(user.value));

      return { success: true, message: "Registration successful" };
    } catch (err) {
      error.value = err.message;
      return { success: false, message: err.message };
    } finally {
      isLoading.value = false;
    }
  }

  // Logout function
  function logout() {
    user.value = null;
    localStorage.removeItem("vue_app_current_user");
    error.value = null;
  }

  // Clear error
  function clearError() {
    error.value = null;
  }

  // Get all users (admin only)
  function getAllUsers() {
    if (!isAdmin.value) {
      throw new Error("Access denied: Admin role required");
    }
    return users.value.map((u) => ({ ...u, password: undefined })); // Don't expose passwords
  }

  // Update user (admin only)
  async function updateUser(userId, updates) {
    if (!isAdmin.value) {
      throw new Error("Access denied: Admin role required");
    }

    const userIndex = users.value.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    // Validate updates if provided
    if (
      updates.username &&
      updates.username !== users.value[userIndex].username
    ) {
      const usernameError = validateUsername(updates.username);
      if (usernameError) throw new Error(usernameError);
      if (isUsernameExists(updates.username, userId)) {
        throw new Error("Username already exists");
      }
    }

    if (updates.email && updates.email !== users.value[userIndex].email) {
      const emailError = validateEmail(updates.email);
      if (emailError) throw new Error(emailError);
      if (isEmailExists(updates.email, userId)) {
        throw new Error("Email already exists");
      }
    }

    if (updates.password) {
      const passwordError = validatePassword(updates.password);
      if (passwordError) throw new Error(passwordError);
    }

    // Update user
    users.value[userIndex] = { ...users.value[userIndex], ...updates };
    localStorage.setItem("vue_app_users", JSON.stringify(users.value));

    return { success: true, message: "User updated successfully" };
  }

  // Delete user (admin only)
  async function deleteUser(userId) {
    if (!isAdmin.value) {
      throw new Error("Access denied: Admin role required");
    }

    if (userId === user.value?.id) {
      throw new Error("Cannot delete your own account");
    }

    const userIndex = users.value.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    users.value.splice(userIndex, 1);
    localStorage.setItem("vue_app_users", JSON.stringify(users.value));

    return { success: true, message: "User deleted successfully" };
  }

  return {
    // State
    user,
    users,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    userRole,
    isAdmin,

    // Actions
    initializeStore,
    login,
    register,
    logout,
    clearError,
    getAllUsers,
    updateUser,
    deleteUser,

    // Validation
    validateUsername,
    validatePassword,
    validateEmail,
  };
});
