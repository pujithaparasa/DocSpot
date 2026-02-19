import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { toast } from '../../components/Toast';
import { Award, DollarSign, Calendar, ArrowLeft } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DoctorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        API.get(`/appointments/doctors/${id}`)
            .then(r => {
                setDoctor(r.data.doctor);
                setBookedSlots(r.data.bookedSlots);
            })
            .catch(() => toast.error('Doctor not found'))
            .finally(() => setLoading(false));
    }, [id]);

    const getAvailableSlotsForDay = (day) => {
        const dayAvail = doctor?.availability?.find(a => a.day === day);
        if (!dayAvail) return [];
        return dayAvail.slots.filter(slot => {
            const isBooked = bookedSlots.some(b => b.date === selectedDate && b.slot === slot);
            return !isBooked;
        });
    };

    const handleBook = async () => {
        if (!selectedDate || !selectedSlot) {
            toast.error('Please select a date and time slot');
            return;
        }
        setBooking(true);
        try {
            await API.post('/appointments/book', { doctorId: id, date: selectedDate, slot: selectedSlot });
            toast.success('Appointment booked successfully!');
            navigate('/patient/appointments');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        } finally {
            setBooking(false);
        }
    };

    // Get next 14 days mapped to day names
    const getUpcomingDates = () => {
        const result = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
            const dateStr = d.toISOString().split('T')[0];
            result.push({ dayName, dateStr, display: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) });
        }
        return result;
    };

    const availableDates = getUpcomingDates().filter(d =>
        doctor?.availability?.some(a => a.day === d.dayName)
    );

    if (loading) return <div className="loading-center"><div className="spinner"></div></div>;
    if (!doctor) return <div className="empty-state">Doctor not found</div>;

    const availableSlots = selectedDate
        ? getAvailableSlotsForDay(availableDates.find(d => d.dateStr === selectedDate)?.dayName || '')
        : [];

    return (
        <div className="dashboard-page">
            <button className="btn btn-ghost mb-4" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="doctor-detail-card">
                <div className="doctor-detail-hero">
                    <div className="doctor-detail-avatar">{doctor.name.charAt(0)}</div>
                    <div className="doctor-detail-info">
                        <h1>Dr. {doctor.name}</h1>
                        <span className="spec-tag">{doctor.specialization}</span>
                        <div className="doctor-meta-row">
                            <div className="doctor-meta-item"><Award size={16} /><span>{doctor.experience} years experience</span></div>
                            <div className="doctor-meta-item"><DollarSign size={16} /><span>₹{doctor.fees} per visit</span></div>
                        </div>
                        {doctor.about && <p className="doctor-about-full">{doctor.about}</p>}
                    </div>
                </div>
            </div>

            <div className="booking-section">
                <h2><Calendar size={20} /> Book an Appointment</h2>

                <div className="form-group">
                    <label>Select Date</label>
                    <div className="date-grid">
                        {availableDates.map(d => (
                            <button
                                key={d.dateStr}
                                className={`date-btn ${selectedDate === d.dateStr ? 'selected' : ''}`}
                                onClick={() => { setSelectedDate(d.dateStr); setSelectedSlot(''); }}
                            >
                                <div className="date-day">{d.dayName.slice(0, 3)}</div>
                                <div className="date-num">{d.display}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {selectedDate && (
                    <div className="form-group">
                        <label>Available Time Slots</label>
                        {availableSlots.length === 0 ? (
                            <p className="text-muted">No slots available for this date</p>
                        ) : (
                            <div className="slot-grid">
                                {availableSlots.map(slot => (
                                    <button
                                        key={slot}
                                        className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                                        onClick={() => setSelectedSlot(slot)}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleBook}
                    disabled={booking || !selectedDate || !selectedSlot}
                >
                    {booking ? <span className="btn-spinner"></span> : `Confirm Booking — ₹${doctor.fees}`}
                </button>
            </div>
        </div>
    );
};

export default DoctorDetail;
