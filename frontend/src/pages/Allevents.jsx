import React, { useEffect, useState } from "react";
import ChairmanNav from "../components/ChairmanNav";
import axios from "axios";
import { BackendURL } from "../../config";

function Allevents() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
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

  const filteredEvents = data.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black">
      <ChairmanNav />

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
        {filteredEvents.map((event, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-2xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02] border border-gray-800"
          >
            {/* Poster */}
            <div className="w-full flex justify-center bg-black">
              <img
                src={event.poster}
                alt={event.title}
                className="max-h-[500px] w-auto object-contain transition-opacity duration-700 ease-in-out opacity-0"
                onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
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
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <p className="text-center text-gray-500">No events found.</p>
        )}
      </div>
    </div>
  );
}

export default Allevents;
