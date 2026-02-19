import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { toast } from '../../components/Toast';
import { Calendar, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchAppointments = () => {
        API.get('/appointments/mine')
            .then(r => setAppointments(r.data))
            .catch(() => toast.error('Failed to load appointments'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchAppointments(); }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this appointment?')) return;
        try {
            await API.delete(`/appointments/${id}`);
            toast.success('Appointment cancelled');
            fetchAppointments();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>My Appointments</h1>
                <p>Track all your bookings</p>
            </div>

            <div className="filter-bar">
                {['all', 'pending', 'completed', 'cancelled'].map(f => (
                    <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? appointments.length : appointments.filter(a => a.status === f).length})
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-center"><div className="spinner"></div></div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <Calendar size={48} />
                    <p>No appointments found. <Link to="/patient/doctors">Book one now!</Link></p>
                </div>
            ) : (
                <div className="appt-grid">
                    {filtered.map(a => (
                        <div key={a._id} className="appt-card">
                            <div className="appt-card-header">
                                <div className="appt-avatar appt-avatar-lg">{a.doctorName[0]}</div>
                                <div>
                                    <div className="appt-name">Dr. {a.doctorName}</div>
                                    <span className="spec-tag text-xs">{a.specialization}</span>
                                </div>
                                <span className={`badge badge-${a.status}`}>{a.status}</span>
                            </div>
                            <div className="appt-card-body">
                                <div className="appt-detail"><Calendar size={14} /><span>{a.date}</span></div>
                                <div className="appt-detail"><span>⏰</span><span>{a.slot}</span></div>
                                <div className="appt-detail"><span>💰</span><span>₹{a.fees}</span></div>
                            </div>
                            {a.status === 'pending' && (
                                <button className="btn btn-danger btn-full" onClick={() => handleCancel(a._id)}>
                                    <XCircle size={14} /> Cancel Appointment
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientAppointments;
