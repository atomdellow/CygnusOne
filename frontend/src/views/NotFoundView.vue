<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};

const goHome = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p class="error-text">Page Not Found</p>
    <p class="message">Sorry, the page you are looking for doesn't exist or has been moved.</p>
    
    <div class="actions">
      <button @click="goBack" class="btn btn-secondary">Go Back</button>
      <button @click="goHome" class="btn">Go Home</button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 60px 20px;
}

h1 {
  font-size: 6rem;
  color: var(--secondary-color);
  margin-bottom: 0;
}

.error-text {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.message {
  font-size: 1.2rem;
  color: #777;
  margin-bottom: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
