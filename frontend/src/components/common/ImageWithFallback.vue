<script setup>
import { ref, onMounted } from 'vue';
import ImagePlaceholder from './ImagePlaceholder.vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'abstract' // abstract, icon, thumbnail
  },
  imgClass: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  }
});

const imageLoaded = ref(false);
const imageError = ref(false);
const imgElement = ref(null);

const handleLoad = () => {
  imageLoaded.value = true;
};

const handleError = () => {
  imageError.value = true;
};

onMounted(() => {
  if (imgElement.value) {
    if (imgElement.value.complete) {
      imageLoaded.value = true;
    }
  }
});
</script>

<template>
  <div class="image-wrapper" :style="{ width, height }">
    <img
      v-if="!imageError"
      ref="imgElement"
      :src="src"
      :alt="alt"
      :class="imgClass"
      @load="handleLoad"
      @error="handleError"
    />
    <ImagePlaceholder 
      v-if="imageError" 
      :alt="alt" 
      :type="type" 
      :width="width" 
      :height="height"
    />
  </div>
</template>

<style scoped>
.image-wrapper {
  position: relative;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
