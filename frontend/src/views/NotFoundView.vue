<script setup>
import { useRouter } from 'vue-router';
import '../assets/styles/views/auth.css';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};

const goHome = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>404</h1>
      <p class="error-text">Page Not Found</p>
      <p class="message">Sorry, the page you are looking for doesn't exist or has been moved.</p>
      
      <div class="actions">
        <button @click="goBack" class="btn btn-secondary">Go Back</button>
        <button @click="goHome" class="btn">Go Home</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 5rem;
  color: var(--primary-color);
  margin-bottom: 0;
}

.error-text {
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin-bottom: 1.5rem;
}

.message {
  font-size: 1rem;
  color: var(--text-color-muted);
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

@media (max-width: 768px) {
  h1 {
    font-size: 3rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .actions .btn {
    width: 100%;
  }
}
</style>
