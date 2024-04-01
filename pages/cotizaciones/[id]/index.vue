<script setup lang="ts">
import type { InvoiceWithItems, InvoiceDraft } from "@/types/invoice";

const { params } = useRoute();
const store = useStore();

const { id }: any = params;
const { newInvoice, updateStatusOnDb } = await useInvoice();
const { invoices } = await useInvoices();

const currentInvoice = ref<InvoiceWithItems | null>(null);

const { isLoadingFull } = storeToRefs(store);
const user = useSupabaseUser();

const swipeAnimation = ref(false);

onMounted(async () => {
  const { currentInvoice: invoice, getCurrentInvoice } = await useInvoice(id);
  await getCurrentInvoice(id);
  currentInvoice.value = invoice.value as InvoiceWithItems;
  // isLoadingFull.value = false;
  swipeAnimation.value = true;
});

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

// function toggleModal() {
//   const html: HTMLHtmlElement | null = document.querySelector("html");
//   if (html) html.style.overflowY = "hidden";
//   backBtn.value?.click();
// }

const lastInvoice = invoices.value?.[0];
const lastInvoiceId = lastInvoice?.invId;

async function duplicateInvoice() {
  isLoadingFull.value = true;

  const newId = Number(lastInvoiceId) + 1;
  const duplicatedInvoice = reactive({
    invId: newId.toString(),
    clientCompany: currentInvoice.value?.clientCompany,
    clientName: currentInvoice.value?.clientName,
    clientName2: currentInvoice.value?.clientName2,
    clientEmail: currentInvoice.value?.clientEmail,
    clientEmail2: currentInvoice.value?.clientEmail2,
    currencyType: currentInvoice.value?.currencyType,
    exchangeCost: currentInvoice.value?.exchangeCost,
    eta: currentInvoice.value?.eta,
    notes: currentInvoice.value?.notes,
    invoiceDate: new Date(),
    paymentDueDate: currentInvoice.value?.paymentDueDate,
    paymentType: currentInvoice.value?.paymentType,
    invoiceItems: currentInvoice.value?.invoiceItems.map(
      ({ id, invoiceId, ...item }) => item,
    ),
    status: "Borrador",
    invoiceSubtotal: currentInvoice.value?.invoiceSubtotal,
    invoiceTax: currentInvoice.value?.invoiceTax,
    invoiceTotal: currentInvoice.value?.invoiceTotal,
  });

  await newInvoice(duplicatedInvoice as InvoiceDraft);

  setTimeout(() => {
    isLoadingFull.value = false;
  }, 3000);

  await navigateTo(`/cotizaciones/${newId.toString()}/editar`);
}

// async function deleteInvoice() {
//   modalType.value = Modal.Delete;
//   toggleModal();
// }

function generatePDF() {
  window.print();
}

const toast = useToast();
async function changeStatus(status: string) {
  if (currentInvoice.value) {
    if (currentInvoice.value.status === status) {
      return;
    }
    currentInvoice.value.status = status;
  }

  await updateStatusOnDb(currentInvoice.value);

  toast.add({
    title: `Etapa actualizada a ${currentInvoice.value?.status}`,
  });
}

const options = [
  [
    {
      label: "Borrador",
      click: () => {
        changeStatus("Borrador");
      },
    },
  ],
  [
    {
      label: "Pendiente",
      click: () => {
        changeStatus("Pendiente");
      },
    },
    {
      label: "Vendida",
      click: () => {
        changeStatus("Vendida");
      },
    },
  ],
  [
    {
      label: "Cancelada",
      click: () => {
        changeStatus("Cancelada");
      },
    },
  ],
];

async function sendEmail() {
  try {
    await $fetch("/api/send", {
      method: "POST",
      body: {
        email: currentInvoice.value?.clientEmail,
        message: window.location.toString(),
      },
    });

    toast.add({
      title: `Correo enviado a ${currentInvoice.value?.clientEmail}`,
    });
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error al enviar el correo",
      description: "Intente recargar la página e intentar de nuevo",
    });
  }
}

