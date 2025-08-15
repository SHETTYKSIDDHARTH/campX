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

    res.status(201).json(ride);
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
    const data = await Ride.find({ status: "listed" });

    if (!data.length) {
      return res.status(404).json({ message: "No rides listed" });
    }

    return res.status(200).json({ rides: data });
  } catch (error) {
    console.error("Error fetching rides:", error);
    return res.status(500).json({ message: "Error in displaying all rides" });
  }
};

// My listed rides
export const mylistedRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id });

    if (!rides.length) {
      return res.status(404).json({ message: "You have no listed rides" });
    }

    return res.status(200).json({ rides });
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

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (String(ride.driver) === String(passengerId)) {
      return res.status(400).json({ message: "You cannot book your own ride" });
    }

    if (ride.status !== "listed") {
      return res.status(400).json({ message: "Ride already booked or unavailable" });
    }

    const existingBooking = await RideBooking.findOne({
      ride: rideId,
      status: "pending"
    });
    if (existingBooking) {
      return res.status(400).json({ message: "This ride already has a pending booking" });
    }

    let price;
    if (ride.to === destn) {
      price = ride.via.length ? ride.via[ride.via.length - 1].price : ride.price;
    } else {
      const viaPoint = ride.via.find(v => v.location === destn);
      if (!viaPoint) {
        return res.status(400).json({ message: "Invalid destination" });
      }
      price = viaPoint.price;
    }

    const booking = new RideBooking({
      ride: ride._id,
      passenger: passengerId,
      seatsBooked: 1,
      totalPrice: price,
      status: "pending"
    });

    await booking.save();

    return res.status(201).json({
      message: "Ride booking request sent to driver",
      booking
    });
  } catch (error) {
    console.error(error);
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
      return res.status(404).json({ message: "You have no rides listed" });
    }

    const rideIds = driverRides.map(r => r._id);

    const pendingBookings = await RideBooking.find({
      ride: { $in: rideIds },
      status: "pending"
    })
      .populate("passenger", "name email")
      .populate("ride", "from to via departure");

    if (!pendingBookings.length) {
      return res.status(404).json({ message: "No pending booking requests" });
    }

    return res.status(200).json({
      message: "Pending booking requests fetched successfully",
      bookings: pendingBookings
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error while fetching booking requests" });
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
      await Ride.findByIdAndUpdate(booking.ride._id, { status: "booking_accepted" });
    } else if (decision === "rejected") {
      await Ride.findByIdAndUpdate(booking.ride._id, { status: "listed" });
    }

    return res.status(200).json({
      message: `Booking ${decision} successfully`,
      booking
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error while deciding booking request" });
  }
};
