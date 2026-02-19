const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// GET /api/admin/doctors/pending
const getPendingDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ status: 'pending' }).select('-password');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/admin/doctors
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().select('-password');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/admin/doctors/:id/approve
const approveDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true }).select('-password');
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json({ message: 'Doctor approved', doctor });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/admin/doctors/:id/reject
const rejectDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true }).select('-password');
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json({ message: 'Doctor rejected', doctor });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'patient' }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/admin/appointments
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const totalDoctors = await Doctor.countDocuments({ status: 'approved' });
        const pendingDoctors = await Doctor.countDocuments({ status: 'pending' });
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalAppointments = await Appointment.countDocuments();
        res.json({ totalDoctors, pendingDoctors, totalPatients, totalAppointments });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getPendingDoctors, getAllDoctors, approveDoctor, rejectDoctor, getAllUsers, getAllAppointments, getStats };
