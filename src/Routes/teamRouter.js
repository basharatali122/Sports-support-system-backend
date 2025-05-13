const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getTeams,
  createTeam,
  joinTeam,
  leaveTeam,
  updateTeam,
  deleteTeam,
} = require('../Controller/teamController');

router.get('/', getTeams);                      // Public
router.post('/teams', auth, createTeam);              // Coach creates team
router.post('/:teamId/join', auth, joinTeam);     // Player joins team
router.post('/:teamId/leave', auth, leaveTeam);   // Player leaves team
router.patch('/:teamId', auth, updateTeam);       // Coach updates team
router.delete('/:teamId', auth, deleteTeam);      // Coach deletes team

module.exports = router;
