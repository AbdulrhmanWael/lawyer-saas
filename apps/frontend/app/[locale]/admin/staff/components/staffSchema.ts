import { z } from "zod";

export const staffSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  position: z
    .string()
    .min(2, { message: "Position must be at least 2 characters" }),
  practiceAreaId: z.string().nullable().optional(),
  order: z.number().min(0, "Order must be a number"),
  bio: z.record(z.string(), z.string()).optional(),
  imageFile: z
    .instanceof(File)
    .optional()
    .or(z.null())
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Image must be less than 5MB",
    }),
});

export type StaffFormData = z.infer<typeof staffSchema>;
