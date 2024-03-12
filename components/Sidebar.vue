<script setup lang="ts">
const { navLinks } = useNav();

const isDark = useDark();
const toggleDark = useToggle(isDark);
const darkModeLabel = computed(() => {
  return isDark.value ? 'Light mode' : 'Dark mode';
});
const darkModeIcon = computed(() =>
  isDark.value ? 'i-heroicons-sun-solid' : 'i-heroicons-moon-solid'
);

const links = computed<any>(() => {
  return [
    navLinks.value,
    [
      {
        label: darkModeLabel.value,
        icon: darkModeIcon.value,
        click: () => {
          toggleDark();
        },
      },
    ],
  ];
});
</script>

<template>
  <section class="fixed min-h-screen w-1/6 bg-[#1a1a1a] px-4">
    <article class="flex min-w-0 justify-center py-4">
      <Logo />
    </article>

    <UVerticalNavigation
      :links="links"
      :ui="{
        active: 'before:bg-gray-800 text-primary dark:text-primary border border-primary',
        inactive:
          'hover:text-white text-gray-400 hover:before:bg-gray-800/50 border border-transparent',
        icon: {
          active: 'text-primary dark:text-primary',
          inactive: '',
        },
      }"
    />
  </section>
</template>
