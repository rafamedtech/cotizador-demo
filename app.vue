<script setup lang="ts">
const user = useSupabaseUser();
</script>

<template>
  <div class="dark:bg-[#222222] md:px-4">
    <Topbar v-if="user" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <BottomNavbar v-if="user" class="lg:hidden" />

    <UModals />
    <UNotifications />
  </div>
</template>
