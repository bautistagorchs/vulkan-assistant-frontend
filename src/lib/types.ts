export interface Product {
  id: number;
  name: string;
  price: number;
  stockKg: number;
}

export interface Client {
  id: number;
  name: string;
  email: string;
}

export interface OrderItem {
  productId: number;
  quantityBoxes: number;
  totalKg: number;
  subtotal: number;
}

export interface Order {
  id: number;
  clientId: number;
  items: OrderItem[];
  date: string;
  total: number;
}
