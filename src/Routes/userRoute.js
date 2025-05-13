const express = require("express");
const {
  getAllUsers,
  approveUser,
  createUser,
  rejectUser,
  adminCheck,
} = require("../Controller/userController");

const router = express.Router();

router.get("/getAllUsers", getAllUsers);
router.get("/admin-check", adminCheck);
router.post("/create", createUser);
router.patch("/:userId/approve", approveUser);
router.delete("/:userId/reject", rejectUser);

module.exports = router;
