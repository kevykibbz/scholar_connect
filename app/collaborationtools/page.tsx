"use client";
import React, { useState } from "react";
import { Chat, Forum } from "@/components";

// Define props interface

const CollaborationTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<"chat" | "files" | "forum">(
    "chat"
  ); // Default tool is chat

  return (
    <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Collaboration Tools
        </h2>

        {/* Button Group */}
        <div className="flex justify-center space-x-4 mb-10">
          <button
            className={`px-6 py-2 rounded-md transition-all duration-200 ${
              activeTool === "chat"
                ? "bg-cyan-500 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTool("chat")}
          >
            Chat
          </button>

          <button
            className={`px-6 py-2 rounded-md transition-all duration-200 ${
              activeTool === "files"
                ? "bg-cyan-500 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTool("files")}
          >
            File Upload
          </button>

          <button
            className={`px-6 py-2 rounded-md transition-all duration-200 ${
              activeTool === "forum"
                ? "bg-cyan-500 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            onClick={() => setActiveTool("forum")}
          >
            Forum
          </button>
        </div>

        {/* Conditionally render based on the active tool */}
        <div className="mt-6">
          {activeTool === "chat" && <Chat/>}
          {activeTool === "forum" && <Forum />}
        </div>
      </div>
    </div>
  );
};

export default CollaborationTools;
