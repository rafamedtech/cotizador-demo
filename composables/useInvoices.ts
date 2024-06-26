import type { InvoiceOutline, InvoiceWithItems } from '@/types/invoice';

export const useInvoices = async () => {
  const invoices = ref<InvoiceOutline[] | null | InvoiceWithItems[]>([]);

  async function getInvoices() {
    const store = useStore();
    const { contactData } = storeToRefs(store);
    const data = await useFetchWithCache<InvoiceWithItems[]>('/api/invoices');
    // const { data, error } = await useFetch<InvoiceOutline[]>('/api/invoices');

    invoices.value = data.value as InvoiceWithItems[];

    invoices.value.forEach((invoice: InvoiceWithItems) => {
      contactData.value.push({
        clientCompany: invoice.clientCompany,
        clientName: invoice.clientName,
        clientName2: invoice.clientName2,
        clientEmail: invoice.clientEmail,
        clientEmail2: invoice.clientEmail2,
      } as Contact);
    });
  }

  await getInvoices();

  return {
    invoices,
    getInvoices,
  };
};
