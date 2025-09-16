import { apiClient } from "@/utils/apiClient";

export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  roleName: string;
  avatarUrl?: File;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  roleName?: string;
  avatarUrl?: File;
}

const buildFormData = (user: CreateUserDto | UpdateUserDto) => {
  const formData = new FormData();

  Object.entries(user).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "avatarUrl" && value instanceof File) {
      formData.append("avatarUrl", value);
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

export const getUsers = () => apiClient.get<User[]>("/users");

export const getUser = (id: string) => apiClient.get<User>(`/users/${id}`);

export const createUser = (user: CreateUserDto) => {
  const formData = buildFormData(user);
  return apiClient.post<User>("/users", formData);
};

export const updateUser = (id: string, user: UpdateUserDto) => {
  const formData = buildFormData(user);
  return apiClient.patch<User>(`/users/${id}`, formData);
};

export const deleteUser = (id: string) =>
  apiClient.delete<{ message: string }>(`/users/${id}`);

export const updatePassword = (params: {
  email: string;
  oldPassword: string;
  newPassword: string;
}) => apiClient.post<{ message: string }>("/users/update-password", params);
