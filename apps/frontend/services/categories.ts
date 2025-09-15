import axios from "axios";

export interface Category {
  id: string;
  name: Record<string, string>;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get(backendUrl + "/categories");
  return data;
};

export const createCategory = async (
  name: Record<string, string>
): Promise<Category> => {
  const { data } = await axios.post(backendUrl + "/categories", { name });
  return data;
};

export const updateCategory = async (
  id: string,
  name: Record<string, string>
): Promise<Category> => {
  const { data } = await axios.put(`${backendUrl}/categories/${id}`, { name });
  return data;
};

export const deleteCategory = async (id: string) => {
  await axios.delete(`${backendUrl}/categories/${id}`);
};
