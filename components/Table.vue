<script lang="ts" setup>
import type { InvoiceWithItems } from "@/types/invoice";
// Columns
const columns = [
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
    label: "Cliente",
    sortable: true,
  },
  {
    key: "status",
    label: "Etapa",
    sortable: true,
  },
  {
    key: "actions",
    label: "Detalles",
    sortable: false,
  },
];

const selectedColumns = ref(columns);
const columnsTable = computed(() =>
  columns.filter((column) => selectedColumns.value.includes(column)),
);

// Filters
const todoStatus = [
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

type SelectedStatus = {
  key: string;
  label: string;
  value: boolean;
};

const selectedStatus = ref<SelectedStatus[]>([]);
const search = ref("");
const searchStatus = computed(() => {
  if (selectedStatus.value?.length === 0) {
    return "";
  }

  if (selectedStatus?.value?.length > 1) {
    return `?completed=${selectedStatus.value[0].value}&completed=${selectedStatus.value[1].value}`;
  }

  return `?completed=${selectedStatus.value[0].value}`;
});

const resetFilters = () => {
  search.value = "";
  selectedStatus.value = [];
};

// Pagination
const sort = ref({ column: "id", direction: "asc" as const });
const page = ref(1);
const pageCount = ref(10);

const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value),
);

// Data
// const invoices = await useFetchWithCache<InvoiceWithItems[]>("/api/invoices");
const { data: invoices, pending } = await useLazyAsyncData<InvoiceWithItems[]>(
  "invoices",
  () => ($fetch as any)(`/api/invoices`),
  {
    default: () => [],
    watch: [page, search, searchStatus, pageCount, sort],
  },
);

const pageTotal = ref(invoices.value.length ?? 0); // This value should be dynamic coming from the API

const filteredInvoices = computed(() => {
  // return invoices depending on the search and status filters
  if (selectedStatus.value.length === 0 && search.value === "") {
    return invoices.value;
  }

  if (!selectedStatus.value.length) {
    return invoices.value.filter((invoice) =>
      invoice.clientCompany.toLowerCase().includes(search.value.toLowerCase()),
    );
  }

  return invoices.value.filter(
    (invoice) =>
      invoice.clientCompany
        .toLowerCase()
        .includes(search.value.toLowerCase()) &&
      selectedStatus.value.some((status) => status.key === invoice.status),
  );
});
</script>

<template>
  <UCard
    class="w-full"
    :ui="{
      base: '',
      background: 'bg-white dark:bg-dark-strong',
      ring: '',
      divide: 'divide-y divide-gray-200 dark:divide-gray-700',
      header: { padding: 'px-4 py-5' },
      body: {
        padding: '',
        base: 'divide-y divide-gray-200 dark:divide-gray-700',
      },
      footer: { padding: 'p-4' },
    }"
  >
    <template #header>
      <section class="my-auto flex items-center justify-between">
        <AppHeading title="Cotizaciones" />
        <UButton
          to="/cotizaciones/nueva-cotizacion"
          icon="i-heroicons-plus-20-solid"
          >Nueva cotizacion</UButton
        >
      </section>
    </template>

    <!-- Filters -->
    <div class="flex items-center gap-3 px-4 py-3">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass-20-solid"
        placeholder="Buscar..."
      />

      <USelectMenu
        v-model="selectedStatus"
        :options="todoStatus"
        multiple
        placeholder="Etapa"
        class="w-40"
      />

      <UButton
        icon="i-heroicons-funnel"
        color="gray"
        size="xs"
        :disabled="search === '' && selectedStatus.length === 0"
        @click="resetFilters"
      >
        Reset
      </UButton>
    </div>

    <!-- Header and Action buttons -->
    <!-- <div class="flex w-full items-center justify-between px-4 py-3">
      <div class="flex items-center gap-1.5">
        <span class="text-sm leading-5">Cotizaciones por página:</span>

        <USelect
          v-model="pageCount"
          :options="[3, 5, 10, 20, 30, 40]"
          class="me-2 w-20"
          size="xs"
        />
      </div>

      <div class="flex items-center gap-1.5">
        <UDropdown
          v-if="selectedRows.length > 1"
          :items="actions"
          :ui="{ width: 'w-36' }"
        >
          <UButton
            icon="i-heroicons-chevron-down"
            trailing
            color="gray"
            size="xs"
          >
            Mark as
          </UButton>
        </UDropdown>

        <USelectMenu v-model="selectedColumns" :options="columns" multiple>
          <UButton icon="i-heroicons-view-columns" color="gray" size="xs">
            Columnas
          </UButton>
        </USelectMenu>

        <UButton
          icon="i-heroicons-funnel"
          color="gray"
          size="xs"
          :disabled="search === '' && selectedStatus.length === 0"
          @click="resetFilters"
        >
          Reset
        </UButton>
      </div>
    </div> -->

    <!-- Table -->
    <UTable
      :rows="filteredInvoices"
      :columns="columnsTable"
      sort-asc-icon="i-heroicons-arrow-up"
      sort-desc-icon="i-heroicons-arrow-down"
      :sort-button="{
        color: 'primary',
        variant: 'ghost',
        square: false,
      }"
      class="w-full"
      :ui="{ td: { base: 'max-w-[0] truncate' } }"
    >
      <template #invoiceDate-data="{ row }">
        {{
          new Date(row.invoiceDate).toLocaleDateString("es-MX", {
            year: "numeric",
            day: "numeric",
            month: "short",
          })
        }}
      </template>
      <template #status-data="{ row }">
        <UBadge
          size="xs"
          :label="row.status"
          :color="
            row.status === 'Vendida'
              ? 'green'
              : row.status === 'Pendiente'
                ? 'yellow'
                : row.status === 'Borrador'
                  ? 'gray'
                  : 'red'
          "
        />
      </template>

      <template #actions-data="{ row }">
        <UButton
          variant="ghost"
          icon="i-heroicons-arrow-top-right-on-square"
          label="Abrir"
        />

        <!-- <UButton
          v-else
          icon="i-heroicons-arrow-path"
          size="2xs"
          color="orange"
          variant="outline"
          :ui="{ rounded: 'rounded-full' }"
          square
        /> -->
      </template>
    </UTable>

    <!-- Number of rows & Pagination -->
    <template #footer>
      <div class="flex flex-wrap items-center justify-between">
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