const items = [
  [
    {
      label: "Editar",
      icon: "i-heroicons-pencil-square-20-solid",
      shortcuts: ["E"],
      click: async () => {
        await navigateTo(`/cotizaciones/${currentInvoice.value?.invId}/editar`);
      },
    },
    {
      label: "Duplicar",
      icon: "i-heroicons-document-duplicate-20-solid",
      shortcuts: ["D"],
      click: () => {
        duplicateInvoice();
      },
    },

    {
      label: "Crear PDF",
      icon: "i-heroicons-document-arrow-down",
      click: () => {
        window.print();
      },
    },
    {
      label: "Enviar",
      icon: "i-heroicons-envelope",
      click: async () => {
        await sendEmail();
      },
    },
  ],
];

useHead({
  title: `Cotización #${id} | Cotizador`,
  meta: [
    {
      name: "description",
      content: "Haz recibido una cotización de Cotizador",
    },
  ],
});

const isDark = useDark();
const toggleDark = useToggle(isDark);
const darkModeLabel = computed(() =>
  isDark.value ? "Modo claro" : "Modo oscuro",
);
const darkModeIcon = computed(() =>
  isDark.value ? "i-heroicons-sun-solid" : "i-heroicons-moon-solid",
);

// definePageMeta({
// middleware: async function ({ params }, from) {
//   const { currentInvoice, getCurrentInvoice } = await useInvoice(params.id as any);
//   await getCurrentInvoice(params.id as any);
//   if (!currentInvoice.value) {
//     return abortNavigation(
//       createError({
//         statusCode: 404,
//         message: 'No se encontro la cotizacion',
//       })
//     );
//   }
// },
// });
const statusColor = computed(() => {
  return currentInvoice.value?.status === "Vendida"
    ? "green"
    : currentInvoice.value?.status === "Pendiente"
      ? "yellow"
      : currentInvoice.value?.status === "Borrador"
        ? "gray"
        : "red";
});
</script>

