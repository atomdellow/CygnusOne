<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import NavigationBar from './components/NavigationBar.vue';

const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.token) {
    await authStore.fetchCurrentUser();
  }
});
</script>

<template>
  <div class="app">
    <NavigationBar />
    
    <main class="main-content">
      <router-view />
    </main>
    
    <footer class="site-footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} CygnusOne. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 60px; /* Space for footer */
}

.main-content {
  flex: 1;
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  padding: 0; /* Remove any padding */
  box-sizing: border-box;
}

.site-footer {
  background-color: #0a0e17; /* Solid background color */
  color: white;
  padding: 20px 0;
  text-align: center;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
