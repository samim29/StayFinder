import { z } from "zod";
/**
 * Validation schema for user registration using Zod.
 * @description This schema defines the validation rules for user registration fields.
 * @property {string} name - The user's name, must be between 2 and 50 characters.
 * @property {string} email - The user's email, must be a valid email format.
 * @property {string} phone - The user's phone number, must be a valid 10-digit number starting with 6-9.
 * @property {string} password - The user's password, must be at least 8 characters long.
 * @property {string} role - The user's role, must be either "student" or "owner".
 */
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z.string().trim().email("Please enter a valid email address"),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  role: z.enum(["student", "owner"]),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Email or phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["student", "owner"]),
});
