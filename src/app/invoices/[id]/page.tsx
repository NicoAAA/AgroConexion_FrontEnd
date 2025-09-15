// src/app/invoices/[id]/page.tsx
import InvoicePageClient from "@/components/invoices/DetailInvoices"

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params   // 👈 desempaquetamos la promesa
  return <InvoicePageClient id={id} />
}
