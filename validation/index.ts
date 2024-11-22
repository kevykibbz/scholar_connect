import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const proposalSchema = z.object({
  projectTitle: z
    .string()
    .min(5, "Project title must be at least 5 characters"),
  projectDescription: z
    .string()
    .min(10, "Project description must be at least 10 characters"),
});

// Define the Zod schema for validation
export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().min(10, "Bio must be at least 10 characters long"),
});