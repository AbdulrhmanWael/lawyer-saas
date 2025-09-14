import { z } from "zod";

export const nameValidator = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters");

export const emailValidator = z.email({ message: "Invalid email address" });

export const passwordValidator = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/\d/, "Must contain at least one number");

export const optionalString = z.string().optional();
export const booleanValidator = z.boolean();
