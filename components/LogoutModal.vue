<script setup lang="ts">
const modal = useModal();

const { userLogout } = useAuth();
const buttonLoading = ref(false);

function logout() {
  buttonLoading.value = true;

  setTimeout(() => {
    userLogout();
    buttonLoading.value = true;
    modal.close();
  }, 1000);
}
</script>

<template>
  <UModal prevent-close>
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-primary text-base font-semibold leading-6">
            Cerrar sesión
          </h3>
        </div>
      </template>

      <div class="flex flex-col">
        <span>¿Seguro que deseas cerrar sesión?</span>
        <div class="mt-4 flex justify-end gap-2">
          <UButton label="Cancelar" color="gray" @click="modal.close()" />
          <UButton
            :loading="buttonLoading"
            label="Salir"
            icon="i-heroicons-arrow-left-end-on-rectangle"
            color="primary"
            @click="logout"
          />
        </div>
      </div>
    </UCard>
  </UModal>
</template>
