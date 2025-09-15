export interface Categories{
  id: number
  name: string
  description: string
}

export interface ProductCardProps {
  id:number
  name: string;
  description: string
  price: number;
  unit_of_measure?: string
  imageUrl: string;
  defaultFavorite?: boolean
}

export interface Product {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  unit_of_measure?: string;
  offers: Offert | null;   // 👈 ya no array
  coupon: Coupon | null;  // 👈 ya no array
  images: { id: number; image: string }[];
  category: number[];
  date_of_registration: string;
  producer: number;
  state: string;
}

export interface UnitOfMeasure{
  value:string, 
  label:string
}

export interface Image {
  image: string
}

export interface CategoryProducs{
  id: number
  name: string
  description: string
  products: NewProduct[]
}

export interface NewProduct {
  name: string
  description: string
  price: number
  stock: number
  unit_of_measure: UnitOfMeasure[]
  images: Image[]
  category: CategoryProducs[]
}

export type ImageProducsTop = {
    id: number
    image: string
}

export type TopProducts = {
    id: number
    name: string
    description: string
    price: number
    stock: number
    unit_of_measure: string
    date_of_registration: string
    state: string
    images:  ImageProducsTop[]
}

export type Offert = {
  id: number;
  title: string;
  description: string;
  percentage: string;  // Nota: viene como string de la API
  start_date: string;
  end_date: string;
}

export type Coupon = {
  id: number;
  code?: string;  // Puede no tener código según los datos
  description: string;
  percentage: string;  // Viene como string de la API
  min_purchase_amount: string;  // Viene como string de la API
  start_date: string;
  end_date: string;
}