interface CartProduct {
  id: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    images: { id: number; image: string }[];
    stock: number;
    unit_of_measure: string;
    date_of_registration: string;
    state: string;
    producer: number;
    category: number[];
  };
  quantity: number;
}
