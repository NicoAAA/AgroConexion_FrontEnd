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
  imageUrl: string;
   defaultFavorite?: boolean
}

export interface Product {
  id: number;
  name: string;
  description: string
  stock: number
  price: number;
  images: { id: number; image: string }[];
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