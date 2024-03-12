<script setup lang="ts">
const { type = 'text' } = defineProps<{
  type?: string;
  label?: string;
  placeholder?: string;
  isrequired?: boolean;
  modelValue?: string | number | Date | null | undefined;
}>();

const handleInputChange = (event: Event) => (event.target as HTMLInputElement).value;
</script>

<template>
  <div class="form-control gap-2">
    <label :for="label" class="dark:text-base-100"
      >{{ label }}<span v-if="isrequired" class="text-red-500">*</span></label
    >
    <input
      v-bind="$attrs"
      :value="modelValue"
      :id="label"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', handleInputChange($event))"
      :type="type"
      :required="isrequired"
      class="input input-bordered border-2 dark:text-base-100 bg-white border-base-200 dark:border-base-100/10 dark:bg-dark-strong focus:ring focus:ring-primary"
    />
  </div>
</template>
