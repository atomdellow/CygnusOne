<script setup>
import { useAuthStore } from '../stores/auth';
import { computed } from 'vue';
import '../assets/styles/views/home.css';
import ConstellationBackground from '../components/ConstellationBackground.vue';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isAuthenticated);
</script>

<template>
  <div class="page-container">
    <ConstellationBackground />
    
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
      
      <!-- Additional spacing to ensure content isn't hidden behind fixed footer -->
      <div class="footer-spacer"></div>
    </div>
  </div>
</template>

<style scoped>
/* Additional home page specific styles */
.home {
  padding: 0 1rem;
}
</style>
