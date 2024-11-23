"use client"
import { ThreadMessage } from "@/types/types";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

const Page: React.FC = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [messageContent, setMessageContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const socketRef = useRef<Socket | null>(null);
  const { id } = useParams();
  const thread_id = id || "";
  const socketUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SERVER_PROD_URL
      : process.env.NEXT_PUBLIC_SERVER_LOCAL_URL;

  // Use useCallback to memoize the fetchMessages function
  const fetchMessages = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(`/api/messages/${thread_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  }, [thread_id]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(socketUrl as string);
    }
  }, [socketUrl]);

  useEffect(() => {
    fetchMessages();
  }, [thread_id, fetchMessages]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("threadChatMessage", (newMessage: ThreadMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        // Re-fetch messages after a new message is received
        fetchMessages();
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("threadChatMessage");
      }
    };
  }, [thread_id, fetchMessages]);

  const handleSendMessage = async () => {
    if (messageContent.trim() && socketRef.current) {
      const newMessage: ThreadMessage = {
        senderId: Number(session?.user.id) || 1,
        thread_id: Number(thread_id),
        message_text: messageContent,
      };
      socketRef.current.emit("threadChatMessage", newMessage);
      toast.success("Message sent successfully");

      setMessageContent(""); // Clear input field
      console.log('refetching the messages....')
      // Fetch the updated messages after sending
      fetchMessages();
    }
  };

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-2">
      <div className="h-6 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="bg-background text-foreground min-h-screen">
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">
          Chat in Thread #{thread_id}
        </h1>

        <div className="bg-gray-900 text-gray-400 p-4 rounded-lg shadow-md max-h-[700px] overflow-y-auto mb-4">
          <ul>
            {loading
              ? // Display skeleton loader while loading
                Array.from({ length: 5 }).map((_, index) => (
                  <li key={index} className="border-b last:border-b-0 py-2">
                    <SkeletonLoader />
                  </li>
                ))
              : messages.length === 0 ? (
                  <li className="text-center text-gray-500 py-4">No new threads found</li>
                ) : (
                  // Display actual messages when loaded
                  messages.map((message, index) => (
                    <li
                      key={index}
                      className="border-b last:border-b-0 py-2 flex justify-between"
                    >
                      <span className="font-semibold capitalize">
                        {message.name}
                      </span>
                      <span className="flex flex-col">
                        <span>{message.message_text}</span>
                        <span className="text-right text-sm text-gray-500 mt-1">
                          {message.created_at &&
                            formatDistanceToNow(new Date(message.created_at), {
                              addSuffix: true,
                            })}
                        </span>
                      </span>
                    </li>
                  ))
                )}
          </ul>
        </div>

        <div className="flex">
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            className="flex-1 bg-transparent p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Type a message..."
          />

          <button
            onClick={handleSendMessage}
            className="bg-cyan-400 text-white p-2 rounded-r-md hover:bg-cyan-500"
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
};

export default Page;