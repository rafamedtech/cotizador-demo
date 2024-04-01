<script setup lang="ts">
const { items } = defineProps<{
  items: any[];
}>();
</script>

<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
    <UButton
      color="white"
      trailing-icon="i-heroicons-queue-list"
      class="h-fit"
    />
  </UDropdown>
</template>
