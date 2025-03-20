<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password';
    return;
  }

  loading.value = true;
  error.value = '';

  const success = await authStore.login({
    email: email.value,
    password: password.value
  });

  if (!success) {
    error.value = authStore.error || 'Login failed. Please try again.';
  }

  loading.value = false;
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>
      
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            class="form-control"
            v-model="email"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            class="form-control"
            v-model="password"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button type="submit" class="btn btn-block" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      
      <p class="register-link">
        Don't have an account?
        <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background: white;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: var(--secondary-color);
}

.btn-block {
  width: 100%;
  margin-top: 20px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}

.register-link a {
  color: var(--primary-color);
}
</style>
