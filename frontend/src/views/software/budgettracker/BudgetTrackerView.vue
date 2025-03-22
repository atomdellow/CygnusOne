<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import '../../../assets/styles/software/budgettracker/budgettracker.css';

const router = useRouter();
const goBack = () => {
  router.push({ name: 'software' });
};
</script>

<template>
  <div class="app-wrapper">
    <div class="app-container">
      <div class="app-header">
        <button @click="goBack" class="btn btn-back">← Back to Software</button>
        <h1>Budget Tracker</h1>
        <p class="app-description">Manage your personal finances</p>
      </div>
      
      <div class="app-content">
        <!-- Placeholder content for Budget Tracker app -->
        <div class="placeholder-content">
          <h2>Budget Tracker App</h2>
          <p>This is a placeholder for the Budget Tracker application. The real functionality will be implemented soon.</p>
          
          <div class="feature-list">
            <h3>Planned Features:</h3>
            <ul>
              <li>Income and expense tracking</li>
              <li>Budget categories and limits</li>
              <li>Financial goals</li>
              <li>Reports and visualizations</li>
              <li>Recurring transactions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
