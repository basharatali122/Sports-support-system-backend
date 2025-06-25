const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "Please provide a valid email address",
    },
  },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["participant", "coach", "admin"],
    default: "participant",
  },

  // ✅ New field for coach's selected sport
  sport: {
    type: String,
    enum: ['Cricket', 'Football', 'Tennis', 'Hockey'],
    required: function () {
      return this.role === 'coach';
    }
  },

  approved: { type: Boolean, default: false },
  approvedByCoach: { type: Boolean, default: true },

  sportsPreferences: [String],
  pastParticipation: [String],
  achievements: [String],
  expertise: [String],

  accountStatus: { 
    type: String, 
    enum: ["active", "blocked"], 
    default: "active" 
  },

  approvalStatus: {
    type: String,
    enum: ["pending-coach", "pending-admin", "approved", "rejected"],
    default: "pending-coach"
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }],

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model("User", UserSchema);
