import React, { useState } from "react";
import axios from "axios";
import { BackendURL } from "../../config.js";

function CreateEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const createEvent = async () => {
    if (!title || !date || !description || !poster) {
      setErr("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setErr("");
      setSuccess("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date);
      formData.append("description", description);
      formData.append("poster", poster);

      const token = localStorage.getItem("token");

      await axios.post(`${BackendURL}/chair/postevent`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Event created successfully!");
      setTitle("");
      setDate("");
      setDescription("");
      setPoster(null);
    } catch (error) {
      console.error(error);
      setErr("Error while posting event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg p-6 space-y-5">
        <h2 className="text-2xl font-bold text-center text-white">Create Event</h2>

        <div className="flex flex-col space-y-2">
          <label className="text-sm text-white/70">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3 py-2 rounded-lg border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event title"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm text-white/70">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm text-white/70">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 rounded-lg border border-white/20 bg-white/5 text-white h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event details"
          ></textarea>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm text-white/70">Poster</label>
          <input
            type="file"
            onChange={(e) => setPoster(e.target.files[0])}
            className="text-white"
          />
        </div>

        <button
          onClick={createEvent}
          disabled={loading}
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 transition-colors text-white font-semibold"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>

        {err && <p className="text-red-500 text-center">{err}</p>}
        {success && <p className="text-green-400 text-center">{success}</p>}
      </div>
    </div>
  );
}

export default CreateEvent;
