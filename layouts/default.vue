<template>
  <main class="relative flex w-full justify-between lg:pt-0">
    <section class="hidden justify-between lg:flex lg:w-1/6">
      <Sidebar />
    </section>

    <div class="flex-auto transition-all lg:w-5/6">
      <Topbar />
      <div
        class="min-h-screen bg-gray-100 px-4 transition-colors dark:bg-[#222222] lg:relative lg:px-12"
      >
        <slot> </slot>
      </div>
      <BottomNavbar class="lg:hidden" />
    </div>
  </main>
</template>
