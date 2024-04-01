<script setup lang="ts">
import { Feedback, LogoutModal } from "#components";

const { navLinks } = useNav();

const isDark = useDark();
const toggleDark = useToggle(isDark);
const darkModeLabel = computed(() =>
  isDark.value ? "Light mode" : "Dark mode",
);
const darkModeIcon = computed(() =>
  isDark.value ? "i-heroicons-sun-solid" : "i-heroicons-moon-solid",
);

const modal = useModal();
function toggleFeedback() {
  modal.open(Feedback, {});
}

function toggleLogout() {
  modal.open(LogoutModal, {});
}

const links = computed<any>(() => {
  return [
    navLinks.value,
    [
      {
        label: "Cerrar sesión",
        icon: "i-heroicons-arrow-left-end-on-rectangle",
        click: () => {
          toggleLogout();
        },
      },
      {
        label: darkModeLabel.value,
        icon: darkModeIcon.value,
        click: () => {
          toggleDark();
        },
      },
      {
        label: "¿Necesitas ayuda?",
        icon: "i-heroicons-question-mark-circle",
        click: () => {
          toggleFeedback();
        },
      },
    ],
  ];
});
</script>

<template>
  <section class="fixed min-h-screen w-72 px-4">
    <article class="flex min-w-0 pb-4 pt-8">
      <Logo />
    </article>

    <ClientOnly>
      <UVerticalNavigation
        :links="links"
        :ui="{
          active: ' text-primary dark:text-primary border border-primary',
          inactive: '   border border-transparent',
          icon: {
            active: 'text-primary dark:text-primary',
            inactive: '',
          },
        }"
      />
    </ClientOnly>
  </section>
</template>
