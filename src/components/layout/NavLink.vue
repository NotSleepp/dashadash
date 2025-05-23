<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from 'lucide-vue-next';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  collapsed: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();

const isActive = computed(() => {
  return route.path === props.item.path || route.path.startsWith(`${props.item.path}/`);
});

const iconName = computed(() => {
  return props.item.icon || 'Circle';
});
</script>

<template>
  <router-link 
    :to="item.path" 
    class="flex items-center px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-[var(--color-bg-secondary)]"
    :class="{ 
      'bg-[var(--color-bg-secondary)]': isActive,
      'justify-center': collapsed,
      'space-x-3': !collapsed 
    }"
  >
    <Icon 
      :name="iconName" 
      class="flex-shrink-0 w-5 h-5 text-[var(--color-accent)]"
      :class="{ 'mr-0': collapsed }"
    />
    <span 
      v-if="!collapsed" 
      class="truncate"
    >
      {{ item.label }}
    </span>
  </router-link>
</template>