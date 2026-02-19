import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { Stethoscope, User, Mail, Lock, Phone, Briefcase, DollarSign } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
const SPECIALIZATIONS = ['Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'Gynecology', 'Pediatrics', 'General Physician', 'Psychiatry', 'ENT', 'Ophthalmology', 'Urology', 'Oncology'];

const Register = () => {
    const [searchParams] = useSearchParams();
    const [role, setRole] = useState(searchParams.get('role') === 'doctor' ? 'doctor' : 'patient');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', password: '', phone: '', age: '', gender: '',
        specialization: '', experience: '', fees: '', about: '',
    });
    const [availability, setAvailability] = useState([]);

    const toggleSlot = (day, slot) => {
        setAvailability(prev => {
            const dayEntry = prev.find(d => d.day === day);
            if (!dayEntry) return [...prev, { day, slots: [slot] }];
            const slotExists = dayEntry.slots.includes(slot);
            const newSlots = slotExists ? dayEntry.slots.filter(s => s !== slot) : [...dayEntry.slots, slot];
            if (newSlots.length === 0) return prev.filter(d => d.day !== day);
            return prev.map(d => d.day === day ? { ...d, slots: newSlots } : d);
        });
    };

    const isSlotSelected = (day, slot) => {
        return availability.find(d => d.day === day)?.slots.includes(slot) || false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...form, role };
            if (role === 'doctor') payload.availability = availability;
            const res = await register(payload);

            if (role === 'doctor') {
                toast.success('Registration submitted! Await admin approval.');
                navigate('/login');
            } else {
                toast.success('Account created successfully!');
                navigate('/patient/dashboard');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page auth-page-wide">
            <div className="auth-card auth-card-wide">
                <div className="auth-header">
                    <Stethoscope size={40} className="auth-logo" />
                    <h2>Create Account</h2>
                    <p>Join MediBook today</p>
                </div>

                {/* Role Toggle */}
                <div className="role-toggle">
                    <button className={role === 'patient' ? 'active' : ''} onClick={() => setRole('patient')}>
                        Patient
                    </button>
                    <button className={role === 'doctor' ? 'active' : ''} onClick={() => setRole('doctor')}>
                        Doctor
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-icon-wrap">
                                <User size={16} className="input-icon" />
                                <input type="text" placeholder="John Doe" value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <div className="input-icon-wrap">
                                <Mail size={16} className="input-icon" />
                                <input type="email" placeholder="you@example.com" value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })} required />
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-icon-wrap">
                                <Lock size={16} className="input-icon" />
                                <input type="password" placeholder="••••••••" value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <div className="input-icon-wrap">
                                <Phone size={16} className="input-icon" />
                                <input type="tel" placeholder="+91 9876543210" value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {role === 'patient' && (
                        <div className="form-row">
                            <div className="form-group">
                                <label>Age</label>
                                <input type="number" placeholder="25" value={form.age}
                                    onChange={e => setForm({ ...form, age: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                    <option value="">Select...</option>
                                    <option>Male</option><option>Female</option><option>Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {role === 'doctor' && (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Specialization</label>
                                    <select value={form.specialization}
                                        onChange={e => setForm({ ...form, specialization: e.target.value })} required>
                                        <option value="">Select Specialization</option>
                                        {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Experience (years)</label>
                                    <div className="input-icon-wrap">
                                        <Briefcase size={16} className="input-icon" />
                                        <input type="number" placeholder="5" value={form.experience}
                                            onChange={e => setForm({ ...form, experience: e.target.value })} required />
                                    </div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Consultation Fees (₹)</label>
                                    <div className="input-icon-wrap">
                                        <DollarSign size={16} className="input-icon" />
                                        <input type="number" placeholder="500" value={form.fees}
                                            onChange={e => setForm({ ...form, fees: e.target.value })} required />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>About You</label>
                                <textarea rows={3} placeholder="Brief professional bio..." value={form.about}
                                    onChange={e => setForm({ ...form, about: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label>Availability</label>
                                <div className="availability-grid">
                                    {DAYS.map(day => (
                                        <div key={day} className="avail-day">
                                            <div className="avail-day-name">{day}</div>
                                            <div className="avail-slots">
                                                {TIME_SLOTS.map(slot => (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        className={`slot-btn ${isSlotSelected(day, slot) ? 'selected' : ''}`}
                                                        onClick={() => toggleSlot(day, slot)}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? <span className="btn-spinner"></span> : `Register as ${role === 'doctor' ? 'Doctor' : 'Patient'}`}
                    </button>
                </form>
                <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
            </div>
        </div>
    );
};

export default Register;
