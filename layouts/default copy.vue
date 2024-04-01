<template>
  <UContainer class="relative flex justify-between gap-4 lg:pt-0">
    <!-- <section class="hidden justify-between lg:flex"> -->
    <section class="hidden justify-between lg:flex lg:w-1/6">
      <Sidebar />
    </section>

    <div class="w-full lg:w-5/6">
      <!-- <div class="flex-auto lg:w-5/6"> -->
      <Topbar />
      <UDivider />
      <div class="min-h-screen lg:relative">
        <!-- <div
        class="min-h-screen bg-gray-100 px-4 dark:bg-[#222222] lg:relative lg:px-12"
      > -->
        <slot> </slot>
      </div>
      <BottomNavbar class="lg:hidden" />
    </div>
  </UContainer>
</template>
