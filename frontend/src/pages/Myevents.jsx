import React, { useEffect, useState } from "react";
import ChairmanNav from "../components/ChairmanNav";
import { BackendURL } from "../../config.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Myevents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await axios.get(
          `${BackendURL}/chair/getMyevents/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEvents(res.data.message);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleExport = async (id, title) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BackendURL}/chair/${id}/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title}_participants.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting participants:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BackendURL}/chair/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUpdate = (id) => {
    // window.location.href = `/update-event/${id}`;
    navigate(`/update-event/${id}`)
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <ChairmanNav />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">My Events</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search events by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredEvents.length === 0 ? (
          <p className="text-gray-400">No events found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-gray-900 text-white shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-xl"
              >
                <div className="h-56 w-full overflow-hidden bg-black flex justify-center items-center">
                  <img
                    src={event.poster}
                    alt={event.title}
                    className="h-full w-auto object-contain transition-transform duration-700 ease-in-out hover:scale-110"
                  />
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-semibold">{event.title}</h2>
                  <p className="text-gray-400 text-sm">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-gray-300 text-sm">
                    {event.description}
                  </p>
                </div>

                <div className="p-4 flex justify-between gap-2">
                  <button
                    onClick={() => handleExport(event._id, event.title)}
                   className="px-4 py-2 bg-transparent text-white border border-white text-sm font-medium hover:bg-green-500 transition duration-300"
                  >
                    Export
                  </button>
                  <button
                    onClick={() => handleUpdate(event._id)}
                    className="px-4 py-2 bg-transparent text-white border border-white text-sm font-medium hover:bg-yellow-500 transition duration-300"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                   className="px-4 py-2 bg-transparent text-white border border-white text-sm font-medium hover:bg-red-500 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Myevents;
