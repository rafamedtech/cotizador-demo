<script setup lang="ts">
import { DiscardModal } from "#components";
import type { FormError, FormSubmitEvent } from "#ui/types";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  maxLength,
  minValue,
  helpers,
} from "@vuelidate/validators";

import { uid } from "uid";
import { format } from "date-fns";

const date = ref(new Date());

// Type imports
import type { InvoiceDraft, InvoiceItems } from "@/types/invoice";
import { Modal } from "@/types/modal";

interface Props {
  edit?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  edit: false,
});

const store = useStore();

const router = useRouter();
const { invoices } = await useInvoices();
// const invoiceObject = store.invoiceObject;

const { params } = useRoute();
const { id }: any = params;

const invoiceTitle = computed(() => {
  return props.edit ? "Editar Cotización" : "Nueva Cotización";
});

const initialInvoice = ref({ invId: 0 });
const lastInvoice = ref(invoices.value?.[0] ?? initialInvoice.value);
// console.log(lastInvoice.value);

const lastInvoiceId = lastInvoice.value?.invId;
const newId = computed(() => {
  return Number(lastInvoiceId) + 1;
});

const { contactData, backBtn, isLoading, modalType, filterResults } =
  storeToRefs(store);

const invoiceObject = reactive<InvoiceDraft>({
  // invId: "",
  invId: newId.value.toString(),
  clientCompany: "",
  clientName: "",
  clientName2: "",
  clientEmail: "",
  clientEmail2: "",
  currencyType: "MX",
  exchangeCost: 0,
  eta: "Inmediata",
  notes: "",
  invoiceDate: new Date(),
  paymentDueDate: new Date(),
  paymentType: "Contado",
  invoiceItems: [
    {
      itemId: uid(2),
      itemName: "",
      itemDescription: "",
      condition: "N/A",
      qty: 1,
      partNo: "",
      price: 0,
      total: 0,
    },
  ],
  status: "Borrador",
});

if (props.edit) {
  const { currentInvoice } = await useInvoice(id);
  if (currentInvoice.value) {
    invoiceObject.id = currentInvoice.value?.id;
    invoiceObject.invId = currentInvoice.value?.invId;
    invoiceObject.clientCompany = currentInvoice.value?.clientCompany;
    invoiceObject.clientName = currentInvoice.value?.clientName;
    invoiceObject.clientName2 = currentInvoice.value?.clientName2;
    invoiceObject.clientEmail = currentInvoice.value?.clientEmail;
    invoiceObject.clientEmail2 = currentInvoice.value?.clientEmail2;
    invoiceObject.currencyType = currentInvoice.value?.currencyType;
    invoiceObject.exchangeCost = currentInvoice.value?.exchangeCost;
    invoiceObject.eta = currentInvoice.value?.eta;
    invoiceObject.notes = currentInvoice.value?.notes;
    invoiceObject.paymentDueDate = currentInvoice.value?.paymentDueDate;
    invoiceObject.paymentType = currentInvoice.value?.paymentType;
    invoiceObject.invoiceItems = currentInvoice.value
      ?.invoiceItems as InvoiceItems[];
    invoiceObject.status = currentInvoice.value?.status;
  }
}

// Saved contacts menu
const contactsModal = ref(false);

const filteredContacts = ref<Contact[]>([]);
const uniqueContacts = ref(
  Array.from(new Set(contactData.value.map((a) => a.clientCompany))).map(
    (clientCompany) => {
      return contactData.value.find((a) => a.clientCompany === clientCompany);
    },
  ),
);

const filterContacts = () => {
  if (invoiceObject.clientCompany === "Elige un cliente") {
    filteredContacts.value = uniqueContacts.value as Contact[];
  }

  filteredContacts.value = uniqueContacts.value.filter((contact) => {
    return contact?.clientCompany
      .toLowerCase()
      .startsWith(invoiceObject.clientCompany.toLowerCase());
  }) as Contact[];
};

const createContact = (contact: string) => {
  filteredContacts.value.push({
    clientCompany: contact,
    clientName: "",
    clientName2: "",
    clientEmail: "",
    clientEmail2: "",
  });
  invoiceObject.clientCompany = contact;
  invoiceObject.clientName = "";
  invoiceObject.clientEmail = "";
  invoiceObject.clientName2 = "";
  invoiceObject.clientEmail2 = "";
};

