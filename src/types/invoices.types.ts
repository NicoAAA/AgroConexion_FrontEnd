interface InvoiceDetail {
  product_name: string;
  seller_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

interface Invoice {
  id: number;
  date_created: string;
  method: string;
  total: string;
  details: InvoiceDetail[];
}