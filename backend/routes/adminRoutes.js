const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    getPendingDoctors, getAllDoctors, approveDoctor, rejectDoctor,
    getAllUsers, getAllAppointments, getStats
} = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/doctors/pending', getPendingDoctors);
router.get('/doctors', getAllDoctors);
router.put('/doctors/:id/approve', approveDoctor);
router.put('/doctors/:id/reject', rejectDoctor);
router.get('/users', getAllUsers);
router.get('/appointments', getAllAppointments);

module.exports = router;
