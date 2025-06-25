const usersSchema = require("../Models/usersSchema");
const { hash } = require("bcrypt");
const responseHandler = require("../../responseHandler");

const jwt = require("jsonwebtoken");
module.exports = {
  // Route: GET /api/check-admin
adminCheck: async (req, res) => {
  try {
    const admin = await usersSchema.findOne({ role: "admin" });
    res.json({ adminExists: !!admin });
  } catch (err) {
    res.status(500).json({ message: "Error checking admin", error: err.message });
  }
},

  getAllUsers: async (req, res) => {
    try {
      const user = await usersSchema.find();
      res.json(user);
    } catch (error) {
      console.error("Error in find user: ", error);
    }
  },


  getAllCoaches: async (req, res) => {
  try {
    const coaches = await usersSchema.find({ role: "coach" });
    res.json(coaches);
  } catch (error) {
    console.error("Error in finding coaches: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
},

getAllparticipant: async (req, res) => {
  try {
    const coaches = await usersSchema.find({ role: "participant" });
    res.json(coaches);
  } catch (error) {
    console.error("Error in finding coaches: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
},


getOrganizers: async (req, res) => {
  try {
    // You treat "coach" as the organizer role
    const users = await usersSchema.find({ role: "coach" });

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No organizers (coaches) found",
      });
    }

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching organizers:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

  
  
  ,





  approveUser: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await usersSchema.findByIdAndUpdate(
        userId,
        { status: "approved",
          approved: true,
         },
        { new: true }
      );

      if (!user) {
        return responseHandler(res, {
          status: 404,
          message: "User not found",
          data: null,
        });
      }

      return responseHandler(res, {
        status: 200,
        message: "User approved successfully",
        data: user,
      });
    } catch (error) {
      console.error("Approve user error:", error);
      return responseHandler(res, {
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

createUser: async (req, res) => {
  try {
    const { name, email, password, role, sport } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await usersSchema.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    // Prevent multiple admins
    if (role === "admin") {
      const existingAdmin = await usersSchema.findOne({ role: "admin" });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          error: "An admin account already exists",
        });
      }
    }

    // ✅ Coach-specific validation for sport
    if (role === "coach") {
      const validSports = ['Cricket', 'Football', 'Tennis', 'Hockey'];
      if (!sport || !validSports.includes(sport)) {
        return res.status(400).json({
          success: false,
          error: "Coaches must select a valid sport (Cricket, Football, Tennis, Hockey)",
        });
      }
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser = new usersSchema({
      name,
      email,
      password: hashedPassword,
      role: role || "participant",
      sport: role === "coach" ? sport : undefined,
      accountStatus: "active",
      approvalStatus: "pending-coach",
    });

    const savedUser = await newUser.save();

    // Response
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      sport: savedUser.sport || null,
      accountStatus: savedUser.accountStatus,
      approvalStatus: savedUser.approvalStatus,
    };

    return res.status(201).json({
      success: true,
      data: userResponse,
    });

  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
}

  ,
  rejectUser: async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await usersSchema.findByIdAndUpdate(
        userId,
        { status: "rejected" },
        { new: true }
      );

      if (!user) {
        return responseHandler(res, {
          status: 404,
          message: "User not found",
          data: null,
        });
      }

      return responseHandler(res, {
        status: 200,
        message: "User rejected successfully",
        data: user,
      });
    } catch (error) {
      console.error("Reject user error:", error);
      return responseHandler(res, {
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  getOneUser: async (req, res) => {
    try {
      const user = await usersSchema.findOne();
      res.json(user);
    } catch (error) {
      console.error("Error in find user: ", error);
    }
  },
getUserById: async (req, res) => {
  try {
    const user = await usersSchema.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
},

updateUser: async (req, res) => {
  try {
    const { name, email, sportsPreferences, achievements } = req.body;
    const updatedUser = await usersSchema.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        sportsPreferences,
        achievements,
      },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
},
 getProfile: async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await usersSchema.findById(decoded.id).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error in getProfile:", err);
    res.status(500).json({ error: "Server error" });
  }
},

// PUT /users/profile/updateProfile
updateProfile: async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);

    const { name, email, sportsPreferences, achievements } = req.body;

    const updatedUser = await usersSchema.findByIdAndUpdate(
      decoded.id,
      {
        name,
        email,
        sportsPreferences,
        achievements,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error in updateProfile:", err);
    res.status(500).json({ error: "Server error" });
  }
},

}


