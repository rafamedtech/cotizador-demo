<template>
  <main>
    <MainSection class="pt-8">
      <template #heading>
        <AppHeading title="Acerca de" />
      </template>

      <template #content>
        <UCard
          class="mx-auto grid min-h-[60vh] max-w-3xl place-content-center text-center"
        >
          <Logo />
          <span class="italic"
            >by Rafamed
            <span class="text-[10px]">{{
              new Date().getFullYear()
            }}</span></span
          >
        </UCard>
      </template>
    </MainSection>
  </main>
</template>
