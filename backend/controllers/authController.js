const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password, role, phone, age, gender, specialization, experience, fees, about, availability } = req.body;

        if (role === 'doctor') {
            const exists = await Doctor.findOne({ email });
            if (exists) return res.status(400).json({ message: 'Email already registered' });

            const hashed = await bcrypt.hash(password, 10);
            const doctor = await Doctor.create({
                name, email, password: hashed, specialization, experience: Number(experience),
                fees: Number(fees), about: about || '', phone: phone || '',
                availability: availability || [], status: 'pending',
            });
            return res.status(201).json({ message: 'Doctor registered. Await admin approval.' });
        }

        // Patient
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already registered' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role: 'patient', phone, age, gender });
        const token = generateToken(user._id, user.role);
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check admin
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Upsert admin user in DB
            let admin = await User.findOne({ email, role: 'admin' });
            if (!admin) {
                const hashed = await bcrypt.hash(password, 10);
                admin = await User.create({ name: 'Admin', email, password: hashed, role: 'admin' });
            }
            const token = generateToken(admin._id, 'admin');
            return res.json({ token, user: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' } });
        }

        // Check doctor
        const doctor = await Doctor.findOne({ email });
        if (doctor) {
            const match = await bcrypt.compare(password, doctor.password);
            if (!match) return res.status(401).json({ message: 'Invalid credentials' });
            if (doctor.status === 'pending') return res.status(403).json({ message: 'Your account is pending admin approval' });
            if (doctor.status === 'rejected') return res.status(403).json({ message: 'Your application was rejected' });
            const token = generateToken(doctor._id, 'doctor');
            return res.json({ token, user: { id: doctor._id, name: doctor.name, email: doctor.email, role: 'doctor', specialization: doctor.specialization } });
        }

        // Check patient
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id, user.role);
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/auth/me
const getMe = async (req, res) => {
    try {
        res.json({ user: req.userDoc, role: req.user.role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { register, login, getMe };
