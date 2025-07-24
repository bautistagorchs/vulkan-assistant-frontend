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

export const uploadPriceList = async (
  file: File,
  commissionPercentage: number
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("commissionPercentage", commissionPercentage.toString());
  console.log(
    "Subiendo archivo:",
    file.name,
    "con comisión:",
    commissionPercentage + "%"
  );

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload/format-excel`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

// export const uploadJsonPriceList = async (
//   file: File,
//   commissionPercentage: number
// ) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("commissionPercentage", commissionPercentage.toString());
//   console.log(
//     "Subiendo archivo JSON:",
//     file.name,
//     "con comisión:",
//     commissionPercentage + "%"
//   );
//   console.log(formData);

//   const res = await axios.post(
//     `${process.env.NEXT_PUBLIC_API_URL}/api/upload/confirm-boxes-json`,
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );
//   return res.data;
// };

export const uploadJsonPriceList = async (jsonData: unknown) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload/confirm-boxes-json`,
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

export const confirmUpload = async (uploadResponse: {
  success: boolean;
  fileName: string;
  message: string;
  data?: Record<string, unknown>;
  totalItems?: number;
}) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/upload/confirm-json-upload`,
    uploadResponse,
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
