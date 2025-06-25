// const Event = require('../Models/Event');

// // Register user for an event
// exports.registerForEvent = async (req, res) => {
//   try {
//     const event = await Event.findByIdAndUpdate(
//       req.params.eventId,
//       { $addToSet: { participants: req.user._id } },
//       { new: true }
//     );

//     if (!event) {
//       return res.status(404).json({ message: 'Event not found' });
//     }

//     res.status(200).json({ message: 'Registered for event successfully', event });
//   } catch (error) {
//     res.status(500).json({ message: 'Registration failed', error: error.message });
//   }
// };

// // Approve an event (Admin)
// exports.approveEvent = async (req, res) => {
//   try {
//     const event = await Event.findByIdAndUpdate(
//       req.params.eventId,
//       { approved: true },
//       { new: true }
//     );

//     if (!event) {
//       return res.status(404).json({ message: 'Event not found' });
//     }

//     res.status(200).json({ message: 'Event approved successfully', event });
//   } catch (error) {
//     res.status(500).json({ message: 'Approval failed', error: error.message });
//   }
// };

// // Get all events
// exports.getEvents = async (req, res) => {
//   try {
//     const events = await Event.find()
//       .populate('organizer', 'name email')
//       .populate('participants', 'name email');

//     res.status(200).json({ message: 'Events fetched successfully', events });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching events', error: error.message });
//   }
// };

// // Create a new event
// exports.createEvent = async (req, res) => {
//   try {
//     const event = new Event({
//       ...req.body,
//       organizer: req.user._id
//     });

//     await event.save();

//     res.status(201).json({ message: 'Event created successfully', event });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating event', error: error.message });
//   }
// };


const Event = require('../Models/Event');
const mongoose = require("mongoose");
const eventSchema = require('../Models/Event')

const EventRegistration = require("../Models/EventRegistration")
//get all events 
exports.getAllEvents=async(req,res)=>{
  try{ const events = eventSchema.find();
   res.json(events)}
   catch(err){
console.log("error found in getevnts api..",err)
   }



};
// Register user for an event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      { $addToSet: { participants: req.user._id } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Registered for event successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Approve an event (Admin)
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.eventId,
      { approved: true },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event approved successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Approval failed', error: error.message });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ approved: false })  // <-- filter here
      .populate('coach', 'name email')
      .populate('participants', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({ message: 'Events fetched successfully', events });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};


// Get a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
     // Now it won't be undefined

    const event = await Event.findById(eventId)
      .populate('coach', 'name email')
      .populate('participants', 'name email')
      .populate('createdBy', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event fetched successfully', event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
};




exports.getParticipantEvents = async (req, res) => {
  try {
    const events = await Event.find({ approved: true })  // <-- filter here
      .populate('coach', 'name email')
      .populate('participants', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({ message: 'Events fetched successfully', events });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};



// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, time, location, team, coach, participants } = req.body;

    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      time,
      location,
      team,
      coach,
      participants,
      createdBy: req.user._id, // ✅ use correct field
    });

    await event.save();

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error("❌ Error in createEvent:", error);
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};





// Register a user for an event
exports.registerForEvent = async (req, res) => {
  try {

    console.log("event register api call successfully...")
    const { userId } = req.body;
    const { eventId } = req.params;

    console.log("➡️ Registering user:", userId, "for event:", eventId);

    if (!userId || !eventId) {
      return res.status(400).json({ msg: 'Missing data' });
    }

    const alreadyRegistered = await EventRegistration.findOne({ userId, eventId });
    if (alreadyRegistered) {
      return res.status(400).json({ msg: 'Already registered' });
    }

    const registration = new EventRegistration({ userId, eventId });
    await registration.save();

    return res.status(201).json({ msg: 'Registered successfully' });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};





// Get registrations for events created by coach
 // Make sure this is imported





exports.getCoachRegistrations = async (req, res) => {
  try {
    const coachId = new mongoose.Types.ObjectId(req.user.id);

    const events = await Event.find({});
    console.log("✅ Events found:", events);

    const eventIds = events.map((e) => e._id);
    console.log("✅ Event IDs:", eventIds);

    const registrations = await EventRegistration.find({
      eventId: { $in: eventIds },
    })
      .populate("userId", "name email")
      .populate("eventId", "title");

    console.log("✅ Registrations found:", registrations);

    res.status(200).json({ msg: "Registrations fetched", registrations });
  } catch (error) {
    console.error("❌ Error fetching coach registrations:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};



// Update registration status (accepted/rejected)
exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const registrationId = req.params.id;

    await EventRegistration.findByIdAndUpdate(registrationId, { status });

    res.status(200).json({ msg: "Status updated successfully" });
  } catch (error) {
    console.error("❌ Error updating registration status:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
