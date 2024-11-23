"use client";
import { Thread } from "@/types/types";
import Link from "next/link";
import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { toast } from "react-hot-toast";

const Forum: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]); // Start with an empty array
  const [newThreadTitle, setNewThreadTitle] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [loadingThreads, setLoadingThreads] = useState<boolean>(true); // Loading state for threads
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state

  useEffect(() => {
    // Fetch threads when the component mounts
    const fetchThreads = async () => {
      setLoadingThreads(true); // Start loading threads
      try {
        const response = await fetch("/api/threads"); // Assuming the API returns the list of threads
        if (!response.ok) {
          throw new Error("Failed to fetch threads");
        }
        const data = await response.json();
        setThreads(data); // Set the threads data
      } catch (err) {
        setError("Failed to load threads. Please try again later.");
        console.error(err);
      } finally {
        setLoadingThreads(false); // End loading threads
      }
    };

    fetchThreads();
  }, []); // Empty dependency array to run only on component mount

  const createThread = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newThreadTitle && newThreadTitle.trim()) {
      setLoading(true); // Set loading to true when creating a new thread
      setError(null);
      try {
        const response = await fetch("/api/threads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newThreadTitle }),
        });

        if (!response.ok) {
          throw new Error("Failed to create thread");
        }

        await response.json();
        toast.success("New thread created successfully");
        fetchThreads()
        setNewThreadTitle("");
      } catch (err) {
        setError("Failed to create thread. Please try again later.");
        console.error(err);
        toast.error("Something went wrong while creating the thread");
      } finally {
        setLoading(false); // Set loading to false after operation
      }
    }
  };

  // Filter threads based on the search query
  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchThreads = async () => {
    setLoadingThreads(true); // Start loading threads
    try {
      const response = await fetch("/api/threads"); // Assuming the API returns the list of threads
      if (!response.ok) {
        throw new Error("Failed to fetch threads");
      }
      const data = await response.json();
      setThreads(data); // Set the threads data
    } catch (err) {
      setError("Failed to load threads. Please try again later.");
      console.error(err);
    } finally {
      setLoadingThreads(false); // End loading threads
    }
  };
  return (
    <div className="p-6 container bg-gray-900 rounded-lg shadow-lg mx-auto">
      <h3 className="text-2xl font-bold text-gray-100 mb-6">Project Forum</h3>

      <form onSubmit={createThread} className="mb-6">
        <input
          type="text"
          placeholder="Start a new thread"
          value={newThreadTitle}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewThreadTitle(e.target.value)
          }
          className="w-full p-3 mb-4 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          disabled={loading} // Disable input during loading
        />
        <button
          type="submit"
          className={`w-full py-3 font-semibold rounded-md transition-colors ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-cyan-500 hover:bg-cyan-600"
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Thread"}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Show skeleton loader while threads are loading */}
      {loadingThreads ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="w-full p-4 mb-2 bg-gray-700 rounded-md animate-pulse"
            >
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-600 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Search Input */}
          <div className="mb-6 float-right">
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="p-3 mb-4 rounded-md bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          {/* Display a message if no threads are found */}
          {filteredThreads.length === 0 ? (
            <p className="mb-4 text-gray-500">No threads found</p>
          ) : (
            <>
              <h4 className="text-lg text-gray-200 mb-2">Existing Threads:</h4>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                {filteredThreads.map((thread, index) => (
                  <Link
                    href={`/threads/${thread.id}`}
                    className="hover:text-cyan-400 mb-2"
                    key={index}
                  >
                    <li className="text-gray-200">
                      {thread.title}
                      <span className="block text-sm text-gray-400">
                        (Created on:{" "}
                        {new Date(thread.createdAt).toLocaleString("en-US", {
                          month: "short", // Abbreviated month (e.g., "Nov")
                          day: "numeric", // Day (e.g., "22")
                          year: "numeric", // Year (e.g., "2024")
                          hour: "2-digit", // Hour (e.g., "09")
                          minute: "2-digit", // Minute (e.g., "00")
                          hour12: true, // Use 12-hour format (default is 24-hour)
                        })}
                        )
                      </span>
                    </li>
                  </Link>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Forum;
