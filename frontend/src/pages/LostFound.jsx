// src/pages/LostFound.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BackendURL } from "../../config.js";
import StudentNav from "../components/StudentNav.jsx";
import { Search, MapPin, Eye, MessageSquare, Trash2, X, Plus, Upload } from "lucide-react";

function LostFound() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    status: "lost",
    contact: "",
    image: null,
  });

  const token = localStorage.getItem("token");

  // Fetch all lost/found items
  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BackendURL}/lostFound`);
      setItems(res.data.items || []);
    } catch (err) {
      setError("Failed to load items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Create lost/found post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      await axios.post(`${BackendURL}/lostFound`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      setForm({
        title: "",
        description: "",
        location: "",
        status: "lost",
        contact: "",
        image: null,
      });
      setShowCreateForm(false);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  // Claim an item
  const handleClaim = async (id) => {
    const message = prompt("Enter your claim message:");
    if (!message?.trim()) return;
    
    try {
      await axios.post(
        `${BackendURL}/lostFound/${id}/claims`,
        { message: message.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Claim submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting claim");
    }
  };

  // Delete item (owner/admin only)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      await axios.delete(`${BackendURL}/lostFound/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (err) {
      setError("Error deleting item");
    }
  };

  // View item details
  const fetchDetails = async (id) => {
    try {
      const res = await axios.get(`${BackendURL}/lostFound/${id}`);
      setSelected(res.data);
    } catch {
      setError("Error loading item details");
    }
  };

  // Filter items based on search and status
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-black text-blue-400">
      <StudentNav />
      
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Lost & Found</h1>
          <p className="text-blue-600 text-lg">Help reunite lost items with their owners</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-blue-400 placeholder-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          >
            <option value="all">All Items</option>
            <option value="lost">Lost Items</option>
            <option value="found">Found Items</option>
          </select>

          {/* Create Post Button */}
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Post
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-blue-400">Create Post</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter item title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-blue-400 placeholder-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    placeholder="Describe the item"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-blue-400 placeholder-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="Where was it lost/found?"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-blue-400 placeholder-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  >
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contact Information</label>
                  <input
                    type="text"
                    name="contact"
                    placeholder="Email or phone number"
                    value={form.contact}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-blue-400 placeholder-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image (Optional)</label>
                  <div className="relative">
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center gap-2 w-full p-3 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      {form.image ? form.image.name : "Choose Image"}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 py-3 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-blue-400 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Create Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Items Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {statusFilter === "all" ? "All Items" : 
               statusFilter === "lost" ? "Lost Items" : "Found Items"}
            </h2>
            <span className="text-blue-600">
              {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-400 border-t-transparent"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-blue-600 text-lg mb-2">No items found</p>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 group"
                >
                  {/* Item Image */}
                  {item.imageUrl && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Item Content */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-blue-400 line-clamp-2">
                        {item.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === "lost" 
                          ? "bg-red-900/50 text-red-400 border border-red-800" 
                          : "bg-green-900/50 text-green-400 border border-green-800"
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-blue-600 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => fetchDetails(item._id)}
                        className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-400 text-white rounded-lg hover:bg-blue-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleClaim(item._id)}
                        className="flex items-center gap-1 px-3 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Claim
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex items-center gap-1 px-3 py-2 text-sm bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Item Details Modal */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-blue-400 mb-2">
                    {selected.title}
                  </h2>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                    selected.status === "lost" 
                      ? "bg-red-900/50 text-red-400 border border-red-800" 
                      : "bg-green-900/50 text-green-400 border border-green-800"
                  }`}>
                    {selected.status.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selected.imageUrl && (
                <div className="mb-6">
                  <img
                    src={selected.imageUrl}
                    alt={selected.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-blue-600 leading-relaxed">
                    {selected.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Location</h3>
                    <div className="flex items-center gap-2 text-blue-600">
                      <MapPin className="w-5 h-5" />
                      <span>{selected.location}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Contact</h3>
                    <p className="text-blue-600">{selected.contact}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => handleClaim(selected._id)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
                >
                  <MessageSquare className="w-5 h-5" />
                  Claim Item
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LostFound;