const setContact = (contact: string) => {
  const currentContact = filteredContacts.value.find(
    (c) => c?.clientCompany === contact,
  );

  if (!currentContact) {
    createContact(contact);
    return;
  }
  invoiceObject.clientCompany = currentContact?.clientCompany ?? "";
  invoiceObject.clientName = currentContact?.clientName ?? "";
  invoiceObject.clientName2 = currentContact?.clientName2 ?? "";
  invoiceObject.clientEmail = currentContact?.clientEmail ?? "";
  invoiceObject.clientEmail2 = currentContact?.clientEmail2 ?? "";
};

watchEffect(() => {
  setContact(invoiceObject.clientCompany);
});

onMounted(() => {
  filterContacts();
  invoiceObject.clientCompany =
    invoiceObject.clientCompany || "Elige un cliente";
});

// Invoice validation

const rules = computed(() => {
  return {
    paymentDueDate: {
      required: helpers.withMessage(
        "Es necesario ingresar una fecha",
        required,
      ),
      // minValue: helpers.withMessage('La fecha mínima es al día siguiente', (value) => {
      //   return (
      //     new Date(value as Date).toLocaleString('es-MX', dateOptions) >
      //     new Date().toLocaleString('es-MX', dateOptions)
      //   );
      // }),
    },
    clientCompany: {
      required: helpers.withMessage("Este campo es obligatorio", required),
    },
    clientName: {
      required: helpers.withMessage("Este campo es obligatorio", required),
    },
    clientEmail: {
      required: helpers.withMessage("Este campo es obligatorio", required),
      email: helpers.withMessage("Formato inválido", email),
    },
    clientEmail2: {
      email: helpers.withMessage("Formato inválido", email),
    },
    paymentTerms: {
      minValue: helpers.withMessage("Este campo es obligatorio", minValue(1)),
    },
    paymentType: {
      required: helpers.withMessage("Este campo es obligatorio", required),
    },
    notes: {
      maxLength: helpers.withMessage(
        "Solo se permite hasta 2500 caracteres",
        maxLength(2500),
      ),
    },
  };
});
const v$ = useVuelidate(rules, invoiceObject as any);

// Status button
const statusModal = ref(false);
function changeStatusModal() {
  statusModal.value = true;
}

function changeStatus(status: string) {
  invoiceObject.status = status;
  statusModal.value = false;
}

function addNewInvoiceItem() {
  if (invoiceObject.invoiceItems.length === 5) {
    return;
  }
  invoiceObject.invoiceItems.push({
    itemId: uid(2),
    itemName: "",
    itemDescription: "",
    condition: "N/A",
    qty: 1,
    partNo: "",
    price: 0,
    total: 0,
  });
}

const deleteInvoiceItem = (id: string) => {
  invoiceObject.invoiceItems = invoiceObject.invoiceItems.filter(
    (item) => item.itemId !== id,
  );
};

// Totals processing

const invoiceSubtotal = computed(() => {
  let sum = 0;
  for (let i = 0; i < invoiceObject.invoiceItems.length; i++) {
    sum += Number(
      invoiceObject.invoiceItems[i].price * invoiceObject.invoiceItems[i].qty,
    );
  }
  return sum;
});

const invoiceTax = computed(() => {
  return invoiceSubtotal.value * 0.16;
});

const invoiceTotal = computed(() => {
  return invoiceSubtotal.value + invoiceTax.value;
});

function toggleModal() {
  const html = document.querySelector("html");
  if (html) html.style.overflowY = "hidden";
  backBtn.value?.click();
}

async function uploadInvoice() {
  const { newInvoice } = await useInvoice();
  await newInvoice({
    ...invoiceObject,
    invId: invoiceObject.invId.toString(),
    invoiceSubtotal: invoiceSubtotal.value,
    invoiceTax: invoiceTax.value,
    invoiceTotal: invoiceTotal.value,
  });
}

