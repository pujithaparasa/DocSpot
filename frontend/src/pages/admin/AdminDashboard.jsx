import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Users, UserCheck, Calendar, Clock, TrendingUp, Stethoscope } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ totalDoctors: 0, pendingDoctors: 0, totalPatients: 0, totalAppointments: 0 });

    useEffect(() => {
        API.get('/admin/stats').then(r => setStats(r.data)).catch(() => { });
    }, []);

    const cards = [
        { label: 'Approved Doctors', value: stats.totalDoctors, icon: Stethoscope, color: '#6366f1', to: '/admin/doctors' },
        { label: 'Pending Approvals', value: stats.pendingDoctors, icon: Clock, color: '#f59e0b', to: '/admin/doctors' },
        { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: '#10b981', to: null },
        { label: 'Total Appointments', value: stats.totalAppointments, icon: Calendar, color: '#06b6d4', to: '/admin/appointments' },
    ];

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome back, <strong>{user?.name}</strong> — here's your overview</p>
            </div>

            <div className="stats-grid">
                {cards.map(c => (
                    <div key={c.label} className="stat-card" style={{ borderTop: `3px solid ${c.color}` }}>
                        <div className="stat-card-icon" style={{ background: `${c.color}20`, color: c.color }}>
                            <c.icon size={24} />
                        </div>
                        <div className="stat-card-content">
                            <div className="stat-card-value">{c.value}</div>
                            <div className="stat-card-label">{c.label}</div>
                        </div>
                        {c.to && <Link to={c.to} className="stat-card-link">View →</Link>}
                    </div>
                ))}
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-grid">
                    <Link to="/admin/doctors" className="action-card">
                        <UserCheck size={28} />
                        <span>Manage Doctors</span>
                    </Link>
                    <Link to="/admin/appointments" className="action-card">
                        <Calendar size={28} />
                        <span>All Appointments</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
