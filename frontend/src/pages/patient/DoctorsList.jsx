import { useEffect, useState } from 'react';
import API from '../../utils/api';
import DoctorCard from '../../components/DoctorCard';
import { Search, Filter } from 'lucide-react';

const SPECIALIZATIONS = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'Gynecology', 'Pediatrics', 'General Physician', 'Psychiatry', 'ENT', 'Ophthalmology'];

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [specialization, setSpecialization] = useState('All');

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (specialization !== 'All') params.specialization = specialization;
            const { data } = await API.get('/appointments/doctors', { params });
            setDoctors(data);
        } catch { }
        finally { setLoading(false); }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchDoctors(), 300);
        return () => clearTimeout(timer);
    }, [search, specialization]);

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Find a Doctor</h1>
                <p>Browse our verified specialists and book an appointment</p>
            </div>

            <div className="search-bar">
                <div className="search-input-wrap">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search doctors by name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="spec-filter">
                {SPECIALIZATIONS.map(s => (
                    <button
                        key={s}
                        className={`filter-btn ${specialization === s ? 'active' : ''}`}
                        onClick={() => setSpecialization(s)}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-center"><div className="spinner"></div></div>
            ) : doctors.length === 0 ? (
                <div className="empty-state">
                    <Search size={48} />
                    <p>No doctors found for the selected filter</p>
                </div>
            ) : (
                <div className="doctors-grid">
                    {doctors.map(doctor => (
                        <DoctorCard key={doctor._id} doctor={doctor} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorsList;
