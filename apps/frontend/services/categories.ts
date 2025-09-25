import { apiClient } from "@/utils/apiClient";

export interface Category {
  id: string;
  name: Record<string, string>;
}

export const getCategories = async (): Promise<Category[]> => {
  return apiClient.get<Category[]>("/categories");
};

export const getCategory = async(id:string):Promise<Category>=>{
  return apiClient.get<Category>(`/categories/${id}`);
}

export const createCategory = async (
  name: Record<string, string>
): Promise<Category> => {
  return apiClient.post<Category>("/categories", { name });
};

export const updateCategory = async (
  id: string,
  name: Record<string, string>
): Promise<Category> => {
  return apiClient.put<Category>(`/categories/${id}`, { name });
};

export const deleteCategory = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/categories/${id}`);
};
