<script setup lang="ts">
import type { InvoiceWithItems, InvoiceOutline } from "@/types/invoice";
import noResults from "@/assets/img/no-results.svg";

const store = useStore();

const {
  isLoading,
  isLoadingFull,
  invoicesLoaded,
  searchQuery,
  filterQuery,
  filterResults,
  searchDate,
} = storeToRefs(store);

// const invoices = ref<InvoiceWithItems[]>([]);
const { getInvoices } = await useInvoices();
const invoices = await useFetchWithCache<InvoiceWithItems[]>("/api/invoices");
const filteredInvoices = ref<InvoiceWithItems[]>([]);

const dateOptions = { year: "numeric", month: "short", day: "numeric" };

const searchSubmit = ref(false);
const filterStatus = ref("Todas");
const filterMenu = ref(true);
function searchInvoices() {
  searchSubmit.value = true;
  filterMenu.value = false;
  invoicesLoaded.value = false;
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    invoicesLoaded.value = true;
  }, 1000);

  if (filterQuery.value === "Todas" && !searchDate.value) {
    filteredInvoices.value = invoices.value.filter((invoice) => {
      return invoice.clientCompany
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());
    });
  } else if (filterQuery.value === "Todas") {
    filteredInvoices.value = invoices.value.filter((invoice) => {
      return (
        invoice.invoiceDate ===
          new Date(searchDate.value).toLocaleString("es-MX", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }) &&
        invoice.clientCompany
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      );
    });
  } else if (!searchDate.value) {
    filteredInvoices.value = invoices.value.filter((invoice) => {
      return (
        invoice.clientCompany
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) &&
        invoice.status === filterQuery.value
      );
    });
  } else {
    filteredInvoices.value = invoices.value.filter((invoice) => {
      return (
        invoice.clientCompany
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) &&
        invoice.status === filterQuery.value &&
        invoice.invoiceDate ===
          new Date(searchDate.value).toLocaleString("es-MX", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
      );
    });
  }

  if (filteredInvoices.value.length === 0) {
    return (filterResults.value = false);
  } else {
    return (filterResults.value = true);
  }
}

function searchCleared() {
  filterMenu.value = true;
  filterStatus.value = "Todas";
}

const loadInvoices = ref(false);
function refreshInvoices() {
  loadInvoices.value = true;
  isLoading.value = true;
  invoicesLoaded.value = false;
  sessionStorage.clear();

  setTimeout(async () => {
    await getInvoices();
    loadInvoices.value = false;
    isLoading.value = false;
    invoicesLoaded.value = true;
  }, 2000);
}

isLoading.value = true;
onMounted(() => {
  // const { invoices: invoiceData } = await useInvoices();
  // invoices.value = invoiceData.value;

  setTimeout(() => {
    isLoading.value = false;
    invoicesLoaded.value = true;
    // console.log(invoices.value);
  }, 1000);
  if (filterQuery.value) {
    searchInvoices();
  }
  isLoading.value = false;
});

const tableColumns = [
  {
    key: "id",
    label: "ID",
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

const statusBtnColor = (status: string) => {
  return status === "Pagada"
    ? "success"
    : status === "Pendiente"
      ? "warning"
      : status === "Borrador"
        ? "gray"
        : "primary";
};
</script>

<template>
  <main>
    <MainSection>
      <template #heading>
        <section class="my-auto flex items-center justify-between">
          <AppHeading title="Cotizaciones" />
          <UButton to="/nueva-cotizacion" icon="i-heroicons-plus-20-solid"
            >Nueva cotizacion</UButton
          >
        </section>
      </template>

      <template #content>
        <div class="mx-auto w-full max-w-3xl">
          <!-- Search box -->
          <section class="flex w-full items-center justify-between">
            <SearchBar @@search="searchInvoices()" @@clear="searchCleared" />
          </section>

          <!-- <section
            class="text-primary focus:outline-primary dark:text-dark-primary relative mt-8 hidden w-full items-center justify-between rounded-2xl px-4 py-7 transition-all duration-300 lg:flex lg:px-8"
          >
            <p class="hidden w-[5%] lg:block lg:w-[10%]">ID</p>
            <p class="hidden w-[20%] lg:block">Fecha</p>
            <p class="hidden w-[30%] lg:block lg:w-[25%]">Empresa</p>
            <p class="hidden w-[25%] lg:block">Total</p>
            <p class="hidden w-[20%] lg:block">Status</p>
            <Icon
              class="text-secondary dark:text-dark-secondary absolute right-2 cursor-pointer text-2xl"
              :class="{ 'animate-spin': loadInvoices }"
              name="ri:refresh-line"
              @click="refreshInvoices"
            />
          </section> -->

          <section class="mt-4 flex flex-col items-center justify-center">
            <Icon
              class="text-primary cursor-pointer"
              :class="{ 'animate-spin': loadInvoices }"
              name="ri:refresh-line"
              size="28"
              @click="refreshInvoices"
            />
            <span class="text-xs text-dark-medium dark:text-light-medium"
              >Sincronizar</span
            >
          </section>

          <section
            class="mt-4 flex flex-col items-center gap-10 lg:mt-8 lg:gap-4"
          >
            <UTable
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
              class="w-full"
              :ui="{
                th: { color: 'text-primary' },
                default: { sortButton: { color: 'primary' } },
              }"
            >
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
                  :to="`/cotizacion/${row.invId}`"
                />
              </template>
            </UTable>
          </section>
          <!-- <TransitionGroup
            v-if="invoicesLoaded && filterResults && invoices"
            tag="section"
            class="mt-4 flex flex-col items-center gap-10 lg:mt-8 lg:gap-4"
            appear
            name="slide-up"
          >
            <UTable
              :columns="tableColumns"
              :rows="filteredInvoices"
              :sort-button="{
                color: 'primary',
                variant: 'ghost',

                square: false,
              }"
              class="w-full"
              :ui="{
                th: { color: 'text-primary' },
                default: { sortButton: { color: 'primary' } },
              }"
            >
              <template #invoiceTotal-data="{ row }">
                {{
                  new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(row.invoiceTotal)
                }}
              </template>
              <template #status-data="{ row }">
                <UButton :color="() => statusBtnColor(row.status)" disabled>{{
                  row.status
                }}</UButton>
              </template>

              <template #actions-data="{ row }">
                <UButton
                  variant="ghost"
                  icon="i-heroicons-arrow-top-right-on-square"
                />
              </template>
            </UTable>
          </TransitionGroup> -->

          <!-- No filter results -->
          <div
            v-if="
              filteredInvoices.length === 0 &&
              invoices.length > 0 &&
              !isLoading &&
              !filterResults
            "
            class="mt-16 w-full text-center"
          >
            <img :src="noResults" class="mx-auto mb-8 w-32" alt="" />
            <span class="text-dark-medium dark:text-light-medium"
              >No se encontraron resultados</span
            >
          </div>

          <!-- <LoadingSpinner class="pt-16" v-if="isLoading" /> -->
        </div>

        <!-- If no invoices -->
        <NoInvoices
          v-if="invoices.length === 0 && invoicesLoaded && !isLoading"
        />
      </template>
    </MainSection>
  </main>
</template>
