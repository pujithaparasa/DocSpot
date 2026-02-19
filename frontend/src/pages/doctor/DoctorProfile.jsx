import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { toast } from '../../components/Toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const DoctorProfile = () => {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: '', phone: '', fees: '', experience: '', about: '' });
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        API.get('/doctor/profile').then(r => {
            setProfile(r.data);
            setForm({ name: r.data.name, phone: r.data.phone || '', fees: r.data.fees, experience: r.data.experience, about: r.data.about || '' });
            setAvailability(r.data.availability || []);
        }).finally(() => setLoading(false));
    }, []);

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

    const isSlotSelected = (day, slot) => availability.find(d => d.day === day)?.slots.includes(slot) || false;

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await API.put('/doctor/profile', { ...form, availability });
            toast.success('Profile updated!');
        } catch (err) { toast.error(err.response?.data?.message || 'Error saving'); }
        finally { setSaving(false); }
    };

    if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>My Profile</h1>
                <p>Manage your professional information and availability</p>
            </div>

            <div className="profile-card">
                <div className="profile-badge">
                    <span className={`badge badge-${profile?.status}`}>{profile?.status}</span>
                    <span className="spec-tag">{profile?.specialization}</span>
                </div>

                <form onSubmit={handleSave} className="auth-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Consultation Fees (₹)</label>
                            <input type="number" value={form.fees} onChange={e => setForm({ ...form, fees: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Experience (years)</label>
                            <input type="number" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>About</label>
                        <textarea rows={3} value={form.about} onChange={e => setForm({ ...form, about: e.target.value })} />
                    </div>

                    <div className="form-group">
                        <label>Availability</label>
                        <div className="availability-grid">
                            {DAYS.map(day => (
                                <div key={day} className="avail-day">
                                    <div className="avail-day-name">{day}</div>
                                    <div className="avail-slots">
                                        {TIME_SLOTS.map(slot => (
                                            <button key={slot} type="button"
                                                className={`slot-btn ${isSlotSelected(day, slot) ? 'selected' : ''}`}
                                                onClick={() => toggleSlot(day, slot)}>
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? <span className="btn-spinner"></span> : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfile;
