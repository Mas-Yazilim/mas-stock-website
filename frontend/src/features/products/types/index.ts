export interface Product {
  _id: string
  name: string
  brand: string
  model: string
  storage: string
  category: string
  colors: ProductColor[]
  cashPrice: number
  visaPrice: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductColor {
  name: string
  hex: string
  available: boolean
}

export interface Category {
  id: string
  name: string
  products: Product[]
}
