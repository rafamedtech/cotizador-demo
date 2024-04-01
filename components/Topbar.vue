<script setup lang="ts">
import { Feedback, LogoutModal } from "#components";

const isDark = useDark();
const toggleDark = useToggle(isDark);
const darkModeIcon = computed(() =>
  isDark.value ? "i-heroicons-sun-solid" : "i-heroicons-moon-solid",
);
const darkModeLabel = computed(() =>
  isDark.value ? "Modo claro" : "Modo oscuro",
);

const modal = useModal();
function toggleFeedback() {
  modal.open(Feedback, {});
}

function toggleLogout() {
  modal.open(LogoutModal, {});
}
const items = computed<any>(() => {
  return [
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
          // console.log("Dark mode");
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
  <div
    class="sticky top-0 z-[49] bg-white pt-4 text-center dark:bg-dark-strong lg:hidden print:hidden"
  >
    <!-- Logo on mobile -->
    <section class="flex justify-between px-2 pb-4">
      <Logo />

      <section class="flex items-center gap-2">
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            color="white"
            trailing-icon="i-heroicons-bars-3-bottom-right"
            class="h-fit"
          />
        </UDropdown>
        <!-- <UButton
            :label="darkModeText"
            :icon="darkModeIcon"
            variant="ghost"
            color="gray"
            :ui="{
              inline: 'flex-col',
              rounded: 'rounded-xl',
            }"
            class="flex-1"
            @click="toggleDark()"
          /> -->
      </section>
    </section>
    <UDivider class="dark:hidden" />
  </div>
</template>
