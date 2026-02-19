import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { toast } from '../../components/Toast';
import { Calendar, User } from 'lucide-react';

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        API.get('/admin/appointments')
            .then(r => setAppointments(r.data))
            .catch(() => toast.error('Failed to load appointments'))
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>All Appointments</h1>
                <p>Overview of every appointment in the system</p>
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
                <div className="empty-state"><Calendar size={48} /><p>No appointments found</p></div>
            ) : (
                <div className="table-card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Specialization</th>
                                <th>Date & Slot</th>
                                <th>Fees</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(a => (
                                <tr key={a._id}>
                                    <td>
                                        <div className="table-user">
                                            <div className="table-avatar">{a.patientName[0]}</div>
                                            <span>{a.patientName}</span>
                                        </div>
                                    </td>
                                    <td>Dr. {a.doctorName}</td>
                                    <td><span className="spec-tag">{a.specialization}</span></td>
                                    <td>
                                        <div>{a.date}</div>
                                        <div className="text-muted">{a.slot}</div>
                                    </td>
                                    <td>₹{a.fees}</td>
                                    <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminAppointments;
