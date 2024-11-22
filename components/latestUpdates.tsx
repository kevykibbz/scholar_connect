"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FaLink } from 'react-icons/fa'; 

interface QuickLink {
  title: string
  path: string
}



const LatestUpdates: React.FC = () => {
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([])



  useEffect(() => {
    // Simulating an API call to fetch latest quick links with their respective paths
    const fetchLatestUpdates = (): QuickLink[] => {
      return [
        { title: "New Collaboration Tools Released: Chat, File Sharing, Forums", path: "/collaborationtools" },
        { title: "Funding and Grants Page Launched", path: "/grantsandfunding" },
        { title: "Events Calendar: Register for Upcoming Webinars", path: "/eventsdashboard" },
        { title: "New Feature: Submit and Track Project Proposals", path: "/proposaldashboard" },
        { title: "System Maintenance Scheduled for October 30th", path: "/eventsdashboard" },
        { title: "Profile Updates: Edit Your Research Interests", path: "/userprofiles" },
      ]
    }

    const updates = fetchLatestUpdates()
    setQuickLinks(updates)
  }, [])

  return (
    <section className="container  mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-400">Quick Links</h2>
      <div className="mt-10 bg-gray-900 transition-transform transform hover:scale-105 cursor-pointer text-gray-400 rounded-lg shadow-lg shadow-cyan-500/50 p-6">
        <ul className="list-disc list-inside mt-4">
          {quickLinks.map((link, index) => (
            <li key={index} className="mt-2 text-gray-400 text-xl flex items-center">
              <FaLink className="mr-2" />
              <Link href={link.path} className="hover:text-cyan-400">
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default LatestUpdates
