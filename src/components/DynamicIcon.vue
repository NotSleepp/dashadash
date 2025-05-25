<script setup>
import { computed } from 'vue';
import * as icons from 'lucide-vue-next';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 24
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  strokeWidth: {
    type: Number,
    default: 2
  },
  class: {
    type: String,
    default: ''
  }
});

const icon = computed(() => {
  // Convertir nombres de iconos comunes a los nombres correctos de lucide
  const iconMap = {
    'home': 'Home',
    'user': 'User',
    'users': 'Users',
    'package': 'Package',
    'shopping-cart': 'ShoppingCart',
    'bar-chart': 'BarChart',
    'circle': 'Circle'
  };
  
  const iconName = iconMap[props.name.toLowerCase()] || props.name;
  return icons[iconName] || icons.Circle; // Fallback a Circle si no se encuentra el icono
});
</script>

<template>
  <component 
    :is="icon" 
    :size="size" 
    :color="color" 
    :stroke-width="strokeWidth" 
    :class="class"
  />
</template>