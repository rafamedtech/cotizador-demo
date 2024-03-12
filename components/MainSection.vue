<script setup lang="ts">
// interface Props {
//   loading: boolean;
// }

// defineProps<Props>();
</script>

<template>
  <section class="min-h-dvh w-full">
    <section class="pt-8 lg:pt-8">
      <slot name="heading"></slot>
    </section>

    <section class="pb-24 pt-8">
      <slot name="content"></slot>
    </section>
    <!-- <div
      v-if="loading"
      class="flex h-[70vh] w-full items-center justify-center"
    >
      <Icon
        name="icon-park-outline:loading-four"
        size="48"
        class="animate-spin"
      />
    </div>

    <section class="pb-24 pt-8" v-else>
      <slot name="content"></slot>
    </section> -->
  </section>
</template>
