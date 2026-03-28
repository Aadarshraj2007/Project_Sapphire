import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Phone, Hash, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const Signup = () => {
  const [role, setRole] = useState('CONTRACTOR');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', cppUserId: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = role === 'CONTRACTOR' ? '/auth/contractor/signup' : '/auth/gov/signup';
      const payload = role === 'CONTRACTOR'
        ? { name: form.name, email: form.email, phone: form.phone, cppUserId: form.cppUserId, password: form.password }
        : { name: form.name, email: form.email, phone: form.phone, password: form.password };

      await API.post(endpoint, payload);
      toast.success('Signup successful! Awaiting admin approval.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={24} color="white" />
          </div>
        </div>
        <h1>Create Account</h1>
        <p className="subtitle">Register as a contractor or government official</p>

        <div className="role-switcher">
          <button className={role === 'CONTRACTOR' ? 'active' : ''} onClick={() => setRole('CONTRACTOR')}>
            Contractor
          </button>
          <button className={role === 'GOVERNMENT' ? 'active' : ''} onClick={() => setRole('GOVERNMENT')}>
            Government
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input name="name" type="text" className="form-input" placeholder="Enter full name" value={form.name} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input name="email" type="email" className="form-input" placeholder="Enter email" value={form.email} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input name="phone" type="text" className="form-input" placeholder="Enter phone number" value={form.phone} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>

          {role === 'CONTRACTOR' && (
            <div className="form-group">
              <label className="form-label">CPP User ID</label>
              <div style={{ position: 'relative' }}>
                <Hash size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input name="cppUserId" type="text" className="form-input" placeholder="Enter CPP User ID" value={form.cppUserId} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                name="password"
                type="password"
                className="form-input"
                placeholder="Min 8 chars, A-z, 1@#"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Requires at least 8 characters, one uppercase, one lowercase and one special symbol.
            </p>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> : <><UserPlus size={18} /> Create Account</>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