const toast = useToast();
const buttonLoading = ref(false);
async function onSubmit(event: FormSubmitEvent<any>) {
  buttonLoading.value = true;

  if (props.edit) {
    const { updateInvoiceOnDb } = await useInvoice();
    // updateInvoice

    sessionStorage.clear();
    await updateInvoiceOnDb({
      ...invoiceObject,
      invoiceSubtotal: invoiceSubtotal.value,
      invoiceTax: invoiceTax.value,
      invoiceTotal: invoiceTotal.value,
    });
    // router.back();

    toast.add({ title: "Cotización actualizada" });
    return navigateTo(`/cotizaciones/${invoiceObject.invId}`);
  }
  setTimeout(async () => {
    await uploadInvoice();
    buttonLoading.value = false;
    toast.add({ title: "Cotización creada" });
    await navigateTo(`/cotizaciones/${invoiceObject.invId}`);
  }, 1000);
}

const modal = useModal();
function discardInvoice() {
  modal.open(DiscardModal, {});
}

const options2 = ["Borrador", "Pendiente", "Vendida", "Cancelada"];

const options = [
  { id: 1, name: "Borrador", color: "gray" },
  { id: 2, name: "Pendiente", color: "yellow" },
  { id: 3, name: "Vendida", color: "green" },
  { id: 4, name: "Cancelada", color: "red" },
];

const validate = (state: any): FormError[] => {
  const errors = [];
  if (state.clientCompany === "Elige un cliente")
    errors.push({
      path: "clientCompany",
      message: "Este campo es obligatorio",
    });
  if (!state.clientName)
    errors.push({ path: "clientName", message: "Este campo es obligatorio" });
  if (!state.clientEmail)
    errors.push({ path: "clientEmail", message: "Este campo es obligatorio" });
  if (!state.eta)
    errors.push({ path: "eta", message: "Este campo es obligatorio" });

  state.invoiceItems.forEach((item: any, index: any) => {
    if (!item.itemName)
      errors.push({
        path: `invoiceItems[${index}].itemName`,
        message: "Este campo es obligatorio",
      });
  });

  return errors;
};

const submitButtonLabel = computed(() => {
  if (props.edit) {
    return "Actualizar Cotización";
  }
  if (props.edit && buttonLoading.value) {
    return "Actualizando...";
  }
  if (buttonLoading.value) {
    return "Creando...";
  }
  return "Crear Cotización";
});
</script>

