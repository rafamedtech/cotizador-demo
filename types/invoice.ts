import type { Invoice, InvoiceItem } from "@prisma/client";

export type InvoiceWithItems = Invoice & {
  invoiceItems: InvoiceItem[];
};

export interface InvoiceOutline {
  invId: string;
  invoiceDate: string;
  clientCompany: string;
  invoiceTotal: number;
  status: string;
  clientName: string;
  clientName2: string;
  clientEmail: string;
  clientEmail2: string;
}

export interface InvoiceDraft {
  id?: number;
  invId: string;
  clientCompany: string;
  clientName: string;
  clientName2?: string | null;
  clientEmail: string;
  clientEmail2?: string | null;
  currencyType: string;
  exchangeCost: number;
  eta: string;
  invoiceDate: number | Date;
  paymentDueDate: number | Date;
  paymentType: string;
  notes: string;
  invoiceSubtotal?: number;
  invoiceTax?: number;
  invoiceTotal?: number;
  status: string;
  invoiceItems: InvoiceItems[];
}

export interface InvoiceItems {
  itemId: string;
  itemName: string | null;
  itemDescription?: string | string[] | number;
  condition: string;
  qty: number;
  partNo: string | null;
  price: number;
  total: number;
}

export type SelectedStatus = {
  key: string;
  label: string;
  value: boolean;
};
