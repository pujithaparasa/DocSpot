import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, CheckCircle, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        API.get('/appointments/patient/stats').then(r => setStats(r.data)).catch(() => { });
        API.get('/appointments/mine').then(r => setRecent(r.data.slice(0, 5))).catch(() => { });
    }, []);

    const cards = [
        { label: 'Total Bookings', value: stats.total, icon: Calendar, color: '#6366f1' },
        { label: 'Upcoming', value: stats.pending, icon: Clock, color: '#f59e0b' },
        { label: 'Completed', value: stats.completed, icon: CheckCircle, color: '#10b981' },
    ];

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Patient Dashboard</h1>
                <p>Hello, <strong>{user?.name}</strong> 👋 — manage your health appointments</p>
            </div>

            <div className="stats-grid stats-grid-3">
                {cards.map(c => (
                    <div key={c.label} className="stat-card" style={{ borderTop: `3px solid ${c.color}` }}>
                        <div className="stat-card-icon" style={{ background: `${c.color}20`, color: c.color }}>
                            <c.icon size={24} />
                        </div>
                        <div className="stat-card-content">
                            <div className="stat-card-value">{c.value}</div>
                            <div className="stat-card-label">{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-grid">
                    <Link to="/patient/doctors" className="action-card">
                        <Stethoscope size={28} />
                        <span>Find a Doctor</span>
                    </Link>
                    <Link to="/patient/appointments" className="action-card">
                        <Calendar size={28} />
                        <span>My Appointments</span>
                    </Link>
                </div>
            </div>

            <div className="section-card">
                <h2>Recent Appointments</h2>
                {recent.length === 0 ? (
                    <div className="empty-state"><Calendar size={40} /><p>No appointments yet. <Link to="/patient/doctors">Book one now!</Link></p></div>
                ) : (
                    <div className="appt-list">
                        {recent.map(a => (
                            <div key={a._id} className="appt-item">
                                <div className="appt-avatar">{a.doctorName[0]}</div>
                                <div className="appt-info">
                                    <div className="appt-name">Dr. {a.doctorName}</div>
                                    <div className="appt-meta">{a.specialization} · {a.date} · {a.slot}</div>
                                </div>
                                <span className={`badge badge-${a.status}`}>{a.status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
