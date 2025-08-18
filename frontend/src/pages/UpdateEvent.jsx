import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BackendURL } from "../../config.js";
import ChairmanNav from "../components/ChairmanNav.jsx";

function UpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    poster: "",
  });
  const [posterFile, setPosterFile] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BackendURL}/chair/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const event = res.data;
        setFormData({
          title: event.title || "",
          date: event.date ? event.date.split("T")[0] : "",
          description: event.description || "",
          poster: event.poster || "",
        });
      } catch (err) {
        console.error("Error fetching event:", err);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPosterFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      // Append only if field is changed
      if (formData.title) data.append("title", formData.title);
      if (formData.date) data.append("date", formData.date);
      if (formData.description) data.append("description", formData.description);
      if (posterFile) {
        data.append("poster", posterFile);
      }

      await axios.put(`${BackendURL}/chair/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/my-event");
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navbar always at top */}
      <ChairmanNav />

      {/* Centered form */}
      <div className="flex-1 flex justify-center items-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Update Event
          </h2>

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          ></textarea>

          {/* Poster Preview */}
          {formData.poster && (
            <div className="flex flex-col items-center">
              <img
                src={formData.poster}
                alt="Current Poster"
                className="h-40 mb-2 rounded-md"
              />
              <p className="text-sm text-gray-500">Current Poster</p>
            </div>
          )}

          {/* Upload New Poster */}
          <input
            type="file"
            name="poster"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateEvent;
