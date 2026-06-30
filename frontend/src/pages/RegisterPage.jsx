import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, Eye, EyeOff, AlertCircle, CheckCircle, Heart, Shield, Users } from 'lucide-react';
import { register } from '../api/authApi';
import '../styles/pages/AuthPage.css';
import '../styles/components/Button.css';
import '../styles/components/FormInput.css';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) return 'All fields are required.';
    if (form.name.trim().length < 2) return 'Please enter your full name.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email address.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');
    try {
      await register(form.name.trim(), form.email, form.password);
      setSuccess('Admin account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        err.message ||
        'Registration failed. Please try again.'
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
          Create Your<br />Admin Account
        </h1>
        <p className="auth-page__tagline">
          Register as a clinic administrator. Patients are added separately through the dashboard — they do not sign up here.
        </p>

        <div className="auth-page__features">
          <div className="auth-page__feature">
            <div className="auth-page__feature-icon"><Users size={16} /></div>
            Admin-only access to patient management
          </div>
          <div className="auth-page__feature">
            <div className="auth-page__feature-icon"><Heart size={16} /></div>
            Integrated billing and analytics
          </div>
          <div className="auth-page__feature">
            <div className="auth-page__feature-icon"><Shield size={16} /></div>
            JWT-secured, HIPAA-compliant design
          </div>
        </div>

        <div className="auth-page__deco">
          <Stethoscope size={200} />
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="auth-page__right">
        <div className="auth-card">
          <h2 className="auth-card__title">Admin registration</h2>
          <p className="auth-card__subtitle">Create an administrator account for the clinic</p>

          <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="auth-card__alert auth-card__alert--error">
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                {error}
              </div>
            )}
            {success && (
              <div className="auth-card__alert auth-card__alert--success">
                <CheckCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                {success}
              </div>
            )}

            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="reg-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="Enter your full name..."
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                autoFocus
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="Enter your email..."
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">
                Password <span className="required">*</span>
              </label>
              <div className="form-input-wrapper">
                <input
                  id="reg-password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min. 8 characters..."
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="form-input-icon"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.password && (
                <span className={form.password.length >= 8 ? 'form-success-text' : 'form-error'}>
                  {form.password.length >= 8
                    ? '✓ Strong password'
                    : `${8 - form.password.length} more characters needed`}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">
                Confirm Password <span className="required">*</span>
              </label>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type="password"
                className={`form-input${form.confirmPassword && form.confirmPassword !== form.password ? ' form-input--error' : ''}`}
                placeholder="Re-enter your password..."
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {form.confirmPassword && form.confirmPassword !== form.password && (
                <span className="form-error">✗ Passwords do not match</span>
              )}
            </div>

            <button
              type="submit"
              className={`btn btn--primary btn--full btn--lg${loading ? ' btn--loading' : ''}`}
              disabled={loading}
            >
              {!loading && 'Create Admin Account'}
            </button>
          </form>

          <p className="auth-card__footer">
            Already have an account?{' '}
            <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
