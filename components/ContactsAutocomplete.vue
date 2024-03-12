<script setup lang="ts">
const { contacts } = defineProps<{
  contacts: Contact[];
}>();
</script>

<template>
  <div class="relative w-full">
    <ul
      class="dropdown-content menu min-h-12 top-0 flex w-full overflow-scroll rounded-[10px] border border-light-strong bg-white p-2 shadow-lg dark:border-dark-medium dark:bg-dark-medium dark:text-light-strong lg:flex-col"
    >
      <span class="py-2 pl-2 italic text-primary">Clientes disponibles</span>
      <li
        class="w-full cursor-pointer text-dark-medium hover:text-primary dark:text-light-medium"
        v-for="filteredContact in contacts"
        :key="filteredContact.id"
      >
        <button type="button" @click="setContact(filteredContact.clientCompany)">
          {{ filteredContact.clientCompany }}
        </button>
      </li>
    </ul>
  </div>
</template>
