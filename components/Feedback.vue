<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
const modal = useModal();

const formData = reactive({
  name: "",
  email: "",
  message: "",
});

const toast = useToast();
const buttonLoading = ref(false);
function onSubmit(event: FormSubmitEvent<any>) {
  buttonLoading.value = true;

  setTimeout(() => {
    buttonLoading.value = false;
    modal.close();
    toast.add({
      title: "Mensaje enviado",
      description: "Te responderemos lo más pronto posible",
      icon: "i-heroicons-check-circle",
    });
  }, 1000);
}

const validate = (state: any): FormError[] => {
  const errors = [];

  if (!state.name)
    errors.push({ path: "name", message: "Este campo es obligatorio" });
  if (!state.email)
    errors.push({ path: "email", message: "Este campo es obligatorio" });
  if (!state.message)
    errors.push({ path: "message", message: "Este campo es obligatorio" });

  return errors;
};
</script>

<template>
  <UModal prevent-close>
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Ayuda
          </h3>
          <Icon
            name="heroicons:question-mark-circle"
            size="28"
            class="text-primary"
          />
        </div>
      </template>

      <div class="flex flex-col">
        <UForm
          @submit="onSubmit"
          :state="formData"
          :validate="validate"
          :validate-on="['submit']"
        >
          <div class="flex flex-col gap-4">
            <UFormGroup label="Tu nombre" name="name">
              <UInput
                label="Nombre"
                placeholder="Ej. Juan Pérez"
                v-model="formData.name"
              />
            </UFormGroup>
            <UFormGroup label="Tu correo electrónico" name="email">
              <UInput
                label="Email"
                placeholder="Ej. tucorreo@correo.com"
                v-model="formData.email"
              />
            </UFormGroup>
            <UFormGroup label="Mensaje" name="message">
              <UTextarea
                label="Mensaje"
                placeholder="Escribe aquí tu mensaje"
                v-model="formData.message"
              />
            </UFormGroup>
          </div>
          <div class="mt-4 flex justify-end gap-2">
            <UButton
              label="Cancelar"
              color="gray"
              @click="modal.close()"
              type="button"
            />
            <UButton
              :label="buttonLoading ? 'Enviando...' : 'Enviar'"
              icon="i-heroicons-envelope"
              color="primary"
              type="submit"
              :loading="buttonLoading"
            />
          </div>
        </UForm>
      </div>
    </UCard>
  </UModal>
</template>
