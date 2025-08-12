import axios from "axios";

export const getProducts = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`
  );
  return res.data;
};

export const getClients = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/clients`);
  return res.data;
};

export const testPost = async (body: unknown) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    body,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const createOrder = async (
  clientId: number,
  items: { productId: number; boxes: number; unitPrice: number }[]
) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
    {
      clientId,
      items,
    },
    { headers: { "Content-Type": "application/json" } }
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

export const getAllProducts = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/get-all`
  );
  return res.data;
};

export const getProductById = async (productId: number) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/get-by-id/${productId}`
  );
  return res.data;
};

export const getBoxesByProductId = async (productId: number) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/get-boxes/${productId}`
  );
  return res.data;
};

export const createOrderWithBoxes = async (
  clientId: number,
  items: { productId: number; boxIds: number[] }[]
) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/with-boxes`,
    {
      clientId,
      items,
    },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

// Stock API
export const getStock = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/stock`);
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/stock/products/${id}`,
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/stock/boxes/${id}`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};

export const deleteBox = async (id: number) => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stock/boxes/${id}`
  );
  return res.data;
};

export const deleteAllStock = async () => {
  const res = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stock/all`
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/stock/products/${productId}/boxes`,
    data,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
};
