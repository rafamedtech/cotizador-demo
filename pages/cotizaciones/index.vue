<script setup lang="ts">
import type { InvoiceWithItems, SelectedStatus } from "@/types/invoice";

const store = useStore();

const { isLoading, invoicesLoaded, searchQuery } = storeToRefs(store);

const { getInvoices } = await useInvoices();
const invoices = await useFetchWithCache<InvoiceWithItems[]>("/api/invoices");

const filteredInvoices = computed(() => {
  if (selectedStatus.value.length === 0 && searchQuery.value === "") {
    // return the invoices but using pagination depending on the page value ,.
    return invoices.value.slice(
      (page.value - 1) * pageCount.value,
      page.value * pageCount.value,
    );
  }

  if (!selectedStatus.value.length) {
    return invoices.value.filter((invoice) =>
      invoice.clientCompany
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()),
    );
  }

  return invoices.value.filter(
    (invoice) =>
      invoice.clientCompany
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) &&
      selectedStatus.value.some((status) => status.key === invoice.status),
  );
});

const loadInvoices = ref(false);
function refreshInvoices() {
  setTimeout(() => {
    loadInvoices.value = true;
    isLoading.value = true;
    invoicesLoaded.value = false;

    sessionStorage.clear();

    setTimeout(async () => {
      await getInvoices();

      isLoading.value = false;
      loadInvoices.value = false;
      invoicesLoaded.value = true;
    }, 1000);
  }, 500);
}

isLoading.value = true;
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
    invoicesLoaded.value = true;
    // console.log(invoices.value);
  }, 1000);
  // if (filterQuery.value) {
  //   searchInvoices();
  // }
  isLoading.value = false;
});

const tableColumns = [
  {
    key: "invId",
    label: "#",
    sortable: true,
  },
  {
    key: "invoiceDate",
    label: "Fecha",
    sortable: true,
  },
  {
    key: "clientCompany",
    label: "Empresa",
    sortable: true,
  },
  {
    key: "invoiceTotal",
    label: "Total",
    sortable: true,
    direction: "desc" as const,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "actions",
    label: "",
  },
];

const status = [
  {
    key: "Borrador",
    label: "Borrador",
    value: false,
  },
  {
    key: "Pendiente",
    label: "Pendiente",
    value: false,
  },
  {
    key: "Vendida",
    label: "Vendida",
    value: true,
  },
  {
    key: "Cancelada",
    label: "Cancelada",
    value: false,
  },
];

const { contactData } = storeToRefs(store);
const uniqueContacts = ref(
  Array.from(new Set(contactData.value.map((a) => a.clientCompany))).map(
    (clientCompany) => {
      return contactData.value.find((a) => a.clientCompany === clientCompany);
    },
  ),
);

const selectedStatus = ref<SelectedStatus[]>([]);

const filterByDate = ref("Todas");

const resetFilters = () => {
  searchQuery.value = "";
  selectedStatus.value = [];
};

const pageTotal = computed(() => invoices.value.length);

// Pagination
const sort = ref({ column: "id", direction: "asc" as const });
const page = ref(1);
const pageCount = ref(10);

const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value),
);

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};
</script>

