<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
const user = useSupabaseUser();

const { userLogin } = useAuth();

const store = useStore();
const { isLoading, isLoadingFull } = storeToRefs(store);
onBeforeMount(() => {
  isLoadingFull.value = false;
});

const formData = reactive({
  email: "",
  password: "",
});

const validate = (state: any): FormError[] => {
  const errors = [];

  if (!state.email)
    errors.push({ path: "email", message: "Este campo es obligatorio" });
  if (!state.password)
    errors.push({ path: "password", message: "Este campo es obligatorio" });

  return errors;
};

const submitForm = (event: FormSubmitEvent<any>) => {
  isLoading.value = true;

  setTimeout(async () => {
    await userLogin(formData);
    isLoading.value = false;
  }, 1000);
};

watchEffect(async () => {
  if (user.value) {
    await navigateTo("/", { replace: true });
  }
});

useHead({
  title: "Iniciar sesión | Cotizador",
});

definePageMeta({
  layout: false,
});
</script>

<template>
  <main class="min-h-screen overflow-x-hidden dark:bg-dark-medium">
    <section
      class="mx-auto flex flex-col flex-wrap items-center justify-center px-5 py-24 text-gray-400 lg:gap-8"
    >
      <UForm
        @submit="submitForm"
        :state="formData"
        :validate="validate"
        :validate-on="['submit']"
        class="bg-opacity-50 mt-10 flex w-full max-w-sm flex-col items-center rounded-[20px] border border-light-strong bg-white p-8 dark:border-dark-medium dark:bg-dark-strong md:mt-0"
      >
        <Logo />
        <figure class="rounded-xl p-4">
          <!-- <img src="@/assets/images/logo-rosa-cropped.png" alt="" class="w-20 lg:w-32" /> -->
        </figure>
        <div class="flex w-full flex-col">
          <h2
            class="border-primary mx-auto mb-5 border-b-2 text-lg font-medium text-dark-medium dark:text-light-strong"
          >
            Iniciar sesión
          </h2>

          <section class="mb-4 flex flex-col gap-4">
            <UFormGroup label="Email" name="email">
              <UInput
                v-model="formData.email"
                type="email"
                id="email"
                placeholder="Ej. correo@ejemplo.com"
                autocomplete="off"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup label="Contraseña" name="password">
              <UInput
                v-model="formData.password"
                type="password"
                id="password"
                size="lg"
              />
            </UFormGroup>
          </section>

          <UButton
            :loading="isLoading"
            label="Iniciar sesión"
            type="submit"
            class="mx-auto w-fit"
          />
        </div>
      </UForm>
    </section>
  </main>
</template>
