"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { UserData } from "@/types/types";
import { userSchema } from "@/validation";
import { toast } from "react-hot-toast";
import { ZodError } from "zod";

const UserProfiles: React.FC = () => {
  const { data: session,update} = useSession();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    bio: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [truncatedBio, setTruncatedBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch user data from session
  useEffect(() => {
    if (session?.user) {
      setUserData({
        name: session.user.name || "",
        email: session.user.email || "",
        bio: "An expert in AI and data-driven research.",
      });
    }
  }, [session]);



  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setUserData({ ...userData, [name]: value });

    const fieldValidation = userSchema.shape[name as keyof UserData];

    if (fieldValidation) {
      const result = fieldValidation.safeParse(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: result.success ? "" : result.error.errors[0].message,
      }));
    }
  };

  // Toggle editing state
  const toggleEdit = () => setIsEditing(!isEditing);

  // Cancel editing and revert to initial data
  const handleCancel = () => {
    if (session?.user) {
      setUserData({
        name: session.user.name || "",
        email: session.user.email || "",
        bio: "An expert in AI and data-driven research.",
      });
    }
    setIsEditing(false); // Exit edit mode
    setErrors({});
  };

  // Validate the form fields
  const validateForm = () => {
    try {
      userSchema.parse(userData); // Throws error if validation fails
      setErrors({}); // Clear previous errors
      return true;
    } catch (error) {
      if (error instanceof ZodError) {  // Check if error is an instance of ZodError
        const validationErrors = error.errors.reduce((acc: Record<string, string>, curr) => {
          acc[curr.path[0]] = curr.message; // Map errors to field names
          return acc;
        }, {});
        setErrors(validationErrors); // Set errors
      } else {
        // Handle other types of errors, if necessary
        console.error("Unexpected error", error);
      }
      return false;
    }
  };

  // Submit form data to API (simulate API call)
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true)
      const updatedUserData={...userData,userId:session?.user.id}
      try {
        const response = await fetch("/api/update-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        });
        if (response.ok) {
          await update({ ...session?.user,name: updatedUserData.name, bio: updatedUserData.bio });
          // Handle success, e.g., show a success message
          toast.success("Profile updated successfully!");
        } else {
          // Handle API error
          toast.error("Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Error updating profile");
      }finally{
        setIsSubmitting(false)
      }
    }
  };

  // Truncate the bio to a maximum of 60 words
  useEffect(() => {
    const bioWords = userData.bio.split(" ");
    const truncated =
      bioWords.length > 60
        ? bioWords.slice(0, 60).join(" ") + "..."
        : userData.bio;
    setTruncatedBio(truncated);
  }, [userData]);

  const hasErrors = () => {
    return Object.values(errors).some((error) => error !== "");
  };

  const  researchInterests=['Artificial Intelligence', 'Machine Learning', 'Data Analytics']
  const projectContributions=[
    { title: 'AI-Powered Research Collaboration Platform', link: '/projects/ai-collaboration-platform' },
    { title: 'Data-Driven Crop Yield Optimization', link: '/projects/crop-yield-optimization' }
  ]
  const connections=[
    { name: 'Dr. John Smith', link: '/profile/john-smith' },
    { name: 'Prof. Emma Johnson', link: '/profile/emma-johnson' }
  ]
  const academicHistory=[
    { institution: 'MIT', degree: 'PhD in Computer Science', year: 2018 },
    { institution: 'Harvard University', degree: 'MSc in Data Science', year: 2014 }
  ]
  return (
    <div className="bg-background text-foreground min-h-screen">
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center text-gray-200 mb-8">
          User Profile
        </h2>

        {/* Profile Information */}
        <div className="flex flex-col md:flex-row  bg-gray-900 text-gray-400 p-6 rounded-lg shadow-lg">
          <div className="flex-1 mb-3">
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className={`mb-4 w-full px-4 py-4 bg-transparent border ${
                    errors.name ? "border-red-500" : "border-gray-200"
                  } text-neutral-content rounded-md focus:outline-none focus:ring-2`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}

                <textarea
                  name="bio"
                  value={userData.bio}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 bg-transparent border ${
                    errors.bio ? "border-red-500" : "border-gray-200"
                  } text-neutral-content rounded-md focus:outline-none focus:ring-2`}
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm">{errors.bio}</p>
                )}
              </>
            ) : (
              <>
                <h2 className="capitalize text-2xl font-bold">
                  {userData.name}
                </h2>
                <p>{truncatedBio}</p>
              </>
            )}
            <p className="text-sm mt-2">Email: {userData.email}</p>
          </div>
        </div>

        <div className="flex mt-3 gap-4">
          <button
            onClick={isEditing ? handleSubmit : toggleEdit}
            className={`px-2 py-2 bg-cyan-400 text-white rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 ${hasErrors() || isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
            >
            {isEditing ? "Save" : "Edit"}
          </button>
          {isEditing && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 rounded-md transition-all duration-300 hover:bg-gray-600 text-white"
            >
              Cancel
            </button>
          )}
        </div>

         {/* Other profile sections */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Research Interests */}
          <div className="bg-gray-900 text-gray-400 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Research Interests</h3>
            <ul className="list-disc list-inside">
              {researchInterests.map((interest, index) => (
                <li key={index}>{interest}</li>
              ))}
            </ul>
          </div>

          {/* Project Contributions */}
          <div className="bg-gray-900 text-gray-400 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Project Contributions</h3>
            <ul>
              {projectContributions.map((project, index) => (
                <li key={index}>
                  <a
                    href={project.link}
                    className="text-cyan-400 hover:underline"
                  >
                    {project.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connections */}
          <div className="bg-gray-900 text-gray-400 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Connections</h3>
            <ul>
              {connections.map((connection, index) => (
                <li key={index}>
                  <a
                    href={connection.link}
                    className="text-cyan-400 hover:underline"
                  >
                    {connection.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic History */}
          <div className="bg-gray-900 text-gray-400 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Academic History</h3>
            <ul>
              {academicHistory.map((history, index) => (
                <li key={index}>
                  {history.degree} from {history.institution} ({history.year})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfiles;