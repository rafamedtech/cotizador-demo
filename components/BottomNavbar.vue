<script setup>
const { navLinks } = useNav();
</script>

<template>
  <UHorizontalNavigation
    :ui="{
      base: 'flex-col w-full ',
      container: 'justify-between w-full',
      inner: 'flex-1 hover:text-white',
      before: 'px-2',
    }"
    :links="navLinks"
    class="fixed bottom-0 z-[49] border-t bg-white dark:border-none dark:bg-dark-strong"
  />
</template>
