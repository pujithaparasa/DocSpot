const express = require('express');
const router = express.Router();
const { protect, doctorOnly } = require('../middleware/authMiddleware');
const {
    getDoctorProfile, updateDoctorProfile, getDoctorAppointments,
    completeAppointment, getDoctorStats
} = require('../controllers/doctorController');

router.use(protect, doctorOnly);

router.get('/stats', getDoctorStats);
router.get('/profile', getDoctorProfile);
router.put('/profile', updateDoctorProfile);
router.get('/appointments', getDoctorAppointments);
router.put('/appointments/:id/complete', completeAppointment);

module.exports = router;
