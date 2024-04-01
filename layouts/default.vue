<script setup lang="ts">
const user = useSupabaseUser();
</script>

<template>
  <UContainer class="relative z-0">
    <section v-if="user" class="hidden justify-between lg:flex lg:w-72">
      <Sidebar />
    </section>

    <section
      class="w-full"
      :class="{ 'md:pl-80': user, 'mx-auto max-w-4xl': !user }"
    >
      <slot> </slot>
    </section>
  </UContainer>
</template>
