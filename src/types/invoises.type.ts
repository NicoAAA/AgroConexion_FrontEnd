interface Detail {
  product_name: string;
  seller_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

interface Invoice {
  id: number;
  method: string;
  total: string;
  date_created: string;
  details: Detail[];
}