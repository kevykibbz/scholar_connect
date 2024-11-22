"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { LoginFormData } from "@/types/types";
import { loginSchema } from "@/validation";
import { signIn } from "next-auth/react"; 
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>( {});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(true);
  const navigate = useRouter();

  const searchParams = useSearchParams()
 
  const redirectUrl = searchParams.get('callbackUrl') || "/home";

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));

    const fieldValidation = loginSchema.shape[name as keyof LoginFormData];

    if (fieldValidation) {
      const result = fieldValidation.safeParse(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: result.success ? "" : result.error.errors[0].message,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      setIsValid(false);
      const validationErrors = result.error.errors.reduce(
        (acc, error) => ({
          ...acc,
          [error.path[0]]: error.message,
        }),
        {}
      );
      setErrors(validationErrors);
      return;
    }

    setIsValid(true);
    setIsSubmitting(true);
    setErrors({});

    // Use NextAuth's signIn method for authentication
    const response = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });


    if (response?.error) {
      if (response.error === "Email not found") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "No account found with that email.",
        }));
      } else if (response.error === "Invalid password") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "The password you entered is incorrect.",
        }));
      } else {
        toast.error(`Login failed: ${response.error}`);
      }
    } else {
      toast.success("Login successful!");
      navigate.push(redirectUrl);
    }

    setIsSubmitting(false);
    // setFormData({ email: "", password: "" });
 
  };

  const hasErrors = () => {
    return Object.values(errors).some((error) => error !== "");
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-400">Login</h2>
        <div className="mt-10 max-w-2xl mx-auto bg-gray-900 text-gray-400">
          <form
            onSubmit={handleSubmit}
            className="bg-neutral p-6 rounded-lg shadow-lg text-neutral-content shadow-cyan-500/50"
          >
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-white py-3">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-4 bg-transparent text-neutral-content rounded-md focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "border-green-500 focus:ring-green-500"}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-white py-3">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-4 bg-transparent text-neutral-content rounded-md focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-500" : "border-green-500 focus:ring-green-500"}`}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full px-4 py-4 bg-cyan-400 text-white rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 ${hasErrors() || isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 1116 0 8 8 0 01-16 0z"></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
