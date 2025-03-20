<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const loading = ref(false);

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return;
  }

  loading.value = true;
  error.value = '';

  const success = await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value
  });

  if (!success) {
    error.value = authStore.error || 'Registration failed. Please try again.';
  }

  loading.value = false;
};
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Register</h1>
      
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            class="form-control"
            v-model="name"
            placeholder="Enter your name"
            required
          />
        </div>
        
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
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            class="form-control"
            v-model="confirmPassword"
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <button type="submit" class="btn btn-block" :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
      
      <p class="login-link">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.register-card {
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

.login-link {
  text-align: center;
  margin-top: 20px;
}

.login-link a {
  color: var(--primary-color);
}
</style>
