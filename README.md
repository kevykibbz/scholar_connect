# Real-Time Thread Chat Application

This project is a real-time chat application designed to allow users to send and receive messages within a specific thread. The application leverages **Socket.IO** for real-time communication, **React** for the frontend, and **Next.js** for server-side rendering. It enables users to participate in thread-based discussions where messages are dynamically updated without needing to refresh the page.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [How to Use](#how-to-use)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This application enables real-time messaging within specific threads. Users can join different threads and post messages, which are broadcasted to all users in the same thread instantly. Messages are fetched from the backend and displayed dynamically, with support for notifications when a new message is posted.

Key features of the application include:
- Real-time message updates via **Socket.IO**.
- Message persistence with API calls to the backend.
- Dynamic message rendering with React and **Next.js**.
- Loading state handling to provide a smooth user experience.

## Features

- **Real-Time Messaging**: As users send or receive messages, the application updates the chat interface instantly using WebSockets powered by **Socket.IO**.
- **Message Persistence**: After submitting a message, the list of messages is re-fetched to ensure the latest messages are always displayed.
- **Efficient State Management**: Uses React’s `useState` and `useEffect` hooks to manage messages and loading states.
- **Skeleton Loader**: Displays a skeleton loader while fetching messages to improve the user experience during data retrieval.
- **Message Timestamps**: Each message is displayed with a timestamp indicating when it was posted, using `date-fns` to format the time relative to the current time.

## Technologies Used

- **React**: A JavaScript library for building user interfaces, used for rendering dynamic components and managing state.
- **Socket.IO**: A real-time communication engine that enables bi-directional communication between the frontend and backend.
- **Next.js**: A React framework for server-side rendering and building scalable web applications.
- **TypeScript**: A superset of JavaScript that adds static types to the language for better tooling and safer code.
- **Tailwind CSS**: A utility-first CSS framework that provides pre-defined styles and facilitates rapid UI development.
- **date-fns**: A JavaScript library used for date manipulation, used to format the timestamps of messages.

## Setup and Installation

To get started with this project locally, follow the steps below:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/thread-chat-app.git
cd thread-chat-app

```

## 2. Install dependencies

Make sure you have Node.js and npm installed. If not, install them from [here](https://nodejs.org/).

Then run:

```bash
npm install
```
This will install all the necessary dependencies for the project.

## 3. Set up environment variables

Create a `.env.local` file at the root of the project and add the following variables:

```bash
NEXT_PUBLIC_SERVER_LOCAL_URL=http://localhost:5000
NEXT_PUBLIC_SERVER_PROD_URL=https://your-server-url
```
These variables should point to your local or production server where the backend is hosted.

## 4. Start the development server

```bash
npm run dev
```
The application will be available at http://localhost:3000.

## 5. Backend setup

Make sure you have a server running that handles the following routes:

- `/api/messages/[thread_id]`: Fetch messages for a specific thread.
- **Socket.IO endpoint**: This is used for real-time communication for new messages.

You can modify the backend to suit your needs.

## How to Use

1. Open the application in your browser.
2. Navigate to a thread page (e.g., `http://localhost:3000/thread/[thread_id]`).
3. You will see the existing messages for that thread.
4. Type a new message in the input field and click the "Send" button.
5. Your message will be sent in real-time and will appear in the message list immediately.
6. The list of messages will refresh to include the latest ones after each submission.

## Folder Structure

Here’s a breakdown of the folder structure in the project:

```bash
/thread-chat-app
│
├── /components         # Reusable React components like the chat input and message display
│   ├── MessageList.tsx # Renders the list of messages
│   ├── MessageInput.tsx # Handles message input and sending
│
├── /pages              # Next.js pages and API routes
│   ├── /api            # API route to handle fetching messages
│   ├── /thread         # Page for each thread chat
│
├── /public             # Static files like images, icons, etc.
│
├── /styles             # Tailwind CSS styles
│
├── /types              # TypeScript type definitions
│   ├── types.ts        # Type definitions for messages and thread data
│
├── .env.local          # Local environment variables (API URLs)
├── next.config.js      # Next.js configuration
├── package.json        # NPM package configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## API Endpoints

The project assumes the existence of two main API routes:

### 1. Fetch Messages for a Thread
**GET** `/api/messages/[thread_id]`

- **Description**: Retrieves all the messages for a specific thread.
- **Response**: A list of message objects.

**Example response**:

```json
[
  {
    "senderId": 1,
    "thread_id": 123,
    "message_text": "Hello, this is a message.",
    "created_at": "2024-11-23T12:34:56Z",
    "name": "John Doe"
  },
  ...
]
```

This Markdown structure includes appropriate headings, descriptions, and code blocks for the API details.

### 2. Socket.IO Communication
**POST** `/socket.io/`

- **Description**: Listens for new messages and broadcasts them to other users.
- **Events**: The `threadChatMessage` event is emitted to broadcast new messages.

---

## Contributing

1. Fork the repository.
2. Create a new branch: 
```bash
   git checkout -b feature-name
```
3. Make your changes and commit them
```bash
git commit -m 'Add new feature'
```
4. Push to the branch:
```bash
git push origin feature-name
```
5. Open a pull request to merge your changes.

## License
This project is licensed under the MIT License - see the LICENSE file for details.


This Markdown structure includes the necessary details for Socket.IO communication, contributing guidelines, and licensing information.
