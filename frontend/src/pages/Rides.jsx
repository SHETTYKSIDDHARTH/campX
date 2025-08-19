import React, { useEffect, useState } from "react";
import { Car, Clock, MapPin, User, X, Check, Plus, AlertCircle, Trash2, BookOpen, Calendar, CreditCard } from "lucide-react";
import axios from "axios";
import { BackendURL } from '../../config.js';
import StudentNav from '../components/StudentNav.jsx'
function Rides() {
  const [allRides, setAllRides] = useState([]);
  const [myRides, setMyRides] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [form, setForm] = useState({ from: "", to: "", via: "", departure: "", price: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: BackendURL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Fetch functions
  const fetchAllRides = async () => {
    try {
      const { data } = await axiosInstance.get("/ride/all");
      setAllRides(data.rides || []);
    } catch (err) {
      console.error("Fetch all rides error:", err);
      setAllRides([]);
    }
  };

  const fetchMyRides = async () => {
    try {
      const { data } = await axiosInstance.get("/ride/my");
      setMyRides(data.rides || []);
    } catch (err) {
      console.error("Fetch my rides error:", err);
      setMyRides([]);
    }
  };

  const fetchBookingReqs = async () => {
    try {
      const { data } = await axiosInstance.get("/ride/bookings/requests");
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setBookings([]);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const { data } = await axiosInstance.get("/ride/bookings/my");
      setMyBookings(data.bookings || []);
    } catch (err) {
      console.error("Fetch my bookings error:", err);
      setMyBookings([]);
    }
  };

  useEffect(() => {
    fetchAllRides();
    if (token) {
      fetchMyRides();
      fetchBookingReqs();
      fetchMyBookings();
    }
  }, [token]);

  // Create ride
  const createRide = async (e) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.departure || !form.price) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      await axiosInstance.post("/ride", {
        from: form.from,
        to: form.to,
        via: form.via ? [{ location: form.via, price: parseInt(form.price) }] : [],
        departure: form.departure,
        price: parseInt(form.price),
      });

      setForm({ from: "", to: "", via: "", departure: "", price: "" });
      setSuccess("Ride created successfully!");
      fetchMyRides();
      fetchAllRides();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ride");
    } finally {
      setLoading(false);
    }
  };

  const deleteRide = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ride?")) return;

    try {
      await axiosInstance.delete(`/ride/${id}`);
      setSuccess("Ride deleted successfully!");
      fetchMyRides();
      fetchAllRides();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete ride");
    }
  };

  const bookRide = async (rideId, ride) => {
    if (!token) {
      setError("Please login to book a ride");
      return;
    }

    const destinations = [ride.to];
    if (ride.via && ride.via.length > 0) {
      destinations.unshift(...ride.via.map(v => v.location));
    }

    let selectedDestination = destinations[0];
    if (destinations.length > 1) {
      const choice = prompt(
        `Select your destination:\n${destinations.map((dest, i) => `${i + 1}. ${dest}`).join('\n')}\n\nEnter the number of your choice:`
      );
      const destIndex = parseInt(choice) - 1;
      if (isNaN(destIndex) || destIndex < 0 || destIndex >= destinations.length) {
        setError("Invalid destination selection");
        return;
      }
      selectedDestination = destinations[destIndex];
    }

    try {
      await axiosInstance.post("/ride/book", { rideId, destn: selectedDestination });
      setSuccess("Booking request sent successfully!");
      fetchAllRides();
      fetchMyBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  const decideBooking = async (bookingId, decision) => {
    try {
      await axiosInstance.patch(`/ride/bookings/${bookingId}/decision`, { decision });
      setSuccess(`Booking ${decision} successfully!`);
      fetchBookingReqs();
      fetchAllRides();
      fetchMyBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update booking");
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axiosInstance.patch(`/ride/bookings/${bookingId}/cancel`);
      setSuccess("Booking cancelled successfully!");
      fetchMyBookings();
      fetchAllRides();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const getPriceDisplay = (ride) => {
    if (ride.via && ride.via.length > 0) {
      const minPrice = Math.min(ride.price, ...ride.via.map(v => v.price));
      const maxPrice = Math.max(ride.price, ...ride.via.map(v => v.price));
      return minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`;
    }
    return `₹${ride.price}`;
  };

  const getStatusDisplay = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-900/30 text-yellow-400 border-yellow-700', text: 'PENDING' },
      accepted: { color: 'bg-green-900/30 text-green-400 border-green-700', text: 'ACCEPTED' },
      rejected: { color: 'bg-red-900/30 text-red-400 border-red-700', text: 'REJECTED' },
      cancelled: { color: 'bg-gray-900/30 text-gray-400 border-gray-700', text: 'CANCELLED' },
      completed: { color: 'bg-blue-900/30 text-blue-400 border-blue-700', text: 'COMPLETED' }
    };
    return statusConfig[status] || statusConfig.pending;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <StudentNav/>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Car className="text-blue-700" size={32} />
          <h1 className="text-3xl font-bold">Rides</h1>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-6 flex items-center gap-3">
            <Check className="text-green-500" size={20} />
            <span className="text-green-400">{success}</span>
          </div>
        )}

        {/* Login Message for non-authenticated users */}
        {!token && (
          <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6 mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <User className="text-blue-400" size={20} />
              <p className="text-blue-400">Please login to create rides and manage bookings</p>
            </div>
          </div>
        )}

        {/* Create Ride Form - Only show if user is logged in */}
        {token && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Plus className="text-blue-700" size={20} />
              <h2 className="text-xl font-semibold">Create New Ride</h2>
            </div>
            
            <form onSubmit={createRide} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">From *</label>
                <input
                  type="text"
                  placeholder="Starting location"
                  className="w-full p-3 rounded-lg bg-black border border-gray-600 focus:border-blue-700 focus:outline-none transition-colors"
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">To *</label>
                <input
                  type="text"
                  placeholder="Destination"
                  className="w-full p-3 rounded-lg bg-black border border-gray-600 focus:border-blue-700 focus:outline-none transition-colors"
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Via (Optional)</label>
                <input
                  type="text"
                  placeholder="Intermediate stop"
                  className="w-full p-3 rounded-lg bg-black border border-gray-600 focus:border-blue-700 focus:outline-none transition-colors"
                  value={form.via}
                  onChange={(e) => setForm({ ...form, via: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Price (₹) *</label>
                <input
                  type="number"
                  placeholder="Price per seat"
                  min="1"
                  className="w-full p-3 rounded-lg bg-black border border-gray-600 focus:border-blue-700 focus:outline-none transition-colors"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-300">Departure Time *</label>
                <input
                  type="datetime-local"
                  className="w-full p-3 rounded-lg bg-black border border-gray-600 focus:border-blue-700 focus:outline-none transition-colors [color-scheme:dark]"
                  value={form.departure}
                  onChange={(e) => setForm({ ...form, departure: e.target.value })}
                  min={getCurrentDateTime()}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Select departure date and time</p>
              </div>
              
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-blue-800 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Create Ride
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* All Rides */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <MapPin className="text-blue-700" size={24} />
            Available Rides
          </h2>
          
          {allRides.length > 0 ? (
            <div className="grid gap-4">
              {allRides.map((ride) => (
                <div key={ride._id} className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-blue-700 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-lg">
                        <span className="font-semibold">{ride.from}</span>
                        <span className="text-blue-700">→</span>
                        <span className="font-semibold">{ride.to}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          {formatDateTime(ride.departure)}
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{getPriceDisplay(ride)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>{ride.driver?.name || 'Driver'}</span>
                        </div>
                      </div>
                      
                      {ride.via && ride.via.length > 0 && (
                        <div className="text-sm text-gray-400">
                          Via: {ride.via.map(v => `${v.location} (₹${v.price})`).join(", ")}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => bookRide(ride._id, ride)}
                      disabled={!token}
                      className="bg-blue-700 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      {!token ? "Login to Book" : "Book Now"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center">
              <Car className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">No rides available at the moment</p>
            </div>
          )}
        </div>

 
        {token && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <BookOpen className="text-blue-700" size={24} />
              My Bookings
            </h2>
            
            {myBookings.length > 0 ? (
              <div className="grid gap-4">
                {myBookings.map((booking) => {
                  const statusDisplay = getStatusDisplay(booking.status);
                  return (
                    <div key={booking._id} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusDisplay.color}`}>
                              {statusDisplay.text}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-lg">
                            <span className="font-semibold">{booking.ride?.from || 'N/A'}</span>
                            <span className="text-blue-700">→</span>
                            <span className="font-semibold">{booking.destn}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-gray-400 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              {booking.ride?.departure ? formatDateTime(booking.ride.departure) : 'N/A'}
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard size={16} />
                              ₹{booking.totalPrice}
                            </div>
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span>{booking.ride?.driver?.name || 'Driver'}</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Booked on: {formatDateTime(booking.bookingDate || booking.createdAt)}
                          </div>
                        </div>
                        
                        {(booking.status === 'pending' || booking.status === 'accepted') && (
                          <button
                            onClick={() => cancelBooking(booking._id)}
                            className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                          >
                            <X size={16} />
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center">
                <BookOpen className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">You haven't booked any rides yet</p>
              </div>
            )}
          </div>
        )}


        {token && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <User className="text-blue-700" size={24} />
              My Listed Rides
            </h2>
            
            {myRides.length > 0 ? (
              <div className="grid gap-4">
                {myRides.map((ride) => (
                  <div key={ride._id} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-lg">
                          <span className="font-semibold">{ride.from}</span>
                          <span className="text-blue-700">→</span>
                          <span className="font-semibold">{ride.to}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            {formatDateTime(ride.departure)}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ride.status === 'listed' ? 'bg-green-900/30 text-green-400 border border-green-700' :
                            ride.status === 'booking_accepted' ? 'bg-blue-900/30 text-blue-400 border border-blue-700' :
                            'bg-red-900/30 text-red-400 border border-red-700'
                          }`}>
                            {ride.status?.replace('_', ' ')?.toUpperCase()}
                          </span>
                        </div>
                        
                        {ride.via && ride.via.length > 0 && (
                          <div className="text-sm text-gray-400">
                            Via: {ride.via.map(v => `${v.location} (₹${v.price})`).join(", ")}
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => deleteRide(ride._id)}
                        className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center">
                <Car className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">You haven't listed any rides yet</p>
              </div>
            )}
          </div>
        )}

        {/* Booking Requests - Only show if user is logged in */}
        {(
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <AlertCircle className="text-blue-700" size={24} />
              Booking Requests
            </h2>
            
            {bookings.length > 0 ? (
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-700 p-2 rounded-full">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="font-semibold">{booking.passenger?.name}</p>
                            <p className="text-sm text-gray-400">{booking.passenger?.email}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{booking.ride.from}</span>
                            <span className="text-blue-700">→</span>
                            <span className="font-medium">{booking.destn || booking.ride.to}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              {formatDateTime(booking.ride.departure)}
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard size={14} />
                              ₹{booking.totalPrice}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              Requested: {formatDateTime(booking.bookingDate || booking.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => decideBooking(booking._id, "accepted")}
                          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Check size={16} />
                          Accept
                        </button>
                        <button
                          onClick={() => decideBooking(booking._id, "rejected")}
                          className="bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <X size={16} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center">
                <AlertCircle className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">No pending booking requests</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Rides;