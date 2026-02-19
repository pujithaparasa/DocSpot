import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, CheckCircle, TrendingUp } from 'lucide-react';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
    const [upcoming, setUpcoming] = useState([]);

    useEffect(() => {
        API.get('/doctor/stats').then(r => setStats(r.data)).catch(() => { });
        API.get('/doctor/appointments').then(r => {
            const sorted = r.data.filter(a => a.status === 'pending').slice(0, 5);
            setUpcoming(sorted);
        }).catch(() => { });
    }, []);

    const cards = [
        { label: 'Total Appointments', value: stats.total, icon: Calendar, color: '#6366f1' },
        { label: 'Pending', value: stats.pending, icon: Clock, color: '#f59e0b' },
        { label: 'Completed', value: stats.completed, icon: CheckCircle, color: '#10b981' },
    ];

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Doctor Dashboard</h1>
                <p>Welcome, <strong>Dr. {user?.name}</strong> | <span className="spec-tag">{user?.specialization}</span></p>
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

            <div className="section-card">
                <h2>Upcoming Appointments</h2>
                {upcoming.length === 0 ? (
                    <div className="empty-state"><Calendar size={40} /><p>No upcoming appointments</p></div>
                ) : (
                    <div className="appt-list">
                        {upcoming.map(a => (
                            <div key={a._id} className="appt-item">
                                <div className="appt-avatar">{a.patientName[0]}</div>
                                <div className="appt-info">
                                    <div className="appt-name">{a.patientName}</div>
                                    <div className="appt-meta">{a.date} · {a.slot}</div>
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

export default DoctorDashboard;
