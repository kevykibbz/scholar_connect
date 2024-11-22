"use client";
import React, { useEffect, useState } from "react";
import { Event, Grant } from "@/types/types";
import { toast } from "react-hot-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Define EventCalendar Component directly inside the file
const EventCalendar: React.FC<{ onSelectEvent: (event: Event) => void }> = ({
  onSelectEvent,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/grants");
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
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

  // Filter events for the selected date
  const eventsOnSelectedDate = events.filter(
    (event) =>
      new Date(event.EventDate).toDateString() === selectedDate.toDateString()
  );

  const renderLoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-300 rounded w-3/4"></div>
      <div className="h-8 bg-gray-300 rounded w-full"></div>
      <div className="h-8 bg-gray-300 rounded w-3/4"></div>
    </div>
  );

  return (
    <div className="p-6 rounded-lg shadow-lg shadow-cyan-500/50 text-white">
      <h3 className="text-xl font-bold mb-4">Events Calendar</h3>
      <Calendar
        onChange={(date) => setSelectedDate(date as Date)}
        value={selectedDate}
        className="mb-4 bg-white rounded-lg p-2 shadow-md"
      />
      <div>
        <h4 className="text-lg font-semibold mb-2">
          Events on {selectedDate.toDateString()}:
        </h4>
        {loading ? (
          renderLoadingSkeleton()
        ) : eventsOnSelectedDate.length > 0 ? (
          <ul className="list-disc pl-5">
            {eventsOnSelectedDate.map((event) => (
              <li key={event.EventID} className="mb-2">
                {event.EventTitle}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No events on this date</p>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
const EventsAndCalendarDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Grant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch events (grants) data on component mount
  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/grants");
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
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

  const renderLoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-300 rounded w-3/4"></div>
      <div className="h-8 bg-gray-300 rounded w-full"></div>
      <div className="h-8 bg-gray-300 rounded w-3/4"></div>
    </div>
  );

  return (
    <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-400 mb-10">
          Events and Calendar
        </h2>

        {/* Toggle Buttons */}
        <div className="flex justify-center space-x-4 mb-10">
          <button
            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
              viewMode === "list"
                ? "bg-cyan-400 hover:bg-cyan-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setViewMode("list")}
          >
            View Events
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold transition-colors duration-300 ${
              viewMode === "calendar"
                ? "bg-cyan-400 hover:bg-cyan-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setViewMode("calendar")}
          >
            Calendar View
          </button>
        </div>

        {/* Conditional Rendering */}
        {viewMode === "list" && (
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg shadow-cyan-500/50 text-white">
            <h3 className="text-xl font-bold mb-4">Upcoming Events</h3>
            {loading ? (
              renderLoadingSkeleton()
            ) : (
              <ul className="list-disc pl-5">
                {events.map((event) => (
                  <li key={event.GrantID} className="mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-semibold">
                          {event.GrantTitle}
                        </h4>
                        <p className="text-gray-300">Date: {event.Deadline}</p>
                      </div>
                      <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md transition duration-300">
                        Register
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {viewMode === "calendar" && (
          <EventCalendar onSelectEvent={setSelectedEvent} />
        )}
      </div>
    </div>
  );
};

export default EventsAndCalendarDashboard;
