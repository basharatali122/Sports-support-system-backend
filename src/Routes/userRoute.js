const express = require("express");
const { auth } = require('../middleware/auth');

const {
  getAllUsers,
  approveUser,
  createUser,
  rejectUser,
  adminCheck,
  getOneUser,
 getOrganizers,
getAllCoaches,
getAllparticipant,
 getUserById,
  updateUser,
    getProfile,
  updateProfile,

} = require("../Controller/userController");

const router = express.Router();

router.get("/getAllUsers", getAllUsers);
router.get("/getAllCoaches", getAllCoaches)
router.get("/getAllparticipant",getAllparticipant)
router.get("/admin-check", adminCheck);
router.post("/create", createUser);
router.patch("/:userId/approve", approveUser);
router.delete("/:userId/reject", rejectUser);
router.get("/:userId/getOne",getOneUser)
router.get("/organizers",getOrganizers)
router.get("/getUserById/:id", getUserById);
router.put("/updateUser/:id", updateUser);

// No middleware needed if token is manually decoded
router.get("/profile/getProfile", getProfile);
router.put("/profile/updateProfile", updateProfile);


module.exports = router;
