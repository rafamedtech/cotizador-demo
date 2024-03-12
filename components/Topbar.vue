<script setup lang="ts">
const isDark = useDark();
const toggleDark = useToggle(isDark);

const darkModeIcon = computed(() =>
  isDark.value ? "i-heroicons-sun-solid" : "i-heroicons-moon-solid",
);

const darkModeText = computed(() => (isDark.value ? "Light" : "Dark"));
</script>

<template>
  <div
    class="sticky top-0 z-[999] flex justify-between bg-[#1a1a1a] p-4 text-center shadow lg:hidden"
  >
    <!-- Logo on mobile -->
    <Logo />

    <section class="flex items-center gap-2">
      <ClientOnly>
        <UButton
          :label="darkModeText"
          :icon="darkModeIcon"
          variant="ghost"
          color="gray"
          :ui="{
            inline: 'flex-col',
            rounded: 'rounded-xl',
            color: {
              gray: {
                ghost: 'text-gray-200 hover:text-gray-200 hover:bg-gray-800',
              },
            },
          }"
          class="flex-1"
          @click="toggleDark()"
        />
      </ClientOnly>
    </section>
  </div>
</template>
