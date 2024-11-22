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