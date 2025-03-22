<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import '../assets/styles/components/navigation.css';
import ThemeToggle from '@/components/ThemeToggle.vue';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => {
  const hasAdmin = authStore.isAdmin;
  console.log("Nav bar - is admin?", hasAdmin, "User:", authStore.user);
  return hasAdmin;
});
const user = computed(() => authStore.user);
const mobileMenuOpen = ref(false);

const handleLogout = () => {
  authStore.logout();
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};
</script>

<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/" @click="closeMobileMenu">CygnusOne</router-link>
      </div>
      
      <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Toggle navigation menu">
        <span v-if="!mobileMenuOpen">☰</span>
        <span v-else>✕</span>
      </button>
      
      <div class="navbar-menu" :class="{ 'open': mobileMenuOpen }">
        <div class="navbar-start">
          <router-link to="/" class="navbar-item" @click="closeMobileMenu">Home</router-link>
          <router-link v-if="isLoggedIn" to="/articles" class="navbar-item" @click="closeMobileMenu">Articles</router-link>
          <router-link v-if="isLoggedIn" to="/software" class="navbar-item" @click="closeMobileMenu">Software</router-link>
          <router-link v-if="isLoggedIn" to="/autobots" class="navbar-item" @click="closeMobileMenu">Autobots</router-link>
          <router-link v-if="isLoggedIn" to="/pantheon" class="navbar-item" @click="closeMobileMenu">Pantheon</router-link>
          <router-link v-if="isAdmin" to="/admin/users" class="navbar-item" @click="closeMobileMenu">Admin</router-link>
        </div>
        
        <div class="navbar-end">
          <div class="navbar-item">
            <ThemeToggle />
          </div>
          <template v-if="isLoggedIn">
            <div class="navbar-actions">
              <router-link to="/articles/create" class="btn" @click="closeMobileMenu">Create Article</router-link>
            </div>
            <span v-if="user" class="navbar-item user-welcome">
              Welcome, {{ user.name }}
              <span v-if="user.role" class="user-role">{{ user.role }}</span>
            </span>
            <button @click="handleLogout" class="btn btn-logout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="navbar-item" @click="closeMobileMenu">Login</router-link>
            <router-link to="/register" class="btn" @click="closeMobileMenu">Register</router-link>
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

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
}

.navbar-menu {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  margin-left: 20px;
}

.navbar-menu.open {
  display: block;
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

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }

  .navbar-menu {
    display: none;
    flex-direction: column;
    width: 100%;
  }

  .navbar-menu.open {
    display: flex;
  }

  .navbar-start, .navbar-end {
    flex-direction: column;
    align-items: flex-start;
  }

  .navbar-item {
    margin: 10px 0;
  }
}

.user-role {
  font-size: 0.8rem;
  opacity: 0.7;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: var(--border-radius);
  margin-left: 0.5rem;
  text-transform: capitalize;
}
</style>
