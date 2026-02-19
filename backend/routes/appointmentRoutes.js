const express = require('express');
const router = express.Router();
const { protect, patientOnly } = require('../middleware/authMiddleware');
const {
    getApprovedDoctors, getDoctorDetail, bookAppointment,
    getMyAppointments, cancelAppointment, getPatientStats
} = require('../controllers/appointmentController');

// Public-ish (requires login, any role can browse)
router.get('/doctors', protect, getApprovedDoctors);
router.get('/doctors/:id', protect, getDoctorDetail);

// Patient only
router.post('/book', protect, patientOnly, bookAppointment);
router.get('/mine', protect, patientOnly, getMyAppointments);
router.get('/patient/stats', protect, patientOnly, getPatientStats);
router.delete('/:id', protect, patientOnly, cancelAppointment);

module.exports = router;
