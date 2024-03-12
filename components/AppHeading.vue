<script setup lang="ts">
const { title, description, cover } = defineProps<{
  title?: string;
  description?: string;
  cover?: string;
}>();
</script>

<template>
  <div class="h-full relative" :class="{ 'min-h-[10rem]': cover }">
    <img
      v-if="cover"
      :src="cover"
      alt=""
      class="absolute h-full w-full object-cover z-10 inset-0 brightness-50 rounded-lg"
    />
    <section
      class="z-50 relative h-full md:p-2"
      :class="{ 'min-h-[10rem] grid place-content-center': cover }"
    >
      <h1
        class="card-title text-primary text-3xl w-fit md:text-4xl"
        :class="{ 'px-2 rounded-lg bg-accent/20 dark:bg-primary/10 shadow-sm': cover }"
      >
        {{ title }}
      </h1>
      <span class="dark:text-base-100">{{ description }}</span>
    </section>
  </div>
</template>
