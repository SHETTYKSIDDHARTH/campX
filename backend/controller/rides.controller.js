import Ride from '../models/ride.model.js';
import RideBooking from '../models/rideBooking.model.js';

// Create ride
export const CreateRide = async (req, res) => {
  try {
    const { departure, from, to, via, price } = req.body;

    if (!departure || !from || !to || !price) {
      return res.status(400).json({ message: "Fields missing" });
    }

    const ride = await Ride.create({
      departure,
      from,
      to,
      via: via || [],
      price,
      driver: req.user._id,
      status: "listed",
    });

    res.status(201).json({ message: "Ride created successfully", ride });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// Update ride
export const updateRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (String(ride.driver) !== String(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { departure, from, to, via, price, status } = req.body;

    if (departure) ride.departure = departure;
    if (from) ride.from = from;
    if (to) ride.to = to;
    if (via) ride.via = via;
    if (price) ride.price = price;
    if (status && ["listed", "booking_accepted", "cancelled"].includes(status)) {
      ride.status = status;
    }

    await ride.save();
    res.json({ message: "Ride updated", ride });
  } catch (err) {
    console.error("updateRide error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete ride
export const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (String(ride.driver) !== String(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Ride.findByIdAndDelete(ride._id);
    await RideBooking.deleteMany({ ride: ride._id });

    res.json({ message: "Ride deleted successfully" });
  } catch (err) {
    console.error("deleteRide error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// View all listed rides
export const viewAllride = async (req, res) => {
  try {
    const data = await Ride.find({ status: "listed" }).populate("driver", "name email");

    return res.status(200).json({ 
      message: data.length ? "Rides fetched successfully" : "No rides available", 
      rides: data 
    });
  } catch (error) {
    console.error("Error fetching rides:", error);
    return res.status(500).json({ message: "Error in displaying all rides" });
  }
};

// My listed rides 
export const mylistedRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id });

    return res.status(200).json({ 
      message: rides.length ? "Your rides fetched successfully" : "You have no listed rides", 
      rides: rides 
    });
  } catch (error) {
    console.error("Error while listing my rides:", error);
    return res.status(500).json({ message: "Error while listing my rides" });
  }
};

// Book ride
export const bookRide = async (req, res) => {
  try {
    const { rideId, destn } = req.body;
    const passengerId = req.user._id;

    if (!rideId || !destn) {
      return res.status(400).json({ message: "Ride ID and destination are required" });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (String(ride.driver) === String(passengerId)) {
      return res.status(400).json({ message: "You cannot book your own ride" });
    }

    if (ride.status !== "listed") {
      return res.status(400).json({ message: "Ride is not available for booking" });
    }

    // Check if user has already booked this ride
    const existingBooking = await RideBooking.findOne({
      ride: rideId,
      passenger: passengerId,
      status: { $in: ["pending", "accepted"] }
    });
    if (existingBooking) {
      return res.status(400).json({ message: "You have already requested this ride" });
    }


    let totalPrice = 0;
    const validDestinations = [ride.to];
    
  
    if (ride.via && ride.via.length > 0) {
      ride.via.forEach(v => validDestinations.push(v.location));
    }

    if (!validDestinations.includes(destn)) {
      return res.status(400).json({ 
        message: `Invalid destination. Valid destinations are: ${validDestinations.join(", ")}` 
      });
    }

    
    if (ride.to === destn) {
      totalPrice = ride.price;
    } else {
    
      const viaPoint = ride.via.find(v => v.location === destn);
      if (viaPoint) {
        totalPrice = viaPoint.price;
      } else {
        return res.status(400).json({ message: "Invalid destination" });
      }
    }


    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: "Unable to calculate price for this destination" });
    }

    const booking = new RideBooking({
      ride: ride._id,
      passenger: passengerId,
      destn: destn,
      seatsBooked: 1,
      totalPrice: totalPrice,
      status: "pending"
    });

    await booking.save();

    return res.status(201).json({
      message: "Ride booking request sent to driver",
      booking
    });
  } catch (error) {
    console.error("Book ride error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already requested this ride" });
    }
    return res.status(500).json({ message: "Error while booking ride" });
  }
};

// View booking requests for a driver 
export const viewBookingReq = async (req, res) => {
  try {
    const driverRides = await Ride.find({ driver: req.user._id });

    if (!driverRides.length) {
      return res.status(200).json({ 
        message: "You have no rides listed", 
        bookings: [] 
      });
    }

    const rideIds = driverRides.map(r => r._id);

    const pendingBookings = await RideBooking.find({
      ride: { $in: rideIds },
      status: "pending"
    })
      .populate("passenger", "name email")
      .populate("ride", "from to via departure");

    return res.status(200).json({
      message: pendingBookings.length ? "Pending booking requests fetched successfully" : "No pending booking requests",
      bookings: pendingBookings
    });
  } catch (error) {
    console.error("View booking requests error:", error);
    return res.status(500).json({ message: "Error while fetching booking requests" });
  }
};

// Get user's own bookings
export const myBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await RideBooking.find({ passenger: userId })
      .populate({
        path: "ride",
        select: "from to via departure driver status",
        populate: {
          path: "driver",
          select: "name email"
        }
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: bookings.length ? "Your bookings fetched successfully" : "You have no bookings",
      bookings: bookings
    });
  } catch (error) {
    console.error("My bookings error:", error);
    return res.status(500).json({ message: "Error while fetching your bookings" });
  }
};

// Cancel booking (for passengers)
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await RideBooking.findById(bookingId).populate("ride");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.passenger) !== String(userId)) {
      return res.status(403).json({ message: "You are not authorized to cancel this booking" });
    }

    if (!["pending", "accepted"].includes(booking.status)) {
      return res.status(400).json({ message: "Cannot cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    // If the booking was accepted, update ride status back to listed
    if (booking.status === "accepted") {
      await Ride.findByIdAndUpdate(booking.ride._id, { status: "listed" });
    }

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return res.status(500).json({ message: "Error while cancelling booking" });
  }
};

// Accept or reject booking 
export const decideBookingReq = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { decision } = req.body;
    const driverId = req.user._id;

    if (!["accepted", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "Decision must be 'accepted' or 'rejected'" });
    }

    const booking = await RideBooking.findById(bookingId).populate("ride");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.ride.driver) !== String(driverId)) {
      return res.status(403).json({ message: "You are not authorized to decide this booking" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Booking has already been decided" });
    }

    booking.status = decision;
    await booking.save();

    if (decision === "accepted") {
      // Update ride status and reject all other pending bookings for this ride
      await Ride.findByIdAndUpdate(booking.ride._id, { status: "booking_accepted" });
      
      // Reject all other pending bookings for this ride
      await RideBooking.updateMany(
        { 
          ride: booking.ride._id, 
          status: "pending", 
          _id: { $ne: bookingId } 
        },
        { status: "rejected" }
      );
    }

    return res.status(200).json({
      message: `Booking ${decision} successfully`,
      booking
    });
  } catch (error) {
    console.error("Decide booking error:", error);
    return res.status(500).json({ message: "Error while deciding booking request" });
  }
};