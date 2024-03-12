<script setup lang="ts">
import { appInfo } from '@/services/appInfo';

const { logo } = appInfo;
</script>

<template>
  <div class="flex items-center gap-2 rounded-lg">
    <img :src="logo" alt="Restaurant logo" class="w-20 hidden" />
    <h1 class="text-3xl font-bold text-primary">Mi Logo</h1>
  </div>
</template>