<template>
  <main>
    <MainSection class="pt-8">
      <template #heading>
        <section class="my-auto flex items-center justify-between">
          <AppHeading title="Cotizaciones" />
          <UButton
            to="/cotizaciones/nueva-cotizacion"
            icon="i-heroicons-plus-20-solid"
            >Nueva <span class="hidden md:inline">cotización</span></UButton
          >
        </section>
      </template>

      <template #content>
        <UCard class="mx-auto w-full">
          <template #header>
            <div
              class="flex flex-col gap-3 py-3 md:flex-row md:items-center md:px-4"
            >
              <h3>Filtrar</h3>
              <UInput
                v-model="searchQuery"
                icon="i-heroicons-magnifying-glass-20-solid"
                placeholder="Buscar..."
              />

              <section class="flex justify-between gap-3">
                <ClientOnly>
                  <USelectMenu
                    v-model="selectedStatus"
                    :options="status"
                    multiple
                    placeholder="Etapa"
                    class="w-full md:w-40"
                  >
                    <template #label>
                      <span v-if="selectedStatus.length" class="truncate">{{
                        `${selectedStatus.length} seleccionada${selectedStatus.length > 1 ? "s" : ""}`
                      }}</span>
                      <span v-else>Etapa</span>
                    </template>
                  </USelectMenu>
                </ClientOnly>

                <UButton
                  icon="i-heroicons-funnel"
                  color="gray"
                  :disabled="searchQuery === '' && selectedStatus.length === 0"
                  @click="resetFilters"
                >
                  Reset
                </UButton>
              </section>
              <UButton
                label="Sincronizar"
                variant="outline"
                @click="refreshInvoices"
                icon="i-heroicons-arrow-path-20-solid"
                :disabled="loadInvoices"
                :loading="isLoading"
                class="mx-auto mt-4 w-fit md:mx-0 md:mt-0 md:w-auto"
              />
            </div>
          </template>

          <UTable
            :empty-state="{
              icon: 'i-heroicons-document-text',
              label: 'No hay cotizaciones',
            }"
            :columns="tableColumns"
            :rows="filteredInvoices"
            :loading="isLoading"
            :loading-state="{
              icon: 'i-heroicons-arrow-path-20-solid',
              label: 'Cargando...',
            }"
            :sort-button="{
              color: 'primary',
              variant: 'ghost',
              square: false,
            }"
            :ui="{
              th: { color: 'text-primary' },
              default: { sortButton: { color: 'primary' } },
            }"
            class="hidden w-full md:block"
          >
            <template #invoiceDate-data="{ row }">
              {{
                new Date(row.invoiceDate).toLocaleString("es-MX", dateOptions)
              }}
            </template>
            <template #invoiceTotal-data="{ row }">
              {{
                new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                }).format(row.invoiceTotal)
              }}
            </template>
            <template #status-data="{ row }">
              <UBadge
                :color="
                  row.status === 'Vendida'
                    ? 'green'
                    : row.status === 'Pendiente'
                      ? 'yellow'
                      : row.status === 'Borrador'
                        ? 'gray'
                        : 'red'
                "
                variant="solid"
                >{{ row.status }}</UBadge
              >
            </template>

            <template #actions-data="{ row }">
              <UButton
                variant="ghost"
                icon="i-heroicons-arrow-top-right-on-square"
                :to="`/cotizaciones/${row.invId}`"
                label="Abrir"
              />
            </template>
          </UTable>

          <section
            v-if="filteredInvoices.length"
            class="flex flex-col gap-8 md:hidden"
          >
            <NuxtLink
              v-for="invoice in filteredInvoices"
              :to="`/cotizaciones/${invoice.invId}`"
            >
              <UCard :ui="{ background: 'dark:bg-dark-medium' }">
                <template #header>
                  <section class="flex items-center justify-between">
                    <span class="text-primary"> #{{ invoice.invId }} </span>
                    <span class="text-xs">
                      {{
                        new Date(invoice.invoiceDate).toLocaleString(
                          "es-MX",
                          dateOptions,
                        )
                      }}
                    </span>
                  </section>
                </template>
                <div class="flex items-center justify-between py-3">
                  <h3>{{ invoice.clientCompany }}</h3>
                  <UBadge
                    :color="
                      invoice.status === 'Vendida'
                        ? 'green'
                        : invoice.status === 'Pendiente'
                          ? 'yellow'
                          : invoice.status === 'Borrador'
                            ? 'gray'
                            : 'red'
                    "
                    variant="solid"
                    >{{ invoice.status }}</UBadge
                  >
                </div>

                <template #footer>
                  <section class="flex items-center justify-end">
                    <span class="text-primary font-bold">
                      {{
                        new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(invoice.invoiceTotal)
                      }}
                    </span>
                  </section>
                </template>
              </UCard>
            </NuxtLink>
          </section>

          <section v-else class="flex flex-col items-center gap-2 md:hidden">
            <Icon name="heroicons:document-text" size="32" color="gray" />
            <span>No hay cotizaciones</span>
          </section>

          <template #footer>
            <div
              class="flex flex-wrap items-center justify-between"
              v-if="pageTotal > 0"
            >
              <div>
                <span class="text-sm leading-5">
                  Mostrando
                  <span class="font-medium">{{ pageFrom }}</span>
                  al
                  <span class="font-medium">{{ pageTo }}</span>
                  de
                  <span class="font-medium">{{ pageTotal }}</span>
                  resultados
                </span>
              </div>

              <UPagination
                v-model="page"
                :page-count="pageCount"
                :total="pageTotal"
                :ui="{
                  wrapper: 'flex items-center gap-1',
                  rounded: '!rounded-full min-w-[32px] justify-center',
                  default: {
                    activeButton: {
                      variant: 'outline',
                    },
                  },
                }"
              />
            </div>
          </template>
        </UCard>
      </template>
    </MainSection>
  </main>
</template>
