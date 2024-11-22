"use client";

import { Proposal, ProposalFormData } from "@/types/types";
import { proposalSchema } from "@/validation";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

function ProposalDashboard() {
  const [viewMode, setViewMode] = useState<
    "list" | "create" | "edit" | "feedback"
  >("list");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [feedback, setFeedback] = useState("");
  const [formData, setFormData] = useState<ProposalFormData>({
    projectTitle: "",
    projectDescription: "",
  });
  const [errors, setErrors] = useState<{
    projectTitle?: string;
    projectDescription?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // New loading state

  // Fetch proposals from the API when the component mounts
  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/proposals");
        if (response.ok) {
          const data = await response.json();
          setProposals(data);
        } else {
          toast.error("Error fetching proposals");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching proposals");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));

    const fieldValidation =
      proposalSchema.shape[name as keyof ProposalFormData];

    if (fieldValidation) {
      const result = fieldValidation.safeParse(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: result.success ? "" : result.error.errors[0].message,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // Validate the form data with Zod
    const validationResult = proposalSchema.safeParse(formData);
    if (!validationResult.success) {
      // Collect validation errors
      setIsValid(false);
      const newErrors: Record<keyof ProposalFormData, string> = {
        projectTitle: '',
        projectDescription: ''
      };      
      validationResult.error.errors.forEach((error) => {
        newErrors[error.path[0] as keyof ProposalFormData] = error.message;
      });
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        // Handle success
        toast.success("Proposal created successfully");
      } else {
        // Handle error
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.log(error)
      toast.error("Error submitting proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submit
  const handleEditProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data using Zod
    const result = proposalSchema.safeParse(formData);

    if (!result.success) {
      // Collect validation errors and set to state
      const newErrors: { [key: string]: string } = {}; 
      result.error.errors.forEach((error) => {
        newErrors[error.path[0]] = error.message;
      });
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    const updatedFormData = {
      ...formData,
      proposalId: selectedProposal?.ProposalID,
    };

    try {
      const response = await fetch("/api/proposals", {
        method: "PUT",
        body: JSON.stringify(updatedFormData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error updating proposal");
      }
      toast.success("Proposal updated successfully");
      await fetchProposals();
    } catch (error) {
      console.log(error)
      toast.error("Error updating proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch proposals after a successful update
  const fetchProposals = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/proposals");
      if (response.ok) {
        const data = await response.json();
        setProposals(data);
      } else {
        toast.error("Error fetching proposals");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching proposals");
    } finally {
      setLoading(false);
    }
  };
  const hasErrors = () => {
    return Object.values(errors).some((error) => error !== "");
  };

  // Switch to edit mode and populate form data
  const handleEditClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setFormData({
      projectTitle: proposal.ProjectTitle,
      projectDescription: proposal.ProjectDescription,
    });
    setViewMode("edit");
  };

  // Switch to feedback mode
  const handleFeedbackClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setFeedback(proposal.Feedback || "");
    setViewMode("feedback");
  };

  const handleFeedbackSubmit= async(e:React.FormEvent)=>{
    e.preventDefault();
    setIsSubmitting(true);
    if(feedback){
      try {
        const response = await fetch("/api/proposals/feedback", {
          method: "PUT",
          body: JSON.stringify({proposalID:selectedProposal?.ProposalID,feedback:feedback}),
        });
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || "Error sending feedback");
        }
        toast.success("Feedback sent successfully");
        await fetchProposals();
      } catch (error) {
        console.log(error)
        toast.error("Error sending feedback");
      } finally {
        setIsSubmitting(false);
      }
    }

  }
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container pt-3 mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-400 mb-10">
          Project Dashboard
        </h1>

        {/* Navigation Links */}
        <div className="flex justify-center space-x-4 mb-10">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 text-white rounded-md transition-all duration-300 ${
              viewMode === "list"
                ? "bg-cyan-400"
                : "bg-transparent hover:bg-cyan-400"
            }`}
          >
            View Proposals
          </button>
          <button
            onClick={() => setViewMode("create")}
            className={`px-4 py-2 text-white rounded-md transition-all duration-300 ${
              viewMode === "create"
                ? "bg-cyan-400"
                : "bg-transparent hover:bg-cyan-400"
            }`}
          >
            Create New Proposal
          </button>
        </div>

        {/* Render based on the current mode */}
        {viewMode === "list" && (
          <div>
            <h2 className="text-2xl font-bold text-center text-slate-400 mb-6">
              My Proposals
            </h2>
            <div className="grid grid-cols-1 gap-6 pb-5">
              {/* Show loading skeleton if proposals are still being fetched */}
              {loading ? (
                <>
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-900 p-6 rounded-lg shadow-lg animate-pulse"
                    >
                      <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-600 rounded mb-2"></div>
                      <div className="h-4 bg-gray-600 rounded mb-2"></div>
                      <div className="flex space-x-4">
                        <div className="h-8 w-20 bg-gray-600 rounded"></div>
                        <div className="h-8 w-20 bg-gray-600 rounded"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                proposals.map((proposal) => (
                  <div
                    key={proposal.ProposalID}
                    className=" bg-gray-900 text-gray-400 transition-transform transform hover:scale-105 cursor-pointer bg-neutral-focus p-6 rounded-lg shadow-lg text-neutral-content shadow-cyan-500/50"
                  >
                    <h3 className="capitalize text-xl font-bold text-gray-200 mb-2">
                      {proposal.ProjectTitle}
                    </h3>
                    <p className="capitalize mb-2">
                      <strong>Status:</strong> {proposal.Status}
                    </p>
                    <p className="capitalize mb-4">
                      <strong>Feedback:</strong>{" "}
                      {proposal.Feedback || "No feedback yet"}
                    </p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEditClick(proposal)}
                        className="px-4 py-2 bg-cyan-400  rounded-md transition-all duration-300 hover:bg-cyan-500 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleFeedbackClick(proposal)}
                        className="px-4 py-2 bg-cyan-400  rounded-md transition-all duration-300 hover:bg-cyan-500 text-white"
                      >
                        Provide Feedback
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {viewMode === "create" && (
          <div>
            <div className="max-w-xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-slate-400 mb-6">
                Create New Proposal
              </h2>
              <form
                onSubmit={handleSubmit}
                className="bg-gray-900 text-gray-400 p-6 rounded-lg shadow-lg text-neutral-content shadow-cyan-500/50"
              >
                {/* Form fields for projectTitle and projectDescription */}
                <div className="mb-4">
                  <label htmlFor="projectTitle" className="block text-white">
                    Project Title
                  </label>
                  <input
                    type="text"
                    id="projectTitle"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 bg-transparent text-neutral-content rounded-md focus:outline-none focus:ring-2 border border-gray-400 ${
                      errors.projectTitle
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-400 focus:ring-green-500"
                    }`}
                    required
                  />
                  {errors.projectTitle && (
                    <p className="text-red-500 mt-1">{errors.projectTitle}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="projectDescription"
                    className="block text-white"
                  >
                    Project Description
                  </label>
                  <textarea
                    id="projectDescription"
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 bg-transparent text-neutral-content rounded-md focus:outline-none focus:ring-2 border border-gray-400 ${
                      errors.projectDescription
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-400 focus:ring-green-500"
                    }`}
                    required
                  />
                  {errors.projectDescription && (
                    <p className="text-red-500 mt-1">
                      {errors.projectDescription}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid || hasErrors()}
                  className={`w-full py-3 bg-cyan-400 text-white rounded-md hover:bg-cyan-500 ${
                    isSubmitting || !isValid || hasErrors()
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Proposal"}
                </button>
              </form>
            </div>
          </div>
        )}

        {viewMode === "edit" && selectedProposal && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-400 mb-6">
              Edit Proposal
            </h2>
            <form
              onSubmit={handleEditProposal}
              className="bg-gray-900 text-gray-400 p-6 rounded-lg shadow-lg text-neutral-content shadow-cyan-500/50"
            >
              <div className="mb-4">
                <label htmlFor="projectTitle" className="block text-white">
                  Project Title
                </label>
                <input
                  type="text"
                  id="projectTitle"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 bg-transparent text-neutral-content rounded-md focus:outline-none focus:ring-2 border border-gray-400 ${
                    errors.projectTitle
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-400 focus:ring-green-500"
                  }`}
                  required
                />
                {errors.projectTitle && (
                  <p className="text-red-500 mt-1">{errors.projectTitle}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="projectDescription"
                  className="block text-white"
                >
                  Project Description
                </label>
                <textarea
                  id="projectDescription"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 bg-transparent text-neutral-content rounded-md focus:outline-none focus:ring-2 border border-gray-400 ${
                    errors.projectDescription
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-400 focus:ring-green-500"
                  }`}
                  required
                />
                {errors.projectDescription && (
                  <p className="text-red-500 mt-1">
                    {errors.projectDescription}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !isValid || hasErrors()}
                className={`w-full py-3 bg-cyan-400 text-white rounded-md hover:bg-cyan-500 ${
                  isSubmitting || !isValid || hasErrors()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting ? "Updating..." : "Submit Proposal"}
              </button>
            </form>
          </div>
        )}

        {viewMode === 'feedback' && selectedProposal && (
           <div className="max-w-xl mx-auto">
           <h2 className="text-3xl font-bold text-center text-slate-400 mb-6">
             Provide Feedback
           </h2>
           <form
             onSubmit={handleFeedbackSubmit}
             className="bg-gray-900 text-gray-400 p-6 rounded-lg shadow-lg text-neutral-content"
           >
             <div className="mb-4">
               <label htmlFor="feedback" className="block text-white">
                 Feedback
               </label>
               <textarea
                 id="feedback"
                 name="feedback"
                 value={feedback}
                 onChange={(e) => setFeedback(e.target.value)}
                 className="w-full px-4 py-2 bg-transparent rounded-md border border-gray-400 focus:ring-2 focus:ring-green-500"
                 required
               />
             </div>
             <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 bg-cyan-400 text-white rounded-md hover:bg-cyan-500 ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting ? "Submitting feedback..." : "Submit Feedback"}
              </button>
           </form>
         </div>
        )}
      </div>
    </div>
  );
}

export default ProposalDashboard;
