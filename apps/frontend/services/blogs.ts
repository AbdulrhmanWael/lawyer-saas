import { apiClient } from "@/utils/apiClient";

export interface Blog {
  id: string;
  title: Record<string, string>;
  category: { id: string; name: Record<string, string> };
  author: string;
  coverImage?: string;
  content: Record<string, string>;
  draft: boolean;
  published: boolean;
  inactive: boolean;
  views: number;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildFormData = (blog: any) => {
  const formData = new FormData();

  Object.keys(blog).forEach((key) => {
    if (key === "coverImage" && blog.coverImage instanceof File) {
      formData.append("coverImage", blog.coverImage);
    } else if (blog[key] !== undefined && blog[key] !== null) {
      formData.append(key, blog[key]);
    }
  });

  return formData;
};

export const getBlogs = (params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  locale?: string;
}) => {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined)
      )
    : undefined;

  return apiClient.get<{
    response: Blog[];
    total: number;
    page?: number;
    limit?: number;
  }>("/blogs", filteredParams);
};

export const getBlog = (id: string, locale?: string) => {
  if (locale) return apiClient.get<Blog>(`/blogs/${id}`, { locale });
  else return apiClient.get<Blog>(`/blogs/${id}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createBlog = (blog: any, locale?: string) => {
  const formData = buildFormData(blog);
  return apiClient.post<Blog>(`/blogs?locale=${locale ?? ""}`, formData);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateBlog = (id: string, blog: any, locale?: string) => {
  const formData = buildFormData(blog);
  return apiClient.put<Blog>(`/blogs/${id}?locale=${locale ?? ""}`, formData);
};

export const deleteBlog = (id: string) => apiClient.delete(`/blogs/${id}`);

export const publishBlog = (id: string) =>
  apiClient.patch(`/blogs/${id}/publish`);

export const unpublishBlog = (id: string) =>
  apiClient.patch(`/blogs/${id}/unpublish`);
