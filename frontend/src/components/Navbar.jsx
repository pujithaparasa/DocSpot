import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = () => {
        if (!user) return [
            { to: '/', label: 'Home' },
            { to: '/login', label: 'Login' },
            { to: '/register', label: 'Register' },
        ];
        if (user.role === 'admin') return [
            { to: '/admin/dashboard', label: 'Dashboard' },
            { to: '/admin/doctors', label: 'Doctors' },
            { to: '/admin/appointments', label: 'Appointments' },
        ];
        if (user.role === 'doctor') return [
            { to: '/doctor/dashboard', label: 'Dashboard' },
            { to: '/doctor/appointments', label: 'Appointments' },
            { to: '/doctor/profile', label: 'Profile' },
        ];
        return [
            { to: '/patient/dashboard', label: 'Dashboard' },
            { to: '/patient/doctors', label: 'Find Doctors' },
            { to: '/patient/appointments', label: 'My Appointments' },
        ];
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <Stethoscope size={28} />
                <span>MediBook</span>
            </Link>

            <button className="nav-hamburger" onClick={() => setOpen(!open)}>
                {open ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`nav-links ${open ? 'open' : ''}`}>
                {navLinks().map(link => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                        onClick={() => setOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}
                {user && (
                    <div className="nav-user">
                        <span className={`nav-badge badge-${user.role}`}>{user.role}</span>
                        <span className="nav-username">{user.name}</span>
                        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                            <LogOut size={15} /> Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
