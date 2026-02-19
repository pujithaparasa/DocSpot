const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // attach full user doc
        if (decoded.role === 'doctor') {
            req.userDoc = await Doctor.findById(decoded.id).select('-password');
        } else {
            req.userDoc = await User.findById(decoded.id).select('-password');
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next();
    return res.status(403).json({ message: 'Admin access only' });
};

const doctorOnly = (req, res, next) => {
    if (req.user && req.user.role === 'doctor') return next();
    return res.status(403).json({ message: 'Doctor access only' });
};

const patientOnly = (req, res, next) => {
    if (req.user && req.user.role === 'patient') return next();
    return res.status(403).json({ message: 'Patient access only' });
};

module.exports = { protect, adminOnly, doctorOnly, patientOnly };
