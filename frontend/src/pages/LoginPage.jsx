import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, Eye, EyeOff, AlertCircle, Heart, Shield, Users } from 'lucide-react';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/AuthPage.css';
import '../styles/components/Button.css';
import '../styles/components/FormInput.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await login(form.email, form.password);
      console.log("LOGIN RESPONSE:", data);

      loginUser(data.token, form.email);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left Panel ── */}
      <div className="auth-page__left">
        <div className="auth-page__brand">
          <div className="auth-page__brand-icon">
            <Stethoscope size={28} />
          </div>
          <span className="auth-page__brand-name">PatientCare</span>
        </div>

        <h1 className="auth-page__headline">
          Admin Portal for<br />Healthcare Management
        </h1>
        <p className="auth-page__tagline">
          Sign in to manage patient records, billing, and clinic operations.
        </p>

        <div className="auth-page__features">
          <div className="auth-page__feature">
            <div className="auth-page__feature-icon"><Users size={16} /></div>
            Add and manage patients from the dashboard
          </div>
          <div className="auth-page__feature">
            <div className="auth-page__feature-icon"><Heart size={16} /></div>
            Real-time health records & billing
          </div>
          <div className="auth-page__feature">
            <div className="auth-page__feature-icon"><Shield size={16} /></div>
            Secure admin-only access control
          </div>
        </div>

        <div className="auth-page__deco">
          <Stethoscope size={200} />
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-page__right">
        <div className="auth-card">
          <h2 className="auth-card__title">Admin sign in</h2>
          <p className="auth-card__subtitle">Use your admin credentials to continue</p>

          <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="auth-card__alert auth-card__alert--error">
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                {error}
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="Enter your email..."
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <div className="form-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password..."
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="form-input-icon"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: 4 }}>
                <a href="#" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)' }}>
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn--primary btn--full btn--lg${loading ? ' btn--loading' : ''}`}
              disabled={loading}
            >
              {!loading && 'Sign In'}
            </button>
          </form>

          <p className="auth-card__footer">
            Need an admin account?{' '}
            <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
