<script setup>
import { useAuthStore } from '../stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isAuthenticated);
</script>

<template>
  <div class="home">
    <div class="hero">
      <h1>Welcome to CygnusOne</h1>
      <p class="subtitle">Innovative solutions for modern business challenges</p>
      
      <div class="cta-buttons" v-if="!isLoggedIn">
        <router-link to="/register" class="btn btn-primary">Get Started</router-link>
        <router-link to="/login" class="btn btn-secondary">Login</router-link>
      </div>
      <div v-else>
        <router-link to="/articles" class="btn btn-primary">View Articles</router-link>
      </div>
    </div>
    
    <section class="features">
      <h2>Our Technology Stack</h2>
      
      <div class="feature-grid">
        <div class="feature-card">
          <h3>Frontend</h3>
          <p>Built with Vue.js 3, making use of the latest features like Composition API, Pinia for state management, and Vue Router.</p>
        </div>
        
        <div class="feature-card">
          <h3>Backend</h3>
          <p>Powered by Node.js and Express, following the MVC architecture. MongoDB and Mongoose handle our data layer.</p>
        </div>
        
        <div class="feature-card">
          <h3>Authentication</h3>
          <p>Secure JWT-based authentication system with proper password hashing and token validation.</p>
        </div>
      </div>
    </section>
    
    <section class="mission">
      <h2>Our Mission</h2>
      <p>At CygnusOne, we focus on creating business-to-business solutions that enhance efficiency and streamline operations. Our core offerings include:</p>
      
      <ul>
        <li><strong>AI Assisted Planning Tools:</strong> Harness the power of artificial intelligence to optimize your business planning processes.</li>
        <li><strong>Asset Management Solutions:</strong> Keep track of your company's resources with our comprehensive asset management platform.</li>
        <li><strong>Efficiency Analytics:</strong> Identify bottlenecks and optimize workflows with our data-driven efficiency tools.</li>
        <li><strong>Integration Services:</strong> Seamlessly connect your existing systems with our flexible API architecture.</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
}

.hero {
  padding: 60px 20px;
  background-color: var(--light-bg);
  border-radius: 8px;
  margin-bottom: 40px;
}

h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  color: var(--secondary-color);
}

.subtitle {
  font-size: 1.5rem;
  color: #555;
  margin-bottom: 30px;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.features, .mission {
  margin-bottom: 50px;
}

h2 {
  font-size: 2rem;
  margin-bottom: 30px;
  color: var(--secondary-color);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.feature-card {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  color: var(--primary-color);
  margin-bottom: 15px;
}

.mission {
  text-align: left;
  padding: 30px;
  background-color: var(--light-bg);
  border-radius: 8px;
}

.mission p {
  margin-bottom: 20px;
}

.mission ul {
  padding-left: 20px;
  line-height: 1.8;
}

@media (max-width: 768px) {
  .hero {
    padding: 40px 15px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
