<script setup>
import VueDatepickerUi from "vue-datepicker-ui";
import "vue-datepicker-ui/lib/vuedatepickerui.css";
import { format } from "date-fns";

const date = ref(new Date());

const dateOptions = { year: "numeric", month: "short", day: "numeric" };

const store = useStore();
const { invoiceDialog, searchQuery, filterQuery, searchDate } =
  storeToRefs(store);

const emit = defineEmits(["@search", "@clear"]);

const searchBarRef = ref(null);
function onSearch() {
  invoiceDialog.value = false;
  contactsModal.value = false;
  emit("@search");
}

// Contacts autocomplete

const { contactData } = storeToRefs(store);
const uniqueContacts = ref(
  Array.from(new Set(contactData.value.map((a) => a.clientCompany))).map(
    (clientCompany) => {
      return contactData.value.find((a) => a.clientCompany === clientCompany);
    },
  ),
);

const filteredContacts = ref([]);
const contactsModal = ref(false);

const filterContacts = () => {
  if (searchQuery.value.length === 0) {
    filteredContacts.value = uniqueContacts.value;
  }

  filteredContacts.value = uniqueContacts.value.filter((contact) => {
    return contact.clientCompany
      .toLowerCase()
      .startsWith(searchQuery.value.toLowerCase());
  });
};

function setContact(contact) {
  searchQuery.value = contact;
  contactsModal.value = false;
}

onMounted(() => {
  filterContacts();
});

watch(searchQuery, () => {
  filterContacts();
});

// Filter contacts end

function clearSearch() {
  contactsModal.value = false;
  if (
    searchQuery.value === "" &&
    filterQuery.value === "Todas" &&
    !searchDate.value
  ) {
    return;
  }
  searchQuery.value = "";
  filterQuery.value = "Todas";
  searchDate.value = null;
  emit("@search", searchQuery.value);
  emit("@clear");
}

const filterDetails = ref(false);

const search = ref(null);
function toggleSearch() {
  filterDetails.value = !filterDetails.value;
  // search.value.focus();
}

const status = ["Todas", "Vendida", "Pendiente", "Cancelada", "Borrador"];

const selected = ref();
</script>

<template>
  <form
    @submit.prevent="onSearch(filterQuery)"
    ref="searchBarRef"
    class="relative flex w-full flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-dark-medium dark:bg-dark-strong lg:mx-auto lg:w-2/3 lg:flex-row lg:items-center"
  >
    <Icon
      :name="
        filterDetails
          ? 'heroicons:chevron-up'
          : 'heroicons:adjustments-horizontal'
      "
      size="24"
      class="absolute right-4 top-4 cursor-pointer text-dark-medium dark:text-light-medium"
      @click="toggleSearch"
    />
    <div class="flex w-full flex-col gap-2">
      <!-- <label class="label">
        <span class="label-text text-primary dark:text-dark-primary"
          >Buscar por cliente</span
        >
      </label>
      <div
        class="dropdown-bottom dropdown-end form-control dropdown relative w-full"
      >
        <div class="relative">
          <USelectMenu
            searchable
            searchable-placeholder="Escribe nombre del cliente..."
            placeholder="Elige un cliente"
            v-model="selected"
            :options="filteredContacts"
            option-attribute="clientCompany"
          >
            <template #empty> Sin resultados </template>
            <template #option-empty="{ query }">
              No se encontró <q>{{ query }}</q>
            </template>
          </USelectMenu>
          <Icon
            v-if="searchQuery || searchDate"
            name="heroicons-solid:x-mark"
            class="text-primary absolute right-2 top-2 cursor-pointer"
            @click="clearSearch"
          />
        </div>


      </div> -->
      <UFormGroup label="Buscar por cliente">
        <USelectMenu
          searchable
          searchable-placeholder="Escribe nombre del cliente..."
          placeholder="Elige un cliente"
          v-model="searchQuery"
          :options="filteredContacts"
          option-attribute="clientCompany"
        >
          <template #empty> Sin resultados </template>
          <template #option-empty="{ query }">
            No se encontró <q>{{ query }}</q>
          </template>
        </USelectMenu>
      </UFormGroup>
      <!-- Search Details -->
      <Transition name="slide">
        <div
          v-if="filterDetails"
          class="mt-2 w-full flex-col gap-x-4 lg:grid lg:grid-cols-2"
        >
          <!-- <UFormGroup label="Filtrar etapa">
            <USelect v-model="filterQuery" :options="status"> </USelect>
          </UFormGroup> -->
          <UFormGroup label="Etapa">
            <USelectMenu v-model="filterQuery" :options="status"> </USelectMenu>
          </UFormGroup>
          <UFormGroup label="Fecha">
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton
                icon="i-heroicons-calendar-days-20-solid"
                :label="format(date, 'd MMM, yyy')"
                color="gray"
                class="w-full"
              />

              <template #panel="{ close }">
                <DatePicker v-model="date" @close="close" />
              </template>
            </UPopover>
          </UFormGroup>
        </div>
      </Transition>

      <section
        class="mt-4 flex w-full justify-end gap-2 lg:w-1/2 lg:items-end lg:self-end lg:pl-2"
      >
        <UButton type="submit" icon="i-heroicons-document-magnifying-glass">
          Buscar
        </UButton>
      </section>
    </div>
  </form>
</template>
