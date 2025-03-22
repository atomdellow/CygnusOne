<script setup>
import { onMounted, ref } from 'vue';

// Cygnus constellation star positions (simplified)
const cygnusStars = [
  { x: 50, y: 20, size: 3, brightness: 0.9 }, // Deneb
  { x: 40, y: 40, size: 2, brightness: 0.8 },
  { x: 30, y: 60, size: 2, brightness: 0.7 },
  { x: 20, y: 80, size: 2, brightness: 0.6 },
  { x: 60, y: 40, size: 2, brightness: 0.7 },
  { x: 70, y: 60, size: 2, brightness: 0.6 },
  { x: 80, y: 80, size: 2, brightness: 0.5 },
  { x: 25, y: 70, size: 1, brightness: 0.5 },
  { x: 75, y: 70, size: 1, brightness: 0.6 }
];

const stars = ref([]);

onMounted(() => {
  // Create the constellation
  cygnusStars.forEach(star => {
    stars.value.push({
      x: `${star.x}%`,
      y: `${star.y}%`,
      size: star.size,
      opacity: star.brightness,
      animationDelay: `${Math.random() * 5}s`
    });
  });
  
  // Add additional random stars
  for (let i = 0; i < 50; i++) {
    stars.value.push({
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: Math.random() < 0.8 ? 1 : 2,
      opacity: Math.random() * 0.5 + 0.3,
      animationDelay: `${Math.random() * 5}s`
    });
  }
});
</script>

<template>
  <div class="constellation-wrapper">
    <div 
      v-for="(star, index) in stars" 
      :key="index" 
      class="star" 
      :style="{
        left: star.x,
        top: star.y,
        width: `${star.size}px`,
        height: `${star.size}px`,
        opacity: star.opacity,
        animationDelay: star.animationDelay
      }"
    ></div>
    
    <!-- Constellation lines -->
    <svg class="constellation-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
      <line x1="50" y1="20" x2="40" y2="40" />
      <line x1="40" y1="40" x2="30" y2="60" />
      <line x1="30" y1="60" x2="20" y2="80" />
      <line x1="40" y1="40" x2="60" y2="40" />
      <line x1="60" y1="40" x2="70" y2="60" />
      <line x1="70" y1="60" x2="80" y2="80" />
    </svg>
  </div>
</template>

<style scoped>
.constellation-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.star {
  position: absolute;
  background-color: white;
  border-radius: 50%;
  animation: twinkle 4s infinite ease-in-out;
}

.constellation-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
}

.constellation-lines line {
  stroke: var(--primary-color);
  stroke-width: 0.5;
  stroke-opacity: 0.6;
}

@keyframes twinkle {
  0%, 100% { opacity: var(--opacity, 0.8); }
  50% { opacity: calc(var(--opacity, 0.8) * 0.5); }
}

.constellation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -10;
  opacity: 0.5;
  overflow: hidden;
}

/* Dark theme stars */
[data-theme="dark"] .constellation {
  background-color: transparent;
}

/* Light theme stars - slightly darker to be visible */
[data-theme="light"] .constellation {
  filter: invert(0.85);
  opacity: 0.4;
}
</style>
