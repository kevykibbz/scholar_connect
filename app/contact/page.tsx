"use client";

import Link from "next/link";
import React from "react";

const Contact = () => {
  return (
    <section className="bg-background text-foreground min-h-screen items-center justify-center">
      <h2 className="pt-4 text-3xl font-bold text-gray-400 text-center">
        Contact Us
      </h2>
      <div className="mt-10 max-w-2xl mx-auto">
        <form className="bg-neutral p-6 rounded-lg shadow-lg text-neutral-content shadow-cyan-500/50">
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value=""
              className="w-full px-4 py-4 border border-gray-400 bg-transparent text-neutral-content rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value=""
              className="w-full px-4 py-4 border border-gray-400 bg-transparent text-neutral-content rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Role Field */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-white">
              Role
            </label>
            <select
              id="role"
              name="role"
              value=""
              className="w-full px-4 py-4 border border-gray-400 bg-transparent text-neutral-content rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="" className="text-gray-600">
                Select your role
              </option>
              <option
                value="Researcher"
                className="text-neutral-content bg-gray-800"
              >
                Researcher
              </option>
              <option
                value="Admin"
                className="text-neutral-content bg-gray-800"
              >
                Admin
              </option>
              <option
                value="Student"
                className="text-neutral-content bg-gray-800"
              >
                Student
              </option>
              <option
                value="Reviewer"
                className="text-neutral-content bg-gray-800"
              >
                Reviewer
              </option>
            </select>
          </div>

          {/* Query Type Field */}
          <div className="mb-4">
            <label htmlFor="queryType" className="block text-white">
              Query Type
            </label>
            <select
              id="queryType"
              name="queryType"
              value=""
              className="w-full px-4 py-4 border border-gray-400 bg-transparent text-neutral-content rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option className="text-neutral-content bg-gray-800" value="">
                Select query type
              </option>
              <option
                className="text-neutral-content bg-gray-800"
                value="General Inquiry"
              >
                General Inquiry
              </option>
              <option
                className="text-neutral-content bg-gray-800"
                value="Technical Issue"
              >
                Technical Issue
              </option>
              <option
                className="text-neutral-content bg-gray-800"
                value="Event-related"
              >
                Event-related
              </option>
              <option
                className="text-neutral-content bg-gray-800"
                value="Grant-related"
              >
                Grant-related
              </option>
              <option
                className="text-neutral-content bg-gray-800"
                value="Collaboration Tool"
              >
                Collaboration Tool
              </option>
            </select>
          </div>
          {/* Message Field */}
          <div className="mb-4">
            <label htmlFor="message" className="block text-white">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Enter your message"
              value=""
              className="w-full px-4 py-4 border border-gray-400 bg-transparent text-neutral-content rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"            
            className="w-full px-4 py-4 bg-cyan-400 text-white rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300"

          >
            Send Message
          </button>
        </form>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-400 text-center">
          Frequently Asked Questions
        </h3>
        <div className="mt-8 max-w-3xl mx-auto bg-gray-900 text-gray-400 p-6 rounded-lg shadow-lg text-neutral-content shadow-cyan-500/50">
          {/* FAQ 1 */}
          <div className="mb-4">
            <h4 className="font-semibold text-white">
              1. How do I register for an event?
            </h4>
            <p className="text-gray-300">
              You can register for an event by visiting the &quot;Events&quot; section.
              From there, find the event you&apos;re interested in and click
              &quot;Register.&quot;
            </p>
          </div>

          {/* FAQ 2 */}
          <div className="mb-4">
            <h4 className="font-semibold text-white">
              2. How do I apply for a grant?
            </h4>
            <p className="text-gray-300">
              Navigate to the &quot;Funding and Grants&quot; section to search for
              available grants. Once you find one that fits your research, click
              &quot;Apply.&quot;
            </p>
          </div>

          {/* FAQ 3 */}
          <div className="mb-4">
            <h4 className="font-semibold text-white">
              3. Can I collaborate with other researchers?
            </h4>
            <p className="text-gray-300">
              Yes, through the &quot;Collaboration Tools&quot; section. You can start a
              chat, upload documents, or participate in forums to discuss and
              collaborate on projects.
            </p>
          </div>

          {/* FAQ 4 */}
          <div className="mb-4">
            <h4 className="font-semibold text-white">
              4. How can I submit a proposal for a project?
            </h4>
            <p className="text-gray-300">
              Visit the &quot;Project Proposals&quot; section, fill out the required
              details, and submit your proposal for review.
            </p>
          </div>

          {/* FAQ 5 */}
          <div className="mb-4">
            <h4 className="font-semibold text-white">
              5. How do I track my thesis submission?
            </h4>
            <p className="text-gray-300">
              After submitting your thesis through the &quot;Submit Thesis&quot; page, you
              can track its progress under the &quot;Thesis Submissions&quot; section.
              You&apos;ll be notified about the review status.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="mt-16 pb-[20px]">
        <h3 className="text-2xl font-bold text-gray-400 text-center">
          Contact Information
        </h3>
        <div className="mt-8 max-w-3xl mx-auto  bg-gray-900 text-gray-400 p-6 rounded-lg shadow-lg text-neutral-content shadow-cyan-500/50">
          <p className="text-gray-300">
            For any further queries or assistance, feel free to reach out to us
            at{" "}
            <strong>
              <Link
                className="hover:text-cyan-400"
                href="mailto:team@scholarconnect.com"
              >
                team@scholarconnect.com
              </Link>
            </strong>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
