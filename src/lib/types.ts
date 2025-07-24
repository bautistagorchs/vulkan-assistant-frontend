export interface Product {
  id: number;
  name: string;
  price: number;
  stockKg: number;
}
export interface Product {
  id: number;
  name: string;
  basePrice: number;
  active: boolean;
  hasStock?: boolean;
}
export interface Box {
  id: number;
  productId: number;
  kg: number;
  isRefrigerated: boolean;
  isFrozen: boolean;
}

export interface Client {
  id: number;
  name: string;
  email: string;
}

export interface OrderItem {
  productId: number;
  boxIds: number[];
  totalKg: number;
  subtotal: number;
}

export interface BoxSelectorProps {
  productId: number;
  productName: string;
  onBoxesSelected: (productId: number, selectedBoxes: Box[]) => void;
  onCancel: () => void;
}

export interface Order {
  id: number;
  clientId: number;
  items: OrderItem[];
  date: string;
  total: number;
}

export type TabKey = "nuevo" | "listado";

export interface SelectedProduct {
  productId: number;
  productName: string;
  selectedBoxes: Box[];
  totalKg: number;
}

export interface UploadResponse {
  success: boolean;
  fileName: string;
  message: string;
  results?: {
    products: Array<{
      name: string;
      basePrice: number;
      previousPrice?: number;
      boxesLoaded: number;
    }>;
    productSummary: Array<{
      name: string;
      previousPrice: number | null;
      newPrice: number;
      boxesLoaded: number;
    }>;
    boxes: Array<{
      productName: string;
      kg: number;
      isFrozen: boolean;
    }>;
    productsUpdated: number;
    productsCreated: number;
    boxesCreated: number;
    totalProducts: number;
    totalBoxes: number;
    [key: string]: unknown;
  };
  totalItems?: number;
}
