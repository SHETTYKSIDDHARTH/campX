import React, { useEffect, useState } from "react";
import StudentNav from "../components/StudentNav";
import axios from "axios";
import { BackendURL } from "../../config.js";
import { jwtDecode } from "jwt-decode";


function StudentDashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // decode user id
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }

    // fetch all events
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${BackendURL}/chair/getAll-events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      setLoadingId(eventId);
      const token = localStorage.getItem("token");

      // better: POST instead of GET
      await axios.post(
        `${BackendURL}/user/events/${eventId}/register`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // update participants locally
      setData((prev) =>
        prev.map((event) =>
          event._id === eventId
            ? { ...event, participants: [...event.participants, userId] }
            : event
        )
      );
    } catch (error) {
      console.error("Error registering:", error);
      alert(
        error.response?.data?.error || "Could not register. Try again later."
      );
    } finally {
      setLoadingId(null);
    }
  };

  const filteredEvents = data.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <StudentNav />
      <div className="min-h-screen bg-black">
        {/* Search Bar */}
        <div className="p-4 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search events by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-2xl border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Feed Section */}
        <div className="max-w-2xl mx-auto px-4 space-y-6">
          {filteredEvents.map((event) => {
            const isRegistered =
              userId && event.participants?.includes(userId);

            return (
              <div
                key={event._id}
                className="bg-gray-900 rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02] border border-gray-800"
              >
                {/* Poster */}
                <div className="w-full flex justify-center bg-black">
                  <img
                    src={event.poster}
                    alt={event.title}
                    className="max-h-[500px] w-auto object-contain transition-opacity duration-700 ease-in-out opacity-0"
                    onLoad={(e) =>
                      e.currentTarget.classList.remove("opacity-0")
                    }
                  />
                </div>

                {/* Event Info */}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-white">
                    {event.title}
                  </h2>
                  <p className="text-gray-300">{event.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(event.date).toLocaleDateString()}
                  </p>

                  {/* Register Button */}
                  <button
                    onClick={() => handleRegister(event._id)}
                    disabled={loadingId === event._id || isRegistered}
                    className={`mt-4 px-4 py-2 rounded-lg text-white font-medium transition ${
                      isRegistered
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isRegistered
                      ? "Registered"
                      : loadingId === event._id
                      ? "Registering..."
                      : "Register"}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredEvents.length === 0 && (
            <p className="text-center text-gray-500">No events found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
