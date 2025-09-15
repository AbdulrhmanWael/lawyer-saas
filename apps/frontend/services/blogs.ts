import axios from "axios";

export interface Blog {
  id: string;
  title: Record<string, string>;
  category: { id: string; name: Record<string, string> };
  author: string;
  coverImage?: string;
  content: Record<string, string>;
  draft: boolean;
  published: boolean;
  createdAt: string;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const buildFormData = (blog: any) => {
  const formData = new FormData();

  // append normal fields
  Object.keys(blog).forEach((key) => {
    if (key === "coverImage" && blog.coverImage instanceof File) {
      formData.append("coverImage", blog.coverImage); // 👈 file field
    } else if (blog[key] !== undefined && blog[key] !== null) {
      formData.append(key, blog[key]);
    }
  });

  return formData;
};

export const getBlogs = async (params?: {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  locale?: string;
}) => {
  const { data } = await axios.get(backendUrl + "/blogs", { params });
  return data;
};

export const getBlog = async (id: string, locale?: string) => {
  const { data } = await axios.get(backendUrl + `/blogs/${id}`, {
    params: { locale },
  });
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createBlog = async (blog: any, locale?: string) => {
  const formData = buildFormData(blog);
  const { data } = await axios.post(backendUrl + "/blogs", formData, {
    params: { locale },
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateBlog = async (id: string, blog: any, locale?: string) => {
  const formData = buildFormData(blog);
  const { data } = await axios.put(backendUrl + `/blogs/${id}`, formData, {
    params: { locale },
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteBlog = async (id: string) => {
  await axios.delete(backendUrl + `/blogs/${id}`);
};

export const publishBlog = async (id: string) => {
  await axios.patch(backendUrl + `/blogs/${id}/publish`);
};

export const unpublishBlog = async (id: string) => {
  await axios.patch(backendUrl + `/blogs/${id}/unpublish`);
};