<template>
  <main>
    <MainSection class="pt-0">
      <template #content>
        <section
          v-if="!currentInvoice"
          class="flex h-dvh flex-col items-center justify-center"
        >
          <Icon name="heroicons:arrow-path-20-solid" class="animate-spin" />
          <span>Cargando...</span>
        </section>
        <section v-else>
          <div v-if="currentInvoice && user" class="mb-4 print:hidden">
            <UButton
              icon="i-heroicons-arrow-left"
              type="button"
              to="/cotizaciones"
              variant="ghost"
              color="gray"
              class="z-50 mb-6 w-fit self-start"
              label="Regresar"
            />

            <!-- Header -->
            <UCard
              :ui="{
                body: { base: 'flex  justify-between w-full' },
                background: 'dark:bg-dark-strong',
                rounded: 'rounded-xl',
                ring: 'dark:print:ring-gray-300',
              }"
            >
              <section class="flex items-center gap-2">
                <div class="w-32">
                  <label>
                    <span
                      class="text-xs text-dark-strong dark:text-light-medium"
                      >Etapa</span
                    >
                  </label>
                  <div class="relative w-full">
                    <ClientOnly>
                      <UDropdown
                        :items="options"
                        :popper="{ placement: 'bottom-start' }"
                      >
                        <UButton
                          :color="statusColor"
                          :label="currentInvoice.status"
                          trailing-icon="i-heroicons-chevron-down-20-solid"
                        />
                      </UDropdown>
                    </ClientOnly>
                  </div>
                </div>
              </section>

              <!-- Status bar -->
              <div class="flex items-center lg:hidden">
                <Dropdown :items="items" />
              </div>
              <div class="hidden items-center gap-2 lg:flex">
                <UButton
                  v-for="{ label, icon, click } in items[0]"
                  :key="label"
                  :label="label"
                  color="gray"
                  :icon="icon"
                  @click="click"
                />
              </div>
            </UCard>
          </div>

          <!-- Invoice body -->
          <div id="pdf-content" class="w-full">
            <UCard
              :ui="{
                base: 'w-full',
                background: 'dark:bg-dark-strong',
                body: { padding: 'px-4 py-4 sm:p-4 z' },
                ring: 'dark:print:ring-gray-300',
              }"
            >
              <section class="relative flex h-full justify-between">
                <div class="mb-4 h-full w-fit">
                  <Logo />
                </div>
                <h1
                  class="text-primary absolute inset-0 top-2 hidden h-fit text-center text-xl font-bold uppercase italic lg:block print:block"
                >
                  Cotización
                </h1>
                <div class="flex flex-col items-end">
                  <p
                    class="dark:text-light font-bold uppercase text-dark-medium dark:text-light-strong"
                  >
                    #{{ id }}
                  </p>

                  <h3
                    class="text-primary dark:text-dark-primary text-xs lg:text-base"
                  >
                    Fecha
                  </h3>

                  <p
                    class="dark:text-light-strongm text-[10px] text-dark-medium dark:text-light-strong dark:print:text-dark-medium"
                  >
                    {{
                      new Date(currentInvoice?.invoiceDate).toLocaleDateString(
                        "es-MX",
                        dateOptions,
                      )
                    }}
                  </p>

                  <h3
                    class="text-primary dark:text-dark-primary text-xs lg:text-base"
                  >
                    Vigencia
                  </h3>

                  <p
                    class="dark:text-light text-[10px] text-dark-medium dark:text-light-strong dark:print:text-dark-medium"
                  >
                    {{
                      new Date(
                        currentInvoice?.paymentDueDate,
                      ).toLocaleDateString("es-MX", dateOptions)
                    }}
                  </p>

                  <h3
                    class="text-primary dark:text-dark-primary text-xs lg:text-base"
                  >
                    Entrega
                  </h3>

                  <p
                    class="text-[10px] text-dark-medium dark:text-light-strong dark:print:text-dark-medium"
                  >
                    {{ currentInvoice?.eta }}
                  </p>
                </div>
              </section>

              <!-- Customer information section -->
              <section class="md:pb-4">
                <h2
                  class="text-md border-secondary mx-auto mb-4 w-fit border-b-2 text-dark-strong dark:text-light-strong lg:text-base dark:print:text-dark-medium"
                >
                  Información del cliente
                </h2>

                <ul
                  class="grid grid-cols-3 gap-4 px-4 text-xs lg:grid-cols-5 lg:px-8 print:grid-cols-5"
                >
                  <li class="text-center">
                    <h3
                      class="text-primary dark:text-dark-primary mb-2 text-xs lg:text-base"
                    >
                      Nombre
                    </h3>
                    <p
                      class="text-[10px] capitalize text-dark-strong dark:text-light-strong lg:text-xs print:text-[10px] dark:print:text-dark-medium"
                    >
                      <!-- Nombre -->
                      {{ currentInvoice?.clientName }}
                    </p>
                    <p
                      class="text-[10px] capitalize text-dark-strong dark:text-light-strong lg:text-xs print:text-[10px] dark:print:text-dark-medium"
                    >
                      <!-- Nombre 2 -->
                      {{ currentInvoice?.clientName2 }}
                    </p>
                  </li>
                  <li class="text-center">
                    <h3
                      class="text-primary dark:text-dark-primary mb-2 border-dark-strong text-xs dark:border-light-strong lg:text-base"
                    >
                      Empresa
                    </h3>
                    <p
                      class="text-[10px] text-dark-strong dark:text-light-strong lg:text-xs print:text-[10px] dark:print:text-dark-medium"
                    >
                      <!-- Empresa -->
                      {{ currentInvoice?.clientCompany }}
                    </p>
                  </li>
                  <li class="text-center">
                    <h3
                      class="text-primary dark:text-dark-primary mb-2 border-dark-strong text-xs dark:border-light-strong lg:text-base"
                    >
                      Forma de pago
                    </h3>
                    <p
                      class="text-[10px] text-dark-strong dark:text-light-strong lg:text-xs print:text-[10px] dark:print:text-dark-medium"
                    >
                      <!-- Forma de pago -->
                      {{ currentInvoice?.paymentType }}
                    </p>
                  </li>
                  <li class="text-center">
                    <h3
                      class="text-primary dark:text-dark-primary mb-2 border-dark-strong text-xs dark:border-light-strong lg:text-base"
                    >
                      Moneda
                    </h3>
                    <p
                      class="text-[10px] text-dark-strong dark:text-light-strong lg:text-xs print:text-[10px] dark:print:text-dark-medium"
                    >
                      <!-- Moneda -->
                      {{ currentInvoice?.currencyType }}
                    </p>
                  </li>
                  <li class="text-center">
                    <h3
                      class="text-primary dark:text-dark-primary mb-2 border-dark-strong text-xs dark:border-light-strong lg:text-base"
                    >
                      Tipo de cambio
                    </h3>
                    <p
                      class="text-[10px] text-dark-strong dark:text-light-strong lg:text-xs print:text-[10px] dark:print:text-dark-medium"
                    >
                      {{
                        currentInvoice?.exchangeCost
                          ? `$${currentInvoice?.exchangeCost}`
                          : "N/A"
                      }}
                    </p>
                  </li>
                </ul>
              </section>
            </UCard>

            <!-- Items table -->
            <UCard
              :ui="{
                base: 'w-full',
                background: 'dark:bg-dark-strong',
                body: { padding: 'px-4 py-4 sm:p-4 ' },
                rounded: 'rounded-xl',
                ring: 'dark:print:ring-gray-300',
              }"
              class="relative mt-4 hidden max-h-[300px] min-h-[300px] overflow-x-auto lg:block print:block print:shadow-none"
            >
              <!-- <section
              class="relative mt-4 hidden max-h-[300px] min-h-[300px] overflow-x-auto rounded-xl border border-gray-300 bg-white dark:border-dark-medium dark:bg-dark-strong lg:block print:block print:border print:border-light-strong print:shadow-none"
            > -->
              <div
                class="flex w-[150vw] justify-between gap-2 text-[10px] lg:w-full lg:justify-between lg:gap-2 print:w-full"
              >
                <div class="w-72 lg:basis-5/12 print:w-7/12">
                  <h5 class="text-primary w-full py-2 font-bold">
                    Descripción
                  </h5>
                </div>
                <!-- <h5
            class="py-2 text-center font-bold text-primary dark:text-dark-primary print:w-1/12 print:basis-1/12 lg:basis-[10%]"
          >
            Condición
          </h5> -->
                <h5
                  class="text-primary py-2 text-center font-bold lg:basis-1/12 print:w-1/12"
                >
                  Cantidad
                </h5>
                <h5
                  class="text-primary py-2 text-center font-bold lg:basis-2/12 print:basis-2/12"
                >
                  Precio unitario
                </h5>
                <h5
                  class="text-primary w-12 py-2 text-right font-bold print:w-1/12"
                >
                  Importe
                </h5>
              </div>

              <div
                class="flex w-[150vw] justify-between gap-2 text-[10px] lg:w-full lg:justify-between lg:gap-2 print:w-full"
                v-for="item in currentInvoice?.invoiceItems"
                :key="item.itemId"
              >
                <div class="w-72 lg:basis-5/12 print:w-7/12">
                  <p
                    class="w-full overflow-x-hidden pt-2 text-left font-bold text-dark-strong dark:text-light-strong print:text-[10px] dark:print:text-dark-medium"
                  >
                    <!-- Nombre del item -->
                    {{ item.itemName || "Artículo sin nombre" }}
                  </p>
                  <p
                    class="w-full overflow-x-hidden pb-2 text-left italic text-gray-900 dark:text-gray-400 print:text-[10px]"
                  >
                    <!-- Nombre del item -->
                    {{ item.itemDescription || "Artículo sin descripción" }}
                  </p>
                </div>
                <!-- <p
            class="py-2 text-center text-dark-strong dark:text-light-strong print:w-1/12 print:basis-1/12 print:text-[10px] lg:basis-[10%]"
          >
            
            {{ item.condition }}
          </p> -->
                <p
                  class="py-2 text-center text-dark-strong dark:text-light-strong lg:basis-1/12 print:w-1/12 dark:print:text-dark-medium"
                >
                  <!-- Cantidad -->
                  {{ item.qty }}
                </p>
                <p
                  class="py-2 text-center text-dark-strong dark:text-light-strong lg:basis-2/12 print:basis-2/12 dark:print:text-dark-medium"
                >
                  {{
                    new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    }).format(item.price)
                  }}
                </p>
                <p
                  class="w-12 py-2 text-right text-dark-strong dark:text-light-strong print:w-1/12 dark:print:text-dark-medium"
                >
                  {{
                    new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    }).format(item.total)
                  }}
                </p>
              </div>
            </UCard>

            <!-- Items mobile -->
            <section class="mt-4 lg:hidden print:hidden">
              <h3
                class="border-primary mx-auto mb-4 w-fit border-b-2 text-center text-base text-dark-medium dark:text-light-medium"
              >
                Artículos
              </h3>
              <section
                v-if="swipeAnimation && currentInvoice?.invoiceItems.length > 1"
                class="text-secondary dark:text-dark-secondary mx-auto mb-2 flex items-center justify-center gap-4 lg:hidden"
              >
                <Icon
                  name="material-symbols:arrow-back-rounded"
                  size="24"
                  class="animate-ping"
                />
                <span class="text-primary dark:text-dark-primary">Desliza</span>
                <Icon
                  name="material-symbols:arrow-forward-rounded"
                  size="24"
                  class="animate-ping"
                />
              </section>
              <UCarousel
                v-slot="{ item, index }"
                :items="currentInvoice?.invoiceItems"
                :ui="{ item: 'w-full', container: 'p-2' }"
              >
                <UCard :ui="{ body: { padding: 'px-8' } }">
                  <div class="mx-auto text-xs">
                    <h2
                      class="text-[16px] text-dark-medium dark:text-light-medium"
                    >
                      {{ item.itemName || "Artículo sin nombre" }}
                    </h2>
                    <p class="w-[35ch] text-dark-medium dark:text-light-medium">
                      <span class="text-primary dark:text-primary/50 font-bold"
                        >Descripción:</span
                      >
                      {{ item.itemDescription || "Artículo sin descripción" }}
                    </p>
                    <p class="text-dark-medium dark:text-light-medium">
                      <span class="text-primary dark:text-primary/50 font-bold"
                        >Cantidad:</span
                      >
                      {{ item.qty }}
                    </p>
                    <p class="text-dark-medium dark:text-light-medium">
                      <span class="text-primary dark:text-primary/50 font-bold"
                        >Precio unitario:</span
                      >
                      {{
                        new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(item.price)
                      }}
                    </p>
                    <div class="card-actions items-center">
                      <button
                        class="btn text-primary flex gap-2 border-light-strong bg-white text-xs hover:border-light-strong hover:bg-transparent dark:border-dark-medium dark:bg-dark-strong"
                      >
                        <span class="text-dark-medium dark:text-light-medium"
                          >Importe:
                        </span>
                        <span>
                          {{
                            new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(item.total)
                          }}</span
                        >
                      </button>
                    </div>
                  </div>
                </UCard>
              </UCarousel>
            </section>
            <!-- Terms and total sections -->
            <section
              class="flex w-full flex-col-reverse gap-4 py-4 lg:flex-row print:flex-row"
            >
              <UCard
                :ui="{
                  base: 'print:flex-row',
                  background: 'dark:bg-dark-strong',
                  body: {
                    base: 'flex flex-col-reverse lg:flex-row print:flex-row print:w-3/5 print:basis-4/5 print:gap-4',
                    padding: 'px-4 py-4 sm:p-4',
                  },
                  rounded: 'rounded-xl',
                  ring: 'dark:print:ring-gray-300',
                }"
                class="w-full flex-col gap-4 print:pr-0 print:shadow-none"
              >
                <!-- <section
                class="flex w-full flex-col gap-4 overflow-y-hidden rounded-xl border border-gray-300 bg-white px-6 py-4 dark:border-dark-medium dark:bg-dark-strong lg:w-4/5 lg:flex-row print:w-3/5 print:basis-4/5 print:flex-row print:border print:border-light-strong print:pr-0 print:shadow-none"
              > -->
                <div>
                  <h3 class="text-primary mb-2 w-fit print:text-xs">
                    Condiciones del servicio
                  </h3>
                  <ul
                    class="w-full text-[8px] italic print:w-full print:text-[6px] dark:print:text-dark-medium"
                  >
                    <li>
                      - Horarios de atención: Lunes a viernes de 9 am a 7pm -
                      Sábados de 9am a 1pm
                    </li>
                    <li>- Al requerir factura se incluye IVA</li>
                    <li>- No hay devoluciones</li>
                    <li>
                      - Toda solicitud de diseño, producción de vídeo, web,
                      fotografía, etc. Se pide con un mínimo de 72 horas de
                      anticipación (sujeto a disponibilidad)
                    </li>
                    <li class="text-primary font-bold">
                      ¡GRACIAS POR SU CONFIANZA!
                    </li>
                  </ul>
                </div>
                <div class="w-full lg:w-1/2 print:w-2/5">
                  <h3
                    class="text-primary dark:text-dark-primary mb-2 w-fit print:text-xs"
                  >
                    Notas:
                  </h3>
                  <p
                    class="h-12 w-full overflow-hidden text-[8px] uppercase italic lg:w-[50ch] print:w-full print:text-[6px] dark:print:text-dark-medium"
                  >
                    {{ currentInvoice?.notes }}
                  </p>
                </div>
              </UCard>
              <UCard
                :ui="{
                  base: 'basis-[30%] flex flex-col justify-center lg:w-1/5 print:basis-[40%] print:w-3/5  print:px-4 print:text-xs print:shadow-none',
                  background: 'dark:bg-dark-strong',
                  rounded: 'rounded-xl',
                  body: {
                    base: 'flex justify-center flex-col h-full',
                    padding: 'px-4 py-4 sm:p-4',
                  },
                  ring: 'dark:print:ring-gray-300',
                }"
              >
                <!-- <section
                class="flex w-full basis-[30%] flex-col justify-center rounded-xl border border-gray-300 bg-white px-6 py-4 dark:border-dark-medium dark:bg-dark-strong lg:w-1/5 print:basis-[30%] print:border print:border-light-strong print:px-4 print:text-xs print:shadow-none"
              > -->
                <div class="flex items-center justify-between">
                  <div class="flex flex-col gap-2">
                    <p class="text-primary text-xs">Subtotal</p>
                    <p class="text-primary text-xs">IVA 16%</p>
                  </div>
                  <div class="flex flex-col items-end gap-2 text-xs">
                    <p class="dark:print:text-dark-medium">
                      <!-- Subtotal -->
                      {{
                        new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(currentInvoice?.invoiceSubtotal as number)
                      }}
                    </p>
                    <p class="dark:print:text-dark-medium">
                      <!-- Tax -->
                      {{
                        new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(currentInvoice?.invoiceTax as number)
                      }}
                    </p>
                  </div>
                </div>
                <div class="divide divider my-0 w-full"></div>
                <div class="flex w-full justify-between font-bold">
                  <p class="text-primary dark:text-dark-primary">Total</p>
                  <p class="text-primary">
                    <!-- Total -->
                    {{
                      new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      }).format(currentInvoice?.invoiceTotal as number)
                    }}
                  </p>
                </div>
              </UCard>
            </section>
          </div>

          <!-- Crear PDF usuario -->
          <div class="flex justify-center gap-2 print:hidden" v-if="!user">
            <UButton
              @click="toggleDark()"
              :label="darkModeLabel"
              size="lg"
              :icon="darkModeIcon"
              color="gray"
            />
            <UButton
              @click="generatePDF"
              label="Crear PDF"
              size="lg"
              icon="i-heroicons-document-arrow-down"
            />
          </div>
        </section>
      </template>
    </MainSection>
  </main>
</template>
