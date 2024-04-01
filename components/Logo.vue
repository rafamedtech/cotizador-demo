<script setup lang="ts">
import { appInfo } from "@/services/appInfo";

const { logo } = appInfo;
</script>

<template>
  <div class="flex items-center gap-2 rounded-lg">
    <img :src="logo" alt="Restaurant logo" class="hidden w-20" />
    <Icon
      name="heroicons:clipboard-document-list"
      class="text-4xl text-dark-medium dark:text-gray-200 md:text-5xl print:dark:text-dark-medium"
    />
    <h1 class="text-primary text-3xl font-bold">Cotizador</h1>
  </div>
</template>
