const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    specialization: { type: String },
    fees: { type: Number },
    date: { type: String, required: true },   // e.g. "2024-02-20"
    slot: { type: String, required: true },   // e.g. "10:00 AM"
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
