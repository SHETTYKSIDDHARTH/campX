import express from 'express';
import {
  CreateRide,
  updateRide,
  deleteRide,
  viewAllride,
  mylistedRides,
  bookRide,
  viewBookingReq,
  decideBookingReq
} from '../controller/rides.controller.js';
import {
  authMiddleware,
  adminMiddleware,
  studentMiddleware
} from '../middleware/auth.middleware.js';

const RidesRouter = express.Router();

// Public: View all listed rides
RidesRouter.get('/all', viewAllride);

// Authenticated Student: Create a new ride
RidesRouter.post('/', authMiddleware, studentMiddleware, CreateRide);

// Authenticated Student: Update a ride they own
RidesRouter.put('/:id', authMiddleware, studentMiddleware, updateRide);

// Authenticated Student/Admin: Delete a ride
RidesRouter.delete('/:id', authMiddleware, studentMiddleware, deleteRide);

// Authenticated Student: View their own listed rides
RidesRouter.get('/my', authMiddleware, studentMiddleware, mylistedRides);

// Authenticated Student: Book a ride
RidesRouter.post('/book', authMiddleware, studentMiddleware, bookRide);

// Authenticated Student: View booking requests for their rides
RidesRouter.get('/bookings/requests', authMiddleware, studentMiddleware, viewBookingReq);

// Authenticated Student: Accept or reject booking requests
RidesRouter.patch('/bookings/:bookingId/decision', authMiddleware, studentMiddleware, decideBookingReq);

export default RidesRouter;
