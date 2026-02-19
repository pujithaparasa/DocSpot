const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    day: { type: String, required: true },
    slots: [{ type: String }],
}, { _id: false });

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: 'doctor' },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    fees: { type: Number, required: true },
    about: { type: String, default: '' },
    image: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    availability: [slotSchema],
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
