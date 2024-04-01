<script lang="ts" setup>
import { DiscardModal } from "#components";

// const store = useStore();

// const { isLoadingFull } = storeToRefs(store);
const { getInvoices } = await useInvoices();

onBeforeMount(async () => {
  // isLoadingFull.value = false;
  await getInvoices();
});

const modal = useModal();
function discardInvoice() {
  modal.open(DiscardModal, {});
}

useHead({
  title: "Nueva Cotización | Render Cotizador",
});

definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <main>
    <section
      class="container flex flex-col items-center gap-8 pb-24 pt-8 lg:min-w-min lg:max-w-3xl"
    >
      <UButton
        icon="i-heroicons-arrow-left"
        type="button"
        variant="ghost"
        color="gray"
        class="z-50 flex items-center gap-2 self-start"
        label="Regresar"
        @click="discardInvoice"
      />

      <InvoiceForm />
    </section>
  </main>
</template>
