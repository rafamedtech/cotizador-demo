// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/supabase",
    "nuxt-icon",
  ],

  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },

  supabase: {
    redirect: false,
  },
});
