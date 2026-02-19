import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { Stethoscope, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            toast.success(`Welcome back, ${user.name}!`);
            if (user.role === 'admin') navigate('/admin/dashboard');
            else if (user.role === 'doctor') navigate('/doctor/dashboard');
            else navigate('/patient/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <Stethoscope size={40} className="auth-logo" />
                    <h2>Welcome Back</h2>
                    <p>Sign in to your MediBook account</p>
                </div>

                <div className="demo-creds">
                    <div className="demo-item"><strong>Admin:</strong> admin@doc.com / admin123</div>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-icon-wrap">
                            <Mail size={16} className="input-icon" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-icon-wrap">
                            <Lock size={16} className="input-icon" />
                            <input
                                type={showPw ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                            />
                            <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? <span className="btn-spinner"></span> : 'Sign In'}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
