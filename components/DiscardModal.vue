<script setup lang="ts">
const modal = useModal();

function discardInvoice() {
  modal.close();

  return navigateTo("/cotizaciones");
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
        <div class="flex items-center gap-2">
          <h3 class="text-primary text-base font-semibold leading-6">
            Descartar cotización
          </h3>
          <Icon name="heroicons:exclamation-triangle" size="28" />
        </div>
      </template>

      <div class="flex flex-col">
        <span>¿Seguro que deseas salir? Los cambios no se guardarán</span>
        <div class="mt-4 flex justify-end gap-2">
          <UButton label="Cancelar" color="gray" @click="modal.close()" />
          <UButton
            label="Descartar"
            icon="i-heroicons-trash"
            color="primary"
            @click="discardInvoice"
          />
        </div>
      </div>
    </UCard>
  </UModal>
</template>
