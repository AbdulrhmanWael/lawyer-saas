import { apiClient } from "@/utils/apiClient";

export interface StaffMember {
  id: number;
  name: string;
  position: string;
  imageUrl?: string;
  bio?: Record<string, string>;
  order: number;
  practiceAreaId: string | null;
  practiceAreaTitle: Record<string, string> | null;
}

export type StaffMemberPayload = Omit<
  StaffMember,
  "id" | "imageUrl" | "practiceAreaTitle"
> & {
  imageFile?: File | null;
};

// clients/staffClient.ts
export const staffClient = {
  getAll: () => apiClient.get<StaffMember[]>("/staff-members"),

  getById: (id: number) => apiClient.get<StaffMember>(`/staff-members/${id}`),

  create: (data: StaffMemberPayload) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("position", data.position);
    formData.append("order", String(data.order ?? 0));
    if (data.practiceAreaId)
      formData.append("practiceAreaId", data.practiceAreaId);
    if (data.bio) formData.append("bio", JSON.stringify(data.bio));
    if (data.imageFile) formData.append("image", data.imageFile);

    return apiClient.post<StaffMember>("/staff-members", formData);
  },

  update: (id: number, data: Partial<StaffMemberPayload>) => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.position) formData.append("position", data.position);
    if (data.order !== undefined) formData.append("order", String(data.order));
    if (data.practiceAreaId)
      formData.append("practiceAreaId", data.practiceAreaId);
    if (data.bio) formData.append("bio", JSON.stringify(data.bio));
    if (data.imageFile) formData.append("image", data.imageFile);

    return apiClient.put<StaffMember>(`/staff-members/${id}`, formData);
  },

  delete: (id: number) => apiClient.delete(`/staff-members/${id}`),

  reorder: (orders: { id: number; order: number }[]) =>
    apiClient.patch<StaffMember[]>("/staff-members/reorder", { orders }),
};
