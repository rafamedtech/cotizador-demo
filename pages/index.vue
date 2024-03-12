<script setup lang="ts">
const store = useStore();
const { isLoading } = storeToRefs(store);
</script>

<template>
  <main>
    <MainSection :loading="isLoading">
      <template #heading>
        <AppHeading title="Cotizaciones" />
      </template>
    </MainSection>
  </main>
</template>
