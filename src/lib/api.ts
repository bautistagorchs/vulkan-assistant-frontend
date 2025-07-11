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

export const testPost = async (body: any) => {
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
