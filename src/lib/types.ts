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
export interface Product {
  id: number;
  name: string;
  price: number;
  stockKg: number;
}

export interface ProductWithStock {
  id: number;
  name: string;
  basePrice: number;
  active: boolean;
  hasStock: boolean;
  boxes: BoxWithDetails[];
}

export interface Box {
  id: number;
  productId: number;
  kg: number;
  isRefrigerated: boolean;
  isFrozen: boolean;
}

export interface BoxWithDetails {
  id: number;
  productId: number;
  kg: number;
  isFrozen: boolean;
  entryDate?: string;
  createdAt: string;
  usedInOrderItemId: number | null;
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

export interface ConfirmationModalProps {
  uploadResponse: UploadResponse;
  originalData: any;
  availableEntryDates: string[];
  entryDateLabels: string[];
  boxEntryDates: { [key: string]: string };
  boxFrozenStatus: { [key: string]: boolean };
  onUpdateEntryDate: (index: number, newDate: string) => void;
  onAddEntryDate: () => void;
  onRemoveEntryDate: () => void;
  onBoxFrozenChange: (boxKey: string, isFrozen: boolean) => void;
  onBoxEntryDateChange: (boxKey: string, entryDate: string) => void;
  onClose: () => void;
  onError: (error: string) => void;
  onSuccess: () => void;
  getModifiedBoxes: (
    originalData: any[],
    availableEntryDates: string[]
  ) => any[];
}

// MyStock Component Types
export interface EditingItem {
  type: "product" | "box" | "newBox";
  id: number | null;
  productId?: number;
}

export interface ConfirmAction {
  type: "save" | "delete";
  data?: any;
  originalData?: any;
  itemName?: string;
}

export interface ProductEditValues {
  name: string;
  basePrice: number;
  active: boolean;
}

export interface BoxEditValues {
  kg: number;
  isFrozen: boolean;
}

export type EditValues =
  | ProductEditValues
  | BoxEditValues
  | Record<string, any>;
