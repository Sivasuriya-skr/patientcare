import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Users, CheckCircle, Clock, Download, Filter, Trash2 } from 'lucide-react';
import { getBillingAccounts } from '../api/billingApi';
import { deletePatient } from '../api/patientApi';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import '../styles/pages/BillingPage.css';
import '../styles/components/Button.css';

const STATUS_BADGE = {
  ACTIVE:   'badge-success',
  INACTIVE: 'badge-warning',
  CLOSED:   'badge-danger',
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function shortId(id) {
  if (!id) return '—';
  return `#${String(id).slice(0, 8).toUpperCase()}`;
}

export default function BillingPage() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null); // { patientId, patientName }
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getBillingAccounts()
      .then(setAccounts)
      .catch(() => toast.error('Failed to load billing accounts.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteClick = (account) => {
    setConfirmDelete({ patientId: account.patientId, patientName: account.patientName });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deletePatient(confirmDelete.patientId);
      setAccounts(prev => prev.filter(a => a.patientId !== confirmDelete.patientId));
      toast.success(`Patient "${confirmDelete.patientName}" deleted successfully.`);
      setConfirmDelete(null);
    } catch {
      toast.error('Failed to delete patient. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const stats = useMemo(() => {
    const total = accounts.length;
    const active = accounts.filter(a => a.status === 'ACTIVE').length;
    const inactive = accounts.filter(a => a.status === 'INACTIVE').length;
    const closed = accounts.filter(a => a.status === 'CLOSED').length;
    return { total, active, inactive, closed };
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    if (!statusFilter) return accounts;
    return accounts.filter(a => a.status === statusFilter);
  }, [accounts, statusFilter]);

  if (loading) return <LoadingSpinner text="Loading billing accounts..." />;

  return (
    <>
    <div className="billing-page">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Billing</h1>
          <p className="page-header__subtitle">Billing accounts created when patients are registered</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn--secondary btn--sm" disabled={accounts.length === 0}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      <div className="billing__stats">
        <StatCard
          title="Total Accounts"
          value={String(stats.total)}
          icon={CreditCard}
          variant="blue"
        />
        <StatCard
          title="Active"
          value={String(stats.active)}
          icon={CheckCircle}
          variant="green"
        />
        <StatCard
          title="Inactive"
          value={String(stats.inactive)}
          icon={Clock}
          variant="orange"
        />
        <StatCard
          title="Closed"
          value={String(stats.closed)}
          icon={Users}
          variant="purple"
        />
      </div>

      <div className="filter-bar" style={{ marginBottom: 'var(--space-5)' }}>
        <select
          className="form-select filter-bar__select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="CLOSED">Closed</option>
        </select>
        <button className="btn btn--ghost btn--sm" style={{ marginLeft: 'auto' }}>
          <Filter size={14} /> Filters
        </button>
      </div>

      <div className="invoice-table-wrapper">
        {filteredAccounts.length === 0 ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <p>No billing accounts yet. Accounts are created automatically when you add a patient.</p>
          </div>
        ) : (
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Account ID</th>
                <th>Patient</th>
                <th>Email</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map(account => (
                <tr key={account.id}>
                  <td><span className="invoice-id">{shortId(account.id)}</span></td>
                  <td style={{ fontWeight: 500 }}>{account.patientName}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{account.patientEmail}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{formatDate(account.createdAt)}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[account.status] || 'badge-primary'}`}>
                      {account.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button
                        className="btn btn--secondary btn--sm"
                        onClick={() => navigate(`/patients/${account.patientId}`)}
                      >
                        View Patient
                      </button>
                      <button
                        className="btn btn--danger btn--sm"
                        onClick={() => handleDeleteClick(account)}
                        title="Delete patient"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>

    {/* ── Delete Confirmation Modal ── */}
    {confirmDelete && (
      <div className="modal-overlay" onClick={() => !deleting && setConfirmDelete(null)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal__icon modal__icon--danger">
            <Trash2 size={24} />
          </div>
          <h3 className="modal__title">Delete Patient</h3>
          <p className="modal__body">
            Are you sure you want to delete <strong>{confirmDelete.patientName}</strong>?
            This will permanently remove the patient and their billing account.
            This action cannot be undone.
          </p>
          <div className="modal__actions">
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => setConfirmDelete(null)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              className="btn btn--danger btn--sm"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
