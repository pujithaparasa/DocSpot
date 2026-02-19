import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { toast } from '../../components/Toast';
import { CheckCircle, XCircle, Clock, Award, Phone, Mail, Filter } from 'lucide-react';

const StatusBadge = ({ status }) => (
    <span className={`badge badge-${status}`}>{status}</span>
);

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    const fetchDoctors = async () => {
        try {
            const { data } = await API.get('/admin/doctors');
            setDoctors(data);
        } catch { toast.error('Failed to load doctors'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchDoctors(); }, []);

    const handleApprove = async (id) => {
        try {
            await API.put(`/admin/doctors/${id}/approve`);
            toast.success('Doctor approved!');
            fetchDoctors();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const handleReject = async (id) => {
        try {
            await API.put(`/admin/doctors/${id}/reject`);
            toast.warning('Doctor rejected');
            fetchDoctors();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const filtered = filter === 'all' ? doctors : doctors.filter(d => d.status === filter);

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Manage Doctors</h1>
                <p>Review and approve doctor applications</p>
            </div>

            <div className="filter-bar">
                {['all', 'pending', 'approved', 'rejected'].map(f => (
                    <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? doctors.length : doctors.filter(d => d.status === f).length})
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-center"><div className="spinner"></div></div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <Clock size={48} />
                    <p>No doctors in this category</p>
                </div>
            ) : (
                <div className="table-card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Doctor</th>
                                <th>Specialization</th>
                                <th>Experience</th>
                                <th>Fees</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(doc => (
                                <tr key={doc._id}>
                                    <td>
                                        <div className="table-user">
                                            <div className="table-avatar">{doc.name[0]}</div>
                                            <div>
                                                <div className="table-name">Dr. {doc.name}</div>
                                                <div className="table-email">{doc.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="spec-tag">{doc.specialization}</span></td>
                                    <td>{doc.experience} yrs</td>
                                    <td>₹{doc.fees}</td>
                                    <td><StatusBadge status={doc.status} /></td>
                                    <td>
                                        <div className="action-btns">
                                            {doc.status !== 'approved' && (
                                                <button className="btn btn-success btn-sm" onClick={() => handleApprove(doc._id)}>
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                            )}
                                            {doc.status !== 'rejected' && (
                                                <button className="btn btn-danger btn-sm" onClick={() => handleReject(doc._id)}>
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDoctors;
