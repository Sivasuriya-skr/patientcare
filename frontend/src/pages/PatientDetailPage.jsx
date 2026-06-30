import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Mail, MapPin, Calendar, Pencil, Trash2, Phone, Activity } from 'lucide-react';
import { getPatientById, deletePatient } from '../api/patientApi';
import { getBillingAccountByPatientId } from '../api/billingApi';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import '../styles/pages/PatientDetailPage.css';
import '../styles/components/Button.css';

// ── Mock history timeline
const MOCK_HISTORY = [
  { time: 'Dec 18, 2024 — 2:00 PM', title: 'General Checkup', desc: 'Dr. Sarah Smith — Patient stable, continue current meds.', status: 'Completed' },
  { time: 'Dec 10, 2024 — 10:30 AM', title: 'Lab Work — Blood Test', desc: 'Results available. All values within normal range.', status: 'Results Ready' },
  { time: 'Dec 01, 2024 — 3:45 PM', title: 'Prescription Issued', desc: 'Metformin 500mg renewed for 3 months.', status: 'Filled' },
  { time: 'Nov 15, 2024 — 9:00 AM', title: 'Dental Checkup', desc: 'Routine cleaning completed. No cavities found.', status: 'Completed' },
];

const TABS = ['Medical', 'Billing', 'History'];

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function PatientDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [patient, setPatient]         = useState(null);
  const [billingAccount, setBillingAccount] = useState(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('Medical');
  const [showDelete, setShowDelete]   = useState(false);
  const [deleting, setDeleting]       = useState(false);

  useEffect(() => {
    getPatientById(id)
      .then(setPatient)
      .catch(() => { toast.error('Patient not found.'); navigate('/patients'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (activeTab !== 'Billing') return;

    setBillingLoading(true);
    getBillingAccountByPatientId(id)
      .then(setBillingAccount)
      .catch(() => setBillingAccount(null))
      .finally(() => setBillingLoading(false));
  }, [activeTab, id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePatient(id);
      toast.success('Patient deleted.');
      navigate('/patients');
    } catch {
      toast.error('Failed to delete patient.');
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading patient..." />;
  if (!patient) return null;

  return (
    <div className="patient-detail">
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <button className="back-btn" onClick={() => navigate('/patients')}>
          <ChevronLeft size={18} /> Back to Patients
        </button>
        <h1 style={{ flex: 1, fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-text-dark)' }}>
          {patient.name}
        </h1>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn btn--primary btn--sm" onClick={() => navigate(`/patients/${id}/edit`)}>
            <Pencil size={14} /> Edit
          </button>
          <button className="btn btn--danger btn--sm" onClick={() => setShowDelete(true)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* ── Summary Card ── */}
      <div className="patient-summary">
        <div className="patient-summary__top">
          <div className="patient-summary__avatar">{getInitials(patient.name)}</div>
          <div className="patient-summary__info">
            <h2 className="patient-summary__name">{patient.name}</h2>
            <div className="patient-summary__meta">
              {patient.email && (
                <span className="patient-summary__meta-item">
                  <Mail size={14} className="patient-summary__meta-icon" />
                  {patient.email}
                </span>
              )}
              {patient.address && (
                <span className="patient-summary__meta-item">
                  <MapPin size={14} className="patient-summary__meta-icon" />
                  {patient.address}
                </span>
              )}
              {patient.dateOfBirth && (
                <span className="patient-summary__meta-item">
                  <Calendar size={14} className="patient-summary__meta-icon" />
                  DOB: {formatDate(patient.dateOfBirth)}
                </span>
              )}
            </div>
            <span className="badge badge-success">
              <Activity size={10} /> Active
            </span>
          </div>
        </div>

        <div className="patient-summary__footer">
          <button className="btn btn--secondary btn--sm">
            <Phone size={14} /> Call
          </button>
          <button className="btn btn--secondary btn--sm">
            <Mail size={14} /> Email
          </button>
          <button className="btn btn--outline btn--sm">
            Print Record
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="tabs" role="tablist">
        {TABS.map(t => (
          <button
            key={t}
            className={`tab-btn${activeTab === t ? ' tab-btn--active' : ''}`}
            onClick={() => setActiveTab(t)}
            role="tab"
            aria-selected={activeTab === t}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Medical Tab ── */}
      {activeTab === 'Medical' && (
        <>
          <div className="detail-card">
            <h3 className="detail-card__title">Patient Information</h3>
            <table className="info-table">
              <tbody>
                <tr><td>Full Name</td>      <td>{patient.name}</td></tr>
                <tr><td>Email</td>          <td>{patient.email || '—'}</td></tr>
                <tr><td>Address</td>        <td>{patient.address || '—'}</td></tr>
                <tr><td>Date of Birth</td>  <td>{formatDate(patient.dateOfBirth)}</td></tr>
                <tr><td>Registered</td>     <td>{formatDate(patient.registeredDate)}</td></tr>
                <tr><td>Patient ID</td>     <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>{patient.id}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="detail-card">
            <h3 className="detail-card__title">Medical Details</h3>
            <table className="info-table">
              <tbody>
                <tr><td>Blood Type</td>          <td>O+</td></tr>
                <tr><td>Condition</td>            <td>General Patient</td></tr>
                <tr><td>Allergies</td>            <td>None recorded</td></tr>
                <tr><td>Current Medications</td> <td>None recorded</td></tr>
                <tr><td>Emergency Contact</td>    <td>Not provided</td></tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Billing Tab ── */}
      {activeTab === 'Billing' && (
        <>
          <div className="detail-card">
            <h3 className="detail-card__title">Billing Account</h3>
            {billingLoading ? (
              <LoadingSpinner text="Loading billing account..." />
            ) : !billingAccount ? (
              <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                No billing account found for this patient yet.
              </p>
            ) : (
              <table className="info-table">
                <tbody>
                  <tr><td>Account ID</td><td style={{ fontFamily: 'monospace' }}>{billingAccount.id}</td></tr>
                  <tr><td>Patient Name</td><td>{billingAccount.patientName}</td></tr>
                  <tr><td>Email</td><td>{billingAccount.patientEmail}</td></tr>
                  <tr><td>Status</td>
                    <td>
                      <span className={`badge ${billingAccount.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                        {billingAccount.status}
                      </span>
                    </td>
                  </tr>
                  <tr><td>Created</td><td>{formatDate(billingAccount.createdAt)}</td></tr>
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* ── History Tab ── */}
      {activeTab === 'History' && (
        <div className="detail-card">
          <h3 className="detail-card__title">Patient History</h3>
          <div className="timeline">
            {MOCK_HISTORY.map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-item__time">{item.time}</div>
                <div className="timeline-item__title">{item.title}</div>
                <div className="timeline-item__desc">{item.desc}</div>
                <span className="badge badge-primary" style={{ marginTop: 6, display: 'inline-flex' }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {showDelete && (
        <Modal
          title="Delete Patient"
          message={`Permanently delete "${patient.name}"? All records will be lost. This cannot be undone.`}
          confirmLabel="Delete"
          isLoading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
