import axios from "axios";

// =============================================
// PRODUCTOS
// =============================================

export const getProducts = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`
  );
  return res.data;
};

// Alias para compatibilidad con código existente
export const getAllProducts = async () => {
  return getProducts();
};

export const getProductById = async (productId: number) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/id/${productId}`
  );
  return res.data;
};

export const getBoxesByProductId = async (productId: number) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/boxes`
  );
  return res.data;
};

export const createProduct = async (data: {
  name: string;
  basePrice: number;
}) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const updateProduct = async (
  id: number,
  data: {
    name?: string;
    basePrice?: number;
    active?: boolean;
  }
) => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const deleteProduct = async (id: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
    {
      data: { confirm: true },
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};

export const deleteAllProducts = async () => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/all`,
    {
      data: { confirm: true },
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};

// =============================================
// STOCK Y CAJAS
// =============================================

export const getStock = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/stock`
  );
  return res.data;
};

export const addBoxToProduct = async (
  productId: number,
  data: {
    kg: number;
    isFrozen: boolean;
  }
) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/boxes`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const updateBox = async (
  id: number,
  data: {
    kg?: number;
    isFrozen?: boolean;
  }
) => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/boxes/${id}`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const deleteBox = async (id: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/boxes/${id}`
  );
  return res.data;
};

export const deleteAllStock = async () => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/stock/all`,
    {
      data: { confirm: true },
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};

// =============================================
// CLIENTES
// =============================================

export const getClients = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`);
  return res.data;
};

export const getClientById = async (id: number) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/clients/${id}`
  );
  return res.data;
};

export const createClient = async (client: {
  name: string;
  cuit: string;
  direccion?: string;
  localidad?: string;
  telefono?: string;
  condicionIVA: string;
  email?: string;
  notas?: string;
}) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/clients`,
    client,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const updateClient = async (
  id: number,
  data: {
    name?: string;
    cuit?: string;
    direccion?: string;
    localidad?: string;
    telefono?: string;
    condicionIVA?: string;
    email?: string;
    notas?: string;
  }
) => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/api/clients/${id}`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const deleteClient = async (id: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/api/clients/${id}`,
    {
      data: { confirm: true },
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};

export const deleteAllClients = async () => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/api/clients/all`,
    {
      data: { confirm: true },
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};

// =============================================
// PEDIDOS
// =============================================

export const getOrders = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`);
  return res.data;
};

export const createOrder = async (
  clientId: number,
  items: { productId: number; boxIds: number[] }[]
) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/new`,
    {
      clientId,
      items,
    },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// =============================================
// FACTURAS
// =============================================

export const getInvoices = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/invoices`
  );
  return res.data;
};

export const getInvoiceById = async (id: number) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${id}`
  );
  return res.data;
};

export const getInvoicesByStatus = async (
  status: "PENDING" | "CHEQUE" | "PAID"
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/by-status/${status}`
  );
  return res.data;
};

export const updateInvoicePaymentStatus = async (
  id: number,
  paymentStatus: "PENDING" | "CHEQUE" | "PAID"
) => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${id}/payment-status`,
    { paymentStatus },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// =============================================
// SUBIDA DE LISTAS
// =============================================

export const uploadJsonPriceList = async (jsonData: unknown) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload/upload-boxes-json`,
    {
      data: jsonData,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
};

export const confirmUpload = async (dataToConfirm: { data: unknown }) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload/confirm-boxes-json`,
    dataToConfirm,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// =============================================
// FUNCIONES LEGACY (para compatibilidad)
// =============================================

// Mantener para compatibilidad con código existente
export const testPost = async (body: unknown) => {
  return createProduct(body as { name: string; basePrice: number });
};
