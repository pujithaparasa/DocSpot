import { Link } from 'react-router-dom';
import { Stethoscope, Shield, Clock, Star, Users, Award } from 'lucide-react';

const Home = () => {
    const specializations = [
        'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology',
        'Gynecology', 'Pediatrics', 'General Physician', 'Psychiatry'
    ];

    return (
        <div className="home">
            {/* Hero */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">🏥 Trusted Healthcare Platform</div>
                    <h1 className="hero-title">
                        Book Appointments <br />
                        <span className="gradient-text">with Top Doctors</span>
                    </h1>
                    <p className="hero-subtitle">
                        Connect with verified, specialist doctors in your area. Book appointments instantly, manage your health effortlessly.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
                        <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat"><strong>500+</strong><span>Doctors</span></div>
                        <div className="stat"><strong>10k+</strong><span>Patients</span></div>
                        <div className="stat"><strong>50k+</strong><span>Appointments</span></div>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="hero-blob">
                        <Stethoscope size={180} className="hero-icon" />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section">
                <div className="section-header">
                    <h2>Why Choose <span className="gradient-text">MediBook?</span></h2>
                    <p>Everything you need to manage your healthcare journey</p>
                </div>
                <div className="features-grid">
                    {[
                        { icon: Shield, title: 'Verified Doctors', desc: 'All doctors are reviewed and approved by our admin team before listing.' },
                        { icon: Clock, title: 'Easy Scheduling', desc: 'Book appointments in minutes with real-time slot availability.' },
                        { icon: Star, title: 'Specialist Care', desc: 'Find experts across 20+ medical specializations.' },
                        { icon: Users, title: 'Patient First', desc: 'Manage all your appointments and medical history in one place.' },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div className="feature-card" key={title}>
                            <div className="feature-icon"><Icon size={28} /></div>
                            <h3>{title}</h3>
                            <p>{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Specializations */}
            <section className="section section-alt">
                <div className="section-header">
                    <h2>Browse by <span className="gradient-text">Specialization</span></h2>
                </div>
                <div className="spec-grid">
                    {specializations.map(spec => (
                        <Link key={spec} to={`/patient/doctors?specialization=${spec}`} className="spec-chip">
                            {spec}
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <h2>Ready to Get Started?</h2>
                <p>Join thousands of patients who trust MediBook for their healthcare needs.</p>
                <div className="cta-actions">
                    <Link to="/register" className="btn btn-primary btn-lg">Register as Patient</Link>
                    <Link to="/register?role=doctor" className="btn btn-ghost btn-lg">Join as Doctor</Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
