<script lang="ts" setup>
// import { Modal } from "@/types/modal";

// const store = useStore();

// const { backBtn } = storeToRefs(store);
// function discardInvoice() {
//   store.$patch({
//     modalType: Modal.DiscardEdit,
//   });
//   backBtn.value?.click();
// }

const { params } = useRoute();
const { id }: any = params;

useHead({
  title: `Editar Cotización #${id} | Render Cotizador`,
});

definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <main>
    <section
      class="container mt-4 flex flex-col items-center gap-8 p-2 pb-24 lg:min-w-min lg:max-w-3xl"
    >
      <!-- <button
        type="button"
        @click="discardInvoice"
        class="z-50 flex items-center gap-2 self-start text-light-medium"
      >
        <label ref="backBtn" for="my-modal-6" class="hidden"></label>
        <Icon class="text-primary text-2xl" name="heroicons-solid:arrow-left" />
        <span class="text-xs text-dark-medium dark:text-light-strong"
          >Regresar</span
        >
      </button> -->
      <UButton
        icon="i-heroicons-arrow-left"
        type="button"
        :to="`/cotizaciones/${id}`"
        variant="ghost"
        color="gray"
        class="z-50 flex items-center gap-2 self-start"
        label="Regresar"
      />

      <InvoiceForm edit />
    </section>
  </main>
</template>