<template>
  <div
    class="container relative h-full rounded-xl border border-gray-200 bg-white p-4 transition-all dark:border-dark-medium dark:bg-dark-strong lg:w-full lg:max-w-4xl"
  >
    <UForm
      :validate="validate"
      :validate-on="['submit']"
      :state="invoiceObject"
      @submit="onSubmit"
      class="relative w-full"
    >
      <h1
        class="text-primary w-fit border-b-2 border-gray-800 text-2xl dark:border-gray-200"
      >
        {{ invoiceTitle }}
      </h1>

      <div class="mb-2 mt-8 flex flex-col">
        <h4
          class="dark:text-dark-primary border-primary mb-2 w-fit border-b text-lg font-bold text-gray-800 dark:text-gray-200"
        >
          Datos generales
        </h4>

        <div class="flex w-full gap-4">
          <!-- Empresa -->
          <UFormGroup
            class="mb-4 w-1/2 lg:w-3/4"
            label="Empresa"
            name="clientCompany"
          >
            <USelectMenu
              clear-search-on-close
              searchable
              searchable-placeholder="Escribe nombre del cliente..."
              placeholder="Elige un cliente"
              :options="filteredContacts"
              creatable
              option-attribute="clientCompany"
              value-attribute="clientCompany"
              v-model="invoiceObject.clientCompany"
              class="border-primary"
            >
              <template #empty> Sin resultados </template>

              <template #option-empty="{ query }">
                No se encontró <q>{{ query }}</q>
              </template>

              <template #option-create="{ option: company }">
                <span class="flex-shrink-0">Crear nuevo:</span>

                <span class="block truncate" @click="createContact(company)">{{
                  company
                }}</span>
              </template>
            </USelectMenu>
          </UFormGroup>

          <UFormGroup label="Etapa" class="w-1/2 lg:w-1/3">
            <USelectMenu
              v-model="invoiceObject.status"
              :options="options"
              option-attribute="name"
              value-attribute="name"
            >
              <template #option="{ option }">
                <span
                  class="h-2 w-2 rounded-full"
                  :class="`bg-${option.color}-500 dark:bg-${option.color}-400`"
                ></span>
                <span class="truncate">{{ option.name }}</span>
              </template>
            </USelectMenu>
          </UFormGroup>
        </div>

        <div class="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
          <UFormGroup label="Fecha" name="invoiceDate">
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton
                icon="i-heroicons-calendar-days-20-solid"
                :label="format(invoiceObject.invoiceDate, 'd MMM, yyy')"
                color="gray"
                class="w-full"
              />

              <template #panel="{ close }">
                <DatePicker
                  v-model="invoiceObject.invoiceDate"
                  @close="close"
                />
              </template>
            </UPopover>
          </UFormGroup>

          <UFormGroup label="Fecha de vencimiento" name="paymentDueDate">
            <UPopover :popper="{ placement: 'bottom-start' }">
              <UButton
                icon="i-heroicons-calendar-days-20-solid"
                :label="format(invoiceObject.paymentDueDate, 'd MMM, yyy')"
                color="gray"
                class="w-full"
              />

              <template #panel="{ close }">
                <DatePicker
                  v-model="invoiceObject.paymentDueDate"
                  @close="close"
                />
              </template>
            </UPopover>
          </UFormGroup>

          <UFormGroup label="Tiempo de entrega" name="eta">
            <UInput v-model="invoiceObject.eta" />
          </UFormGroup>
        </div>

        <!-- Currency -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <div class="flex flex-col">
            <label for="currencyType" class="dark:text-light-strong"
              >Moneda</label
            >
            <USelectMenu
              v-model="invoiceObject.currencyType"
              :options="['MX', 'USD']"
            />
          </div>
          <div class="flex flex-col">
            <label for="exchangeCost" class="dark:text-light-strong"
              >Tipo de cambio</label
            >

            <UInput
              v-model="invoiceObject.exchangeCost"
              :disabled="invoiceObject.currencyType === 'MX'"
              type="number"
              :title="
                invoiceObject.currencyType === 'MX'
                  ? 'Este campo se habilita cuando el tipo de moneda es USD'
                  : ''
              "
            />
          </div>
          <div class="flex flex-col">
            <label for="exchangeCost" class="dark:text-light-strong"
              >Tipo de cambio</label
            >

            <USelectMenu
              v-model="invoiceObject.paymentType"
              :options="['Contado', 'Crédito']"
            />
          </div>
        </div>

        <UDivider class="my-4" />

        <!-- Contactos -->
        <h4
          class="dark:text-dark-primary border-primary mb-2 w-fit border-b text-lg font-bold text-gray-800 dark:text-gray-200"
        >
          Contactos
        </h4>
        <div class="mb-4 flex w-full gap-4 lg:gap-8">
          <div class="mb-2 w-1/2">
            <h5 class="text-primary dark:text-dark-primary mb-2 w-fit">
              Contacto 1
            </h5>

            <section class="flex flex-col gap-2">
              <UFormGroup label="Nombre" name="clientName">
                <UInput
                  v-model="invoiceObject.clientName"
                  placeholder="Escribe aquí..."
                />
              </UFormGroup>
              <UFormGroup label="Correo electrónico" name="clientEmail">
                <UInput
                  v-model="invoiceObject.clientEmail"
                  type="email"
                  placeholder="Escribe aquí..."
                />
              </UFormGroup>
            </section>
          </div>
          <div class="mb-2 w-1/2">
            <h5 class="text-primary dark:text-dark-primary mb-2 w-fit">
              Contacto 2
            </h5>

            <section class="flex flex-col gap-2">
              <UFormGroup label="Nombre" name="clientName2">
                <UInput
                  v-model="invoiceObject.clientName2"
                  placeholder="Escribe aquí..."
                />
              </UFormGroup>
              <UFormGroup label="Correo electrónico" name="clientEmail2">
                <UInput
                  v-model="invoiceObject.clientEmail2"
                  type="email"
                  placeholder="Escribe aquí..."
                />
              </UFormGroup>
            </section>
          </div>
        </div>

        <!-- <div class="divider"></div> -->
        <UDivider />

        <div class="flex flex-col">
          <div class="mt-4 hidden lg:block">
            <h3
              class="dark:text-dark-primary border-primary mb-2 w-fit border-b text-lg font-bold text-gray-800 dark:text-gray-200"
            >
              Artículos
            </h3>
            <table class="w-full">
              <thead>
                <tr
                  class="mb-4 flex w-full gap-4 text-left text-dark-medium dark:text-light-medium"
                >
                  <th class="item-name w-3/12">Nombre</th>
                  <th class="w-4/12">Descripción</th>
                  <th class="qty w-1/12">Ctd</th>
                  <th class="price w-2/12">Precio</th>
                  <th class="total w-2/12 text-center">Total</th>
                </tr>
              </thead>
              <TransitionGroup
                name="list"
                tag="tbody"
                class="mb-4 flex w-full flex-col gap-4"
                appear
              >
                <tr
                  class="table-items relative flex items-start gap-2 lg:gap-4"
                  v-for="(item, index) in invoiceObject.invoiceItems"
                  :key="item.itemId"
                >
                  <td class="w-3/12">
                    <UFormGroup :name="`invoiceItems[${index}].itemName`">
                      <UInput
                        type="text"
                        v-model.trim="item.itemName"
                        placeholder="Escribe aqui..."
                      />
                    </UFormGroup>
                  </td>
                  <td class="relative w-4/12">
                    <div class="form-control relative">
                      <UInput
                        type="text"
                        placeholder="Escribe aqui..."
                        :style="{ paddingRight: '2rem' }"
                        v-model.trim="item.itemDescription"
                      />
                    </div>
                  </td>
                  <td class="w-1/12">
                    <UInput type="number" v-model="item.qty" />
                  </td>
                  <td class="relative w-2/12">
                    <UInput
                      icon="i-heroicons-currency-dollar"
                      size="sm"
                      color="white"
                      :trailing="false"
                      type="number"
                      v-model="item.price"
                      :ui="{ icon: { base: 'text-primary dark:text-primary' } }"
                    />
                  </td>
                  <td
                    class="text-primary flex h-10 w-2/12 items-center justify-end pr-4"
                  >
                    {{
                      new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      }).format((item.total = item.qty * item.price))
                    }}
                  </td>
                  <td
                    class="absolute -top-5 right-0"
                    v-if="invoiceObject.invoiceItems.length > 1"
                  >
                    <Icon
                      @click="deleteInvoiceItem(item.itemId)"
                      class="m-auto cursor-pointer text-base"
                      title="Borrar artículo"
                      name="icon-park-outline:delete"
                    />
                  </td>
                </tr>
              </TransitionGroup>
            </table>

            <UButton
              @click="addNewInvoiceItem"
              class="btn-secondary btn dark:border-dark-secondary dark:bg-dark-secondary mx-auto flex w-fit gap-2 text-white"
              icon="i-heroicons-plus-20-solid"
            >
              Agregar artículo
            </UButton>

            <!-- </div> -->
          </div>
          <UDivider class="my-4" />
          <section class="lg:hidden print:hidden">
            <h3
              class="text-primary dark:text-primary/50 mb-4 w-fit border-b border-dark-medium text-lg font-bold dark:border-light-medium"
            >
              Artículos
            </h3>
            <div class="rounded-box flex max-w-md flex-col">
              <div class="flex flex-col gap-4">
                <TransitionGroup
                  tag="section"
                  class="mb-4 flex w-full flex-col gap-4"
                  name="list"
                  appear
                >
                  <UCard
                    class="relative"
                    v-for="item in invoiceObject.invoiceItems"
                    :key="item.itemId"
                  >
                    <div class="flex flex-col gap-2">
                      <UFormGroup label="Nombre">
                        <UInput
                          v-model.trim="item.itemName"
                          placeholder="Escribe aquí"
                        />
                      </UFormGroup>

                      <UFormGroup label="Descripción">
                        <UInput
                          v-model.trim="item.itemDescription"
                          placeholder="Escribe aquí"
                        />
                      </UFormGroup>

                      <UFormGroup label="Cantidad">
                        <UInput type="number" v-model.trim="item.qty" />
                      </UFormGroup>

                      <UFormGroup label="Precio">
                        <UInput
                          icon="i-heroicons-currency-dollar"
                          :trailing="false"
                          type="number"
                          v-model="item.price"
                          :ui="{
                            icon: { base: 'text-primary dark:text-primary' },
                          }"
                        />
                      </UFormGroup>

                      <div class="w-full items-center">
                        <p
                          class="text-primary flex w-full justify-end gap-2 border-light-strong bg-white dark:border-dark-medium dark:bg-dark-strong"
                        >
                          <span class="text-dark-medium dark:text-light-medium"
                            >Importe:
                          </span>
                          <span>
                            {{
                              new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                              }).format((item.total = item.qty * item.price))
                            }}</span
                          >
                        </p>
                        <div
                          class="absolute -top-2 right-0"
                          v-if="invoiceObject.invoiceItems.length > 1"
                        >
                          <UButton
                            icon="i-heroicons-trash"
                            @click="deleteInvoiceItem(item.itemId)"
                            color="red"
                          />
                          <!-- <Icon
                            @click="deleteInvoiceItem(item.itemId)"
                            class="text-primary m-auto cursor-pointer"
                            title="Borrar artículo"
                            size="32"
                            name="heroicons:trash"
                          /> -->
                        </div>
                      </div>
                    </div>
                  </UCard>
                </TransitionGroup>
              </div>
            </div>

            <UButton
              type="button"
              @click="addNewInvoiceItem"
              class="btn-secondary btn dark:border-dark-secondary dark:bg-dark-secondary mx-auto mt-4 flex w-fit gap-2 text-white"
              icon="i-heroicons-plus-20-solid"
            >
              Agregar artículo
            </UButton>
          </section>

          <section class="form-control mb-4 flex flex-col">
            <h3
              class="dark:text-dark-primary border-primary mb-2 w-fit border-b text-lg font-bold text-gray-800 dark:text-gray-200"
            >
              Notas
            </h3>
            <UTextarea
              id="notes"
              v-model="invoiceObject.notes"
              maxlength="2500"
              placeholder="Escribe aquí..."
            ></UTextarea>
            <label class="label">
              <span
                v-if="v$.notes.$error"
                class="label-text-alt text-red-500"
                >{{ v$.notes.$errors[0].$message }}</span
              >
            </label>
          </section>

          <section class="mb-4 flex flex-col gap-2">
            <div class="flex w-full justify-end gap-4 pr-4 font-bold">
              <p class="text-primary dark:text-dark-primary">Subtotal:</p>
              <p class="text-dark-medium dark:text-light-medium">
                {{
                  new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(invoiceSubtotal)
                }}
              </p>
            </div>
            <div class="flex w-full justify-end gap-4 pr-4 font-bold">
              <p class="text-primary dark:text-dark-primary">Impuestos:</p>
              <p class="text-dark-medium dark:text-light-medium">
                {{
                  new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(invoiceTax)
                }}
              </p>
            </div>
            <div class="flex w-full justify-end gap-4 pr-4 font-bold">
              <p class="text-primary dark:text-dark-primary">Total:</p>
              <p class="text-dark-medium dark:text-light-medium">
                {{
                  new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(invoiceTotal)
                }}
              </p>
            </div>
          </section>

          <div class="flex justify-end gap-2 md:flex-col lg:flex-row">
            <UButton
              type="button"
              color="gray"
              variant="ghost"
              @click="discardInvoice"
              class="w-fit"
            >
              <span>Cancelar</span>
            </UButton>
            <UButton
              icon="i-heroicons-document-text"
              type="submit"
              :loading="buttonLoading"
              :label="submitButtonLabel"
              class="w-fit"
            />
          </div>
        </div>
      </div>
    </UForm>
  </div>
</template>

<style>
label {
  @apply mb-1 text-xs text-dark-medium dark:text-light-medium;
}
</style>
