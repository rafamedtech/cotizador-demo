<script lang="ts" setup>
interface Props {
  status: string;
  type?: string;
}

const { status, type } = defineProps<Props>();

const emit = defineEmits(['@modal']);

const openModal = () => {
  emit('@modal');
};

const iconName = computed((): string => {
  if (status === 'Vendida') {
    return 'icon-park-outline:check-one';
  }

  if (status === 'Borrador') {
    return 'ri:draft-line';
  }

  if (status === 'Pendiente') {
    return 'icon-park-outline:caution';
  }
  if (status === 'Cancelada') {
    return 'material-symbols:cancel-outline';
  }

  return '';
});
</script>

<template>
  <div class="form-control relative flex w-full flex-row text-[12px]">
    <button
      type="button"
      @click="openModal"
      class="btn-ghost btn flex w-32 items-center justify-center gap-1 rounded-md bg-white p-2 text-dark-medium dark:bg-transparent dark:text-light-medium"
      :class="{
        ' border-orange-500  dark:border-orange-500/50': status === 'Pendiente' && type !== 'ghost',
        ' border-green-500  dark:border-green-500/50': status === 'Vendida' && type !== 'ghost',
        ' border-red-500  dark:border-red-500/50': status === 'Cancelada' && type !== 'ghost',
        ' border-gray-400  dark:border-gray-600': status === 'Borrador' && type !== 'ghost',
      }"
    >
      <Icon
        :name="iconName"
        class="text-base"
        :class="{
          'text-orange-500  dark:border-orange-500/50': status === 'Pendiente',
          'text-green-500  dark:border-green-500/50': status === 'Vendida',
          'text-red-500  dark:border-red-500/50': status === 'Cancelada',
          'text-gray-400  dark:border-gray-600': status === 'Borrador',
        }"
      />
      {{ status }}
    </button>
  </div>
</template>
