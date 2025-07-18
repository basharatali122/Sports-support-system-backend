// const express = require('express');
// const router = express.Router();
// const {
//   getEvents,
//   createEvent,
//   registerForEvent,
//   approveEvent
// } = require('../Controller/eventController');
// const { auth, role } = require('../middleware/auth');

// // Get all events
// router.get('/', getEvents);

// // Create new event (protected)
// router.post('/', auth, role('coach', 'admin'), createEvent);

// // Register for event
// router.post('/:eventId/register', auth, registerForEvent);

// // Approve event (admin only)
// router.patch('/:eventId/approve', auth, role('admin'), approveEvent);

// module.exports = router;



const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  registerForEvent,
  approveEvent,
  getAllEvents,getParticipantEvents,getEventById ,
  getCoachRegistrations,updateRegistrationStatus
} = require('../Controller/eventController');
const { auth, role } = require('../middleware/auth');

// Get all events
router.get('/', getEvents);
router.get("/getEventById/:eventId",getEventById )
router.get("/:eventId/register",registerForEvent)
router.get('/getParticipantEvents',getParticipantEvents)

// Create a new event (protected: only coach and admin can create events)
router.post('/creatEvent', auth, role('coach', 'admin'), createEvent);

// get all events route
router.get("/getAllEvents",getAllEvents)

// Register for an event (protected: requires authentication)
router.post('/:eventId/register',  registerForEvent);

// Approve an event (admin only - PATCH method for partial update)
router.patch('/:eventId/approve', approveEvent);

// Fetch all registrations for coach's events
router.get("/coach/registrations",auth, getCoachRegistrations);

// Update status of a specific registration
router.patch("/coach/registrations/:id",auth, updateRegistrationStatus);

module.exports = router;
