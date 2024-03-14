<script lang="ts" setup>
import { Modal } from "@/types/modal";

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

const store = useStore();

const { backBtn, isLoadingFull } = storeToRefs(store);

onBeforeMount(() => {
  isLoadingFull.value = false;
});

function discardInvoice() {
  store.$patch({
    modalType: Modal.Discard,
  });
  backBtn.value?.click();
}

useHead({
  title: "Nueva Cotización | Render Cotizador",
});

// definePageMeta({
//   middleware: ['auth'],
// });
</script>

<template>
  <main>
    <section
      class="container flex flex-col items-center gap-8 pb-24 pt-8 lg:min-w-min lg:max-w-3xl"
    >
      <UButton
        icon="i-heroicons-arrow-left"
        type="button"
        @click="discardInvoice"
        variant="ghost"
        color="gray"
        class="z-50 flex items-center gap-2 self-start"
      >
        <label ref="backBtn" for="my-modal-6" class="hidden"></label>

        <span class="text-xs">Regresar</span>
      </UButton>

      <InvoiceForm />
    </section>
  </main>
</template>
