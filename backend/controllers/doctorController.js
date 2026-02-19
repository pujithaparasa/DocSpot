const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// GET /api/doctor/profile
const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user.id).select('-password');
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/doctor/profile
const updateDoctorProfile = async (req, res) => {
    try {
        const { name, phone, fees, about, experience, address, availability } = req.body;
        const updated = await Doctor.findByIdAndUpdate(
            req.user.id,
            { name, phone, fees: Number(fees), about, experience: Number(experience), address, availability },
            { new: true }
        ).select('-password');
        res.json({ message: 'Profile updated', doctor: updated });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/doctor/appointments
const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.user.id }).sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/doctor/appointments/:id/complete
const completeAppointment = async (req, res) => {
    try {
        const appt = await Appointment.findOneAndUpdate(
            { _id: req.params.id, doctorId: req.user.id },
            { status: 'completed' },
            { new: true }
        );
        if (!appt) return res.status(404).json({ message: 'Appointment not found' });
        res.json({ message: 'Appointment marked completed', appointment: appt });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/doctor/stats
const getDoctorStats = async (req, res) => {
    try {
        const total = await Appointment.countDocuments({ doctorId: req.user.id });
        const pending = await Appointment.countDocuments({ doctorId: req.user.id, status: 'pending' });
        const completed = await Appointment.countDocuments({ doctorId: req.user.id, status: 'completed' });
        res.json({ total, pending, completed });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getDoctorProfile, updateDoctorProfile, getDoctorAppointments, completeAppointment, getDoctorStats };
