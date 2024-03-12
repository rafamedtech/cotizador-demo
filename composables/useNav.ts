export function useNav() {
  const navLinks = ref([
    {
      label: 'Inicio',
      icon: 'i-heroicons-home',
      to: '/',
    },
    {
      label: 'Cotizaciones',
      icon: 'i-heroicons-clipboard-document-list',
      to: '/cotizaciones',
    },
    {
      label: 'Acerca de',
      icon: 'i-heroicons-information-circle',
      to: '/acerca',
    },
  ]);
  return { navLinks };
}
