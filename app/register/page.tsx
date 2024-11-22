"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { formSchema } from "@/validation";


type RegFormData = z.infer<typeof formSchema>;
const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Dynamically validate only the updated field
    const fieldValidation = formSchema.shape[name as keyof RegFormData];

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

    // Validate entire form
    try {
      formSchema.parse(formData);
      setLoading(true); 

      // Send a POST request to the API
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register user.");
      }

      const data = await response.json();
      toast.success(data.message);
      router.push("/login");
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        // Handle form validation errors (Zod)
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error: any) => {
          newErrors[error.path[0]] = error.message;
        });
        setErrors(newErrors);
      } else {
        // Handle API errors
        toast.error(err.message);
      }
    } finally {
      setLoading(false); // Stop loading once the submission is complete
    }
  };

  const hasErrors = () => {
    return Object.values(errors).some((error) => error !== "");
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-400">
          Register
        </h2>
        <div className="mt-10 max-w-2xl mx-auto bg-gray-900 text-gray-400">
          <form
            onSubmit={handleSubmit}
            className="bg-neutral p-6 rounded-lg shadow-lg"
          >
            {/* Name Field */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-white py-3">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                className={`w-full px-4 py-4 bg-transparent text-neutral-content rounded-md focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-green-500 focus:ring-green-500"
                }`}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

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
                className={`w-full px-4 py-4 bg-transparent text-neutral-content rounded-md focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-green-500 focus:ring-green-500"
                }`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
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
                className={`w-full px-4 py-4 bg-transparent text-neutral-content rounded-md focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-green-500 focus:ring-green-500"
                }`}
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full px-4 py-4 bg-cyan-400 text-white rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
                hasErrors() || loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={hasErrors() || loading}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 0116 0 8 8 0 01-16 0"
                    ></path>
                  </svg>
                  <span>Registering...</span>
                </span>
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Register;