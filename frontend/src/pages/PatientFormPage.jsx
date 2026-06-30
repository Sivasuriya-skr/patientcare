import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, User, MapPin, Mail, Calendar } from 'lucide-react';
import { createPatient, getPatientById, updatePatient } from '../api/patientApi';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import '../styles/pages/PatientFormPage.css';
import '../styles/components/Button.css';
import '../styles/components/FormInput.css';

const EMPTY_FORM = {
  name:           '',
  email:          '',
  address:        '',
  dateOfBirth:    '',
  registeredDate: new Date().toISOString().slice(0, 10),
};

function validate(form) {
  const errors = {};
  if (!form.name.trim())      errors.name           = 'Full name is required.';
  if (!form.email.trim())     errors.email          = 'Email is required.';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email.';
  if (!form.address.trim())   errors.address        = 'Address is required.';
  if (!form.dateOfBirth)      errors.dateOfBirth    = 'Date of birth is required.';
  if (!form.registeredDate)   errors.registeredDate = 'Registration date is required.';
  return errors;
}

export default function PatientFormPage() {
  const navigate = useNavigate();
  const { id }   = useParams();
  const isEdit   = !!id;

  const [form, setForm]         = useState(EMPTY_FORM);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // Load patient data when editing
  useEffect(() => {
    if (!isEdit) return;
    getPatientById(id)
      .then(p => {
        setForm({
          name:           p.name           || '',
          email:          p.email          || '',
          address:        p.address        || '',
          dateOfBirth:    p.dateOfBirth    ? p.dateOfBirth.slice(0, 10) : '',
          registeredDate: p.registeredDate ? p.registeredDate.slice(0, 10) : '',
        });
      })
      .catch(() => { toast.error('Failed to load patient data.'); navigate('/patients'); })
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErr = document.querySelector('.form-error');
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await updatePatient(id, form);
        toast.success('Patient updated successfully!');
        navigate(`/patients/${id}`);
      } else {
        await createPatient(form);
        toast.success('Patient created successfully!');
        navigate('/patients');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save patient. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading patient data..." />;

  return (
    <div className="patient-form-page">
      {/* ── Back Button ── */}
      <div className="form-page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={18} /> Back
        </button>
      </div>

      <div className="form-card">
        {/* ── Card Header ── */}
        <div className="form-card__header">
          <h2 className="form-card__title">
            {isEdit ? '✏️  Edit Patient Record' : '➕  New Patient Registration'}
          </h2>
          <p className="form-card__subtitle">
            {isEdit ? 'Update the patient information below.' : 'Fill in the details to register a new patient.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-card__body">
            {/* ── Personal Information ── */}
            <section className="form-section">
              <h3 className="form-section__title">
                <User size={18} className="form-section__icon" />
                Personal Information
              </h3>
              <div className="form-section__fields">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      id="name" name="name" type="text"
                      className={`form-input${errors.name ? ' form-input--error' : ''}`}
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={handleChange}
                      autoFocus={!isEdit}
                    />
                    {errors.name && <span className="form-error">✗ {errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="dateOfBirth">
                      Date of Birth <span className="required">*</span>
                    </label>
                    <input
                      id="dateOfBirth" name="dateOfBirth" type="date"
                      className={`form-input${errors.dateOfBirth ? ' form-input--error' : ''}`}
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      max={new Date().toISOString().slice(0, 10)}
                    />
                    {errors.dateOfBirth && <span className="form-error">✗ {errors.dateOfBirth}</span>}
                  </div>
                </div>
              </div>
            </section>

            {/* ── Contact Information ── */}
            <section className="form-section">
              <h3 className="form-section__title">
                <Mail size={18} className="form-section__icon" />
                Contact Information
              </h3>
              <div className="form-section__fields">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    id="email" name="email" type="email"
                    className={`form-input${errors.email ? ' form-input--error' : ''}`}
                    placeholder="e.g. john@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="form-error">✗ {errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="address">
                    Address <span className="required">*</span>
                  </label>
                  <input
                    id="address" name="address" type="text"
                    className={`form-input${errors.address ? ' form-input--error' : ''}`}
                    placeholder="e.g. 123 Main Street, Chennai"
                    value={form.address}
                    onChange={handleChange}
                  />
                  {errors.address && <span className="form-error">✗ {errors.address}</span>}
                </div>
              </div>
            </section>

            {/* ── Registration ── */}
            <section className="form-section">
              <h3 className="form-section__title">
                <Calendar size={18} className="form-section__icon" />
                Registration Details
              </h3>
              <div className="form-section__fields">
                <div className="form-group">
                  <label className="form-label" htmlFor="registeredDate">
                    Registration Date <span className="required">*</span>
                  </label>
                  <input
                    id="registeredDate" name="registeredDate" type="date"
                    className={`form-input${errors.registeredDate ? ' form-input--error' : ''}`}
                    value={form.registeredDate}
                    onChange={handleChange}
                  />
                  {errors.registeredDate && <span className="form-error">✗ {errors.registeredDate}</span>}
                  <span className="form-hint">Defaults to today's date.</span>
                </div>
              </div>
            </section>
          </div>

          {/* ── Footer Buttons ── */}
          <div className="form-card__footer">
            <button type="button" className="btn btn--secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn--primary${submitting ? ' btn--loading' : ''}`}
              disabled={submitting}
            >
              {!submitting && (isEdit ? 'Save Changes' : 'Create Patient')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
