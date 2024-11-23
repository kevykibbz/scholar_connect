"use client";

import React, { useState, useEffect, useRef } from "react";
import { SearchIcon } from "@heroicons/react/outline";
import { PaperClipIcon } from "@heroicons/react/outline";
import io, { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Message, User } from "@/types/types";

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="h-10 bg-gray-400 rounded-lg w-1/3 ml-auto"
      ></div>
    ))}
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="h-10 bg-gray-400 rounded-lg w-1/3 mr-auto"
      ></div>
    ))}
  </div>
);

const Chat: React.FC = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  const socketRef = useRef<Socket | null>(null);
  const socketUrl = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SERVER_PROD_URL : process.env.NEXT_PUBLIC_SERVER_LOCAL_URL;
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for the end of messages container

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(socketUrl as string);
    }
    setLoadingUsers(true);
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const usersData: User[] = await response.json();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();

    socketRef.current.on("chatMessage", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [socketUrl]);

  const sendMessage = () => {
    if (message.trim()) {
      if (selectedUser) {
        const newMessage: Message = {
          senderId: Number(session?.user.id) || null,
          content: message,
          createdAt: new Date(),
        };

        const messageToSend = {
          ...newMessage,
          recipientId: selectedUser.id,
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);

        if (socketRef.current) {
          socketRef.current.emit("chatMessage", messageToSend);
        }

        setMessage("");
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(search);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        setLoadingMessages(true);
        try {
          const response = await fetch(
            `/api/messages?selectedUserId=${selectedUser.id}`
          );
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setLoadingMessages(false);
        }
      }
    };

    fetchMessages();
  }, [selectedUser, session?.user.id]);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex h-screen">
      <div
        className={`w-1/4 bg-gray-900 p-4 text-white transition-all duration-300 ${
          isSidebarOpen ? "block" : "hidden"
        } sm:block md:w-1/4`}
      >
        <h3 className="text-xl font-bold mb-4">Collaborators</h3>
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full mb-3 pl-10 pr-4 py-4 bg-transparent border border-gray-400 text-neutral-content rounded-md focus:outline-none focus:ring-2"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div className="h-full space-y-2">
          {loadingUsers ? (
            <div className="mt-[200px] flex flex-col justify-center items-center my-auto text-center">
              <p className="text-gray-400">Loading users...</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  selectedUser?.id === user.id
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                }`}
              >
                {user.name}
              </button>
            ))
          )}
        </div>
      </div>

      <div
        className={`w-full sm:w-full md:w-3/4 p-6 flex flex-col bg-neutral-focus ${
          isSidebarOpen ? "ml-1/4" : "ml-0"
        } transition-all duration-300`}
      >
        {selectedUser ? (
          <>
            <h3 className="text-xl font-bold text-gray-200 mb-4">
              Chat with {selectedUser.name}
            </h3>
            <hr />
            <div className="message-list h-full mt-2 mb-4 overflow-y-auto">
              {loadingMessages ? (
                <SkeletonLoader />
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.senderId === Number(session?.user.id)
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    <p
                      className={`py-2 mb-2 px-4 inline-block ${
                        msg.senderId === Number(session?.user.id)
                          ? "bg-cyan-500 text-white"
                          : "bg-gray-300 text-black"
                      } rounded-lg`}
                    >
                      {msg.content}
                      <span className="block text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(msg.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </p>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} /> {/* Empty div for scroll target */}
            </div>
            <div className="flex mt-auto">
              <textarea
                className="w-full p-3 border border-gray-300 text-gray-200 bg-gray-800 rounded-lg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                rows={1}
              />
              <button
                onClick={sendMessage}
                className="ml-4 bg-cyan-500 text-white py-2 px-4 rounded-lg"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-full">
            <PaperClipIcon className="w-12 h-12 text-gray-400 mb-4" />
            <span className="text-gray-400">
              Select a user to start chatting
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;