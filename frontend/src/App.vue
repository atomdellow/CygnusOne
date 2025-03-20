<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import NavigationBar from './components/NavigationBar.vue';
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'

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
    
    <div class="container">
      <header>
        <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

        <div class="wrapper">
          <HelloWorld msg="You did it!" />
        </div>
      </header>

      <main>
        <TheWelcome />
        <router-view />
      </main>
    </div>
    
    <footer>
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} CygnusOne. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

footer {
  margin-top: auto;
  background-color: var(--dark-bg);
  color: white;
  padding: 20px 0;
  text-align: center;
  margin-top: 50px;
}
</style>
