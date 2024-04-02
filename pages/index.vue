<script lang="ts" setup>
// import Contact from '@/types/contact';

const { invoices } = await useInvoices();
const vendidas = computed(() =>
  invoices.value?.filter((invoice) => invoice.status === "Vendida"),
);
const pendientes = computed(() =>
  invoices.value?.filter((invoice) => invoice.status === "Pendiente"),
);
const canceladas = computed(() =>
  invoices.value?.filter((invoice) => invoice.status === "Cancelada"),
);

const totalInvoiceAmount = computed(() => {
  return invoices.value
    ?.filter((invoice) => invoice.status === "Vendida")
    .reduce((total, invoice) => total + invoice.invoiceTotal, 0);
});
const totalPendingInvoiceAmount = computed(() => {
  return invoices.value
    ?.filter((invoice) => invoice.status === "Pendiente")
    .reduce((total, invoice) => total + invoice.invoiceTotal, 0);
});
const totalCanceledInvoiceAmount = computed(() => {
  return invoices.value
    ?.filter((invoice) => invoice.status === "Cancelada")
    .reduce((total, invoice) => total + invoice.invoiceTotal, 0);
});

const store = useStore();
const { contactData, searchQuery, isLoadingFull, isLoading } =
  storeToRefs(store);
// const { isLoading, isLoadingFull, backBtn, modalType } = storeToRefs(store);

isLoadingFull.value = false;
const uniqueContacts = ref(
  Array.from(new Set(contactData.value.map((a) => a.clientCompany))).map(
    (clientCompany) => {
      return contactData.value.find((a) => a.clientCompany === clientCompany);
    },
  ),
);

const filteredContacts = ref([]);

const tableColumns = [
  {
    key: "clientCompany",
    label: "Empresa",
  },

  {
    key: "clientName",
    label: "Contacto",
  },
  {
    key: "actions",
    label: "",
  },
];

function clientInvoices(client: Contact) {
  searchQuery.value = client.clientCompany;
  return navigateTo("/cotizaciones");
}

useHead({
  title: "Inicio | Render Cotizador",
});

definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <main>
    <MainSection class="pt-8">
      <template #heading>
        <AppHeading title="Inicio" />
      </template>
      <template #content>
        <UCard :ui="{ background: 'dark:bg-dark-strong' }">
          <section class="flex justify-between gap-4 md:text-xl">
            <div class="grid place-items-center">
              <div class="text-primary dark:text-dark-primary">Total</div>
              <div class="text-dark-medium dark:text-light-strong">
                {{ invoices?.length }}
              </div>
              <!-- <div class="desc text-dark-medium dark:text-light-medium">Jan 1st - Feb 1st</div> -->
            </div>

            <div class="grid place-items-center">
              <div class="text-primary dark:text-dark-primary">Vendidas</div>
              <div class="text-dark-medium dark:text-light-strong">
                {{ vendidas?.length }}
              </div>
              <!-- <div class="desc text-dark-medium dark:text-light-medium">↗︎ 400 (22%)</div> -->
            </div>

            <div class="grid place-items-center">
              <div class="text-primary dark:text-dark-primary">Pendientes</div>
              <div class="text-dark-medium dark:text-light-strong">
                {{ pendientes?.length }}
              </div>
              <!-- <div class="desc text-dark-medium dark:text-light-medium">↘︎ 90 (14%)</div> -->
            </div>

            <div class="grid place-items-center">
              <div class="text-primary dark:text-dark-primary">Canceladas</div>
              <div class="text-dark-medium dark:text-light-strong">
                {{ canceladas?.length }}
              </div>
              <!-- <div class="desc text-dark-medium dark:text-light-medium">↘︎ 90 (14%)</div> -->
            </div>
          </section>
        </UCard>

        <UCard class="mt-8" :ui="{ background: 'dark:bg-dark-strong' }">
          <div class="flex justify-between gap-4 text-center md:text-xl">
            <div class="grid place-items-center">
              <div class="title text-primary dark:text-dark-primary">
                Total Vendido
              </div>
              <div class="text-dark-medium dark:text-light-medium">
                {{
                  new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(totalInvoiceAmount as number)
                }}
              </div>
              <!-- <div class="desc">Jan 1st - Feb 1st</div> -->
            </div>

            <div class="grid place-items-center">
              <div class="title text-primary dark:text-dark-primary">
                Total Pendiente
              </div>
              <div class="text-dark-medium dark:text-light-medium">
                {{
                  new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(totalPendingInvoiceAmount as number)
                }}
              </div>
              <!-- <div class="desc">↗︎ 400 (22%)</div> -->
            </div>

            <div class="grid place-items-center">
              <div class="title text-primary dark:text-dark-primary">
                Total Cancelado
              </div>
              <div class="text-dark-medium dark:text-light-medium">
                {{
                  new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(totalCanceledInvoiceAmount as number)
                }}
              </div>
              <!-- <div class="desc">↘︎ 90 (14%)</div> -->
            </div>
          </div>
        </UCard>
        <section class="mt-8 flex flex-col gap-4">
          <h2 class="text-center text-2xl">Últimos clientes</h2>
          <!-- <Bar :data="chartData" /> -->
          <UCard
            v-if="uniqueContacts.length"
            :ui="{ background: 'dark:bg-dark-strong' }"
          >
            <UTable
              :rows="uniqueContacts"
              :columns="tableColumns"
              :ui="{
                th: { color: 'text-primary' },
              }"
            >
              <template #actions-data="{ row }">
                <UButton @click="clientInvoices(row as Contact)">
                  Ver cotizaciones
                </UButton>
              </template>
            </UTable>
            <!-- <div class="grid gap-2 md:flex" v-for="contact in uniqueContacts">
              <div class="w-1/3 lg:w-3/6">
                <div
                  class="title text-primary dark:text-dark-primary text-base"
                >
                  Empresa
                </div>
                <div class="text-lg dark:text-light-medium">
                  {{ contact?.clientCompany }}
                </div>
              </div>
              <div class="w-1/3 lg:w-2/6">
                <div
                  class="title text-primary dark:text-dark-primary text-base"
                >
                  Contacto
                </div>
                <div class="text-lg text-dark-medium dark:text-light-medium">
                  {{ contact?.clientName }}
                </div>
              </div>
              <div class="w-full lg:w-1/6">
                <UButton @click="clientInvoices(contact as Contact)">
                  Ver cotizaciones
                </UButton>
              </div>
            </div> -->
          </UCard>
          <UCard :ui="{ background: 'dark:bg-dark-strong' }" v-else>
            <section class="grid place-items-center gap-2">
              <Icon
                name="i-heroicons-user-group"
                size="44"
                class="text-dark-medium dark:text-light-medium"
              />
              <h4 class="text-primary text-xl">No hay clientes</h4>
              <p class="mb-2 text-center text-sm md:w-1/2">
                Crea una nueva cotización para ver automáticamente los clientes
                aquí.
              </p>
              <UButton
                to="/cotizaciones/nueva-cotizacion"
                icon="i-heroicons-plus-20-solid"
                >Nueva cotización</UButton
              >
            </section>
          </UCard>
        </section>
      </template>
    </MainSection>
  </main>
</template>
