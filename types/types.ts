export interface NewsItem {
  title: string;
  summary: string;
  date: string;
}

export interface MenuItems {
  name: string;
  path: string;
}

export interface Project {
  title: string;
  description: string;
  link: string;
}

// Type definitions for Proposal and FormData
export interface Proposal {
  ProposalID: number;
  ProjectTitle: string;
  ProjectDescription: string;
  Status: "Pending" | "Approved" | "Rejected";
  Feedback: string;
}

export interface FormData {
  projectTitle: string;
  projectDescription: string;
}

export type RegFormData = {
  name: string;
  email: string;
  password: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type ProposalFormData = {
  projectTitle: string;
  projectDescription: string;
};

export type ErrorType = {
  projectTitle?: string;
  projectDescription?: string;
};

export interface User {
  id: string;
  email: string;
}

// Define types for grant data
export interface Grant {
  GrantID: string | number;
  GrantTitle: string;
  Deadline: string;
  applied?: boolean;
}

export type GrantApplication = {
  GrantID: number;
  GrantTitle: string;
  Status: string;
  ApplicationDate: string;
  ApplicationlID: string;
};

export interface Event {
  EventID: string | number;
  EventTitle: string;
  EventDate:string
}


// Define TypeScript interfaces for user data
export interface ProjectContribution {
  title: string;
  link: string;
}

export interface Connection {
  name: string;
  link: string;
}

export interface AcademicHistory {
  institution: string;
  degree: string;
  year: number;
}

export interface UserData {
  name: string;
  email: string;
  bio: string;
  // researchInterests?: string[];
  // projectContributions?: ProjectContribution[];
  // connections?: Connection[];
  // academicHistory?: AcademicHistory[];
}

// Define the props interface
export  interface EventRegistrationProps {
  eventId: number | string;
  eventTitle: string;
}


export interface Message {
  senderId: number | null;
  content: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
}


export interface Thread {
  id?: string;
  title: string;
  createdAt: string;
}


export interface ThreadMessage {
  senderId: number;
  thread_id:number;
  message_text: string;
  created_at?:Date;
  name?: string;

}

export type APIThreadMessage = {
  id: number;
  sender_id: number;
  thread_id: number;
  message_text: string;
  created_at: string;
  name:string;
};