import { Star, Clock, DollarSign, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const SPECIALIZATION_COLORS = {
    'Cardiology': '#ef4444',
    'Neurology': '#8b5cf6',
    'Orthopedics': '#3b82f6',
    'Dermatology': '#f59e0b',
    'Gynecology': '#ec4899',
    'Pediatrics': '#10b981',
    'General Physician': '#06b6d4',
    'Psychiatry': '#6366f1',
    'ENT': '#14b8a6',
    'Ophthalmology': '#f97316',
};

const DoctorCard = ({ doctor }) => {
    const color = SPECIALIZATION_COLORS[doctor.specialization] || '#6366f1';
    return (
        <div className="doctor-card">
            <div className="doctor-card-header" style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)` }}>
                <div className="doctor-avatar" style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                    {doctor.image
                        ? <img src={doctor.image} alt={doctor.name} />
                        : <span>{doctor.name.charAt(0).toUpperCase()}</span>
                    }
                </div>
                <div className="doctor-specialty-pill" style={{ background: `${color}22`, color }}>
                    {doctor.specialization}
                </div>
            </div>
            <div className="doctor-card-body">
                <h3 className="doctor-name">Dr. {doctor.name}</h3>
                <div className="doctor-meta">
                    <div className="doctor-meta-item">
                        <Award size={14} />
                        <span>{doctor.experience} yrs exp.</span>
                    </div>
                    <div className="doctor-meta-item">
                        <DollarSign size={14} />
                        <span>₹{doctor.fees}</span>
                    </div>
                </div>
                {doctor.about && <p className="doctor-about">{doctor.about.substring(0, 80)}...</p>}
                <Link to={`/patient/doctors/${doctor._id}`} className="btn btn-primary btn-full">
                    Book Appointment
                </Link>
            </div>
        </div>
    );
};

export default DoctorCard;
