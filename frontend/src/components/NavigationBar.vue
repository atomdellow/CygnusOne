<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);

const handleLogout = () => {
  authStore.logout();
};
</script>

<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/">CygnusOne</router-link>
      </div>
      
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link to="/" class="navbar-item">Home</router-link>
          <router-link v-if="isLoggedIn" to="/articles" class="navbar-item">Articles</router-link>
        </div>
        
        <div class="navbar-end">
          <template v-if="isLoggedIn">
            <span class="navbar-item user-welcome">Welcome, {{ user?.name }}</span>
            <button @click="handleLogout" class="btn btn-logout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="navbar-item">Login</router-link>
            <router-link to="/register" class="btn">Register</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: var(--secondary-color);
  padding: 15px 0;
  color: white;
  margin-bottom: 30px;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-brand a {
  color: white;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  margin-left: 20px;
}

.navbar-start, .navbar-end {
  display: flex;
  align-items: center;
}

.navbar-item {
  margin: 0 10px;
  color: white;
  text-decoration: none;
}

.navbar-item:hover {
  color: var(--primary-color);
}

.user-welcome {
  margin-right: 15px;
}

.btn-logout {
  background-color: transparent;
  border: 1px solid white;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
