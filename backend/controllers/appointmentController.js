const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// GET /api/appointments/doctors  — list all approved doctors
const getApprovedDoctors = async (req, res) => {
    try {
        const { specialization, search } = req.query;
        const filter = { status: 'approved' };
        if (specialization) filter.specialization = { $regex: specialization, $options: 'i' };
        if (search) filter.name = { $regex: search, $options: 'i' };
        const doctors = await Doctor.find(filter).select('-password');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/appointments/doctors/:id  — doctor detail + booked slots
const getDoctorDetail = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).select('-password');
        if (!doctor || doctor.status !== 'approved') return res.status(404).json({ message: 'Doctor not found' });

        // Get booked slots for next 30 days
        const appointments = await Appointment.find({
            doctorId: req.params.id,
            status: { $ne: 'cancelled' },
        }).select('date slot');

        res.json({ doctor, bookedSlots: appointments });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/appointments/book
const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, slot } = req.body;
        const patientId = req.user.id;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor || doctor.status !== 'approved') return res.status(404).json({ message: 'Doctor not found' });

        // Check slot not already booked
        const existing = await Appointment.findOne({ doctorId, date, slot, status: { $ne: 'cancelled' } });
        if (existing) return res.status(400).json({ message: 'This slot is already booked. Please choose another.' });

        const appointment = await Appointment.create({
            patientId,
            doctorId,
            patientName: req.userDoc.name,
            doctorName: doctor.name,
            specialization: doctor.specialization,
            fees: doctor.fees,
            date,
            slot,
        });
        res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/appointments/mine  — patient's own appointments
const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user.id }).sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE /api/appointments/:id  — cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const appt = await Appointment.findOneAndUpdate(
            { _id: req.params.id, patientId: req.user.id, status: 'pending' },
            { status: 'cancelled' },
            { new: true }
        );
        if (!appt) return res.status(404).json({ message: 'Appointment not found or cannot be cancelled' });
        res.json({ message: 'Appointment cancelled', appointment: appt });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/appointments/patient/stats
const getPatientStats = async (req, res) => {
    try {
        const total = await Appointment.countDocuments({ patientId: req.user.id });
        const pending = await Appointment.countDocuments({ patientId: req.user.id, status: 'pending' });
        const completed = await Appointment.countDocuments({ patientId: req.user.id, status: 'completed' });
        res.json({ total, pending, completed });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getApprovedDoctors, getDoctorDetail, bookAppointment, getMyAppointments, cancelAppointment, getPatientStats };
