"use client";
import { Grant, GrantApplication } from "@/types/types";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

const FundingAndGrantsDashboard: React.FC = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const [viewMode, setViewMode] = useState<"search" | "tracker">("search");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [filteredGrants, setFilteredGrants] = useState<Grant[]>([]);
  const [applications, setApplications] = useState<GrantApplication[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submittingGrants, setSubmittingGrants] = useState<{
    [key: string]: boolean;
  }>({});

  // Fetch grants data on component mount
  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/grants");
        if (response.ok) {
          const data: Grant[] = await response.json();
          setGrants(data);
          setFilteredGrants(data);
        } else {
          toast.error("Error fetching grants");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching grants");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  // Handle search input and filter grants
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);

    // Filter the grants based on the search term
    setFilteredGrants(
      grants.filter((grant) =>
        grant.GrantTitle.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const renderLoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-300 rounded w-3/4"></div>
      <div className="h-8 bg-gray-300 rounded w-full"></div>
      <div className="h-8 bg-gray-300 rounded w-3/4"></div>
    </div>
  );

  // Function to handle application
  const grantApplication = async (grantID: string | number) => {
    setSubmittingGrants((prev) => ({ ...prev, [grantID]: true }));
    if (userId) {
      try {
        const response = await fetch("/api/grants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grantID: grantID,
            userID: userId,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message);
        } else {
          toast.error(data.error || "Error applying for the grant.");
        }
      } catch (error) {
        console.error("Error applying for grant:", error);
        toast.error("Something went wrong. Please try again later.");
      } finally {
        setSubmittingGrants((prev) => ({ ...prev, [grantID]: false }));
      }
    }
  };

  const viewMyApplication = async () => {
    setViewMode("tracker");
    setLoading(true);
    try {
      const response = await fetch(`/api/grants/applications?UserId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        toast.error("Error fetching grants");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching grants");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-400 mb-10">
          Funding and Grants
        </h2>
        <div className="flex justify-center space-x-4 mb-10">
          <button
            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
              viewMode === "search"
                ? "bg-cyan-400 hover:bg-cyan-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setViewMode("search")}
          >
            Search Grants
          </button>
          <button
            className={`px-4 py-2 bg-cyan-400  rounded-md transition-all duration-300 hover:bg-cyan-500 text-white ${
              viewMode === "tracker"
                ? "bg-cyan-400 hover:bg-cyan-500 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
            onClick={viewMyApplication}
          >
            My Applications
          </button>
        </div>

        {/* Conditionally render the GrantSearch component */}
        {viewMode === "search" && (
          <div className="grant-search p-6 bg-neutral-focus rounded-lg shadow-lg text-neutral-content shadow-cyan-500/50">
            <h3 className="text-xl font-bold text-gray-200 mb-4">
              Search for Grants
            </h3>
            <input
              type="text"
              placeholder="Search by grant title"
              value={searchTerm}
              onChange={handleSearch}
              className="mb-2 w-full px-4 py-4 bg-transparent border border-gray-400 text-neutral-content rounded-md focus:outline-none focus:ring-2"
            />

            {/* Show loading skeleton while grants are being fetched */}
            {loading ? (
              renderLoadingSkeleton()
            ) : (
              <ul className="pt-5 list-disc pl-5 text-gray-200">
                {filteredGrants.map((grant) => (
                  <li key={grant.GrantID} className="mb-2">
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <h4 className="text-lg font-bold">
                          {grant.GrantTitle}
                        </h4>
                        <p>Deadline: {grant.Deadline}</p>
                      </div>
                      <button
                        onClick={() => grantApplication(grant.GrantID)} // Pass the grantID to the function
                        className="px-4 py-2 bg-cyan-400 rounded-md transition-all duration-300 hover:bg-cyan-500 text-white mt-2"
                        disabled={submittingGrants[grant.GrantID]}
                      >
                        {submittingGrants[grant.GrantID]
                          ? "Submitting..."
                          : "Apply"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {viewMode === "tracker" && (
          <div className="application-tracker p-6 bg-gray-800 rounded-lg shadow-lg text-white shadow-cyan-500/50">
            <h3 className="text-2xl font-bold text-gray-200 mb-4">
              Your Grant Applications
            </h3>

            {loading &&
              [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-900 p-6 rounded-lg shadow-lg animate-pulse"
                >
                  <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                </div>
              ))}

            {error && (
              <div className="text-center text-red-500">
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && applications.length === 0 && (
              <div className="text-center text-gray-300">
                <p>You haven't applied for any grants yet.</p>
              </div>
            )}

            <ul className="list-disc pl-5 text-gray-200">
              {applications.map((application) => (
                <li
                  key={application.ApplicationlID}
                  className="mb-4 p-4 bg-gray-700 rounded-lg"
                >
                  <h4 className="text-xl font-semibold text-cyan-400">
                    {application.GrantTitle}
                  </h4>
                  <p className="text-sm text-gray-300">
                    Status: {application.Status}
                  </p>
                  <p className="text-sm text-gray-400">
                    Applied on:{" "}
                    {new Date(application.ApplicationDate).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundingAndGrantsDashboard;
