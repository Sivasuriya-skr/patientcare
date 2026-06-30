import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, Users } from 'lucide-react';
import { getPatients, deletePatient } from '../api/patientApi';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import '../styles/pages/PatientListPage.css';
import '../styles/components/Button.css';
import '../styles/components/FormInput.css';

const PAGE_SIZE = 10;

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function PatientListPage() {
  const navigate = useNavigate();

  const [patients, setPatients]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [page, setPage]               = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]       = useState(false);

  const fetchPatients = () => {
    setLoading(true);
    getPatients()
      .then(data => {
        if (Array.isArray(data)) {
          setPatients(data);
        } else if (data && Array.isArray(data.content)) {
          setPatients(data.content);
        } else {
          setPatients([]);
        }
      })
      .catch(() => { setPatients([]); toast.error('Failed to load patients.'); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPatients(); }, []);

  // Client-side search filter
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return patients;
    return patients.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.address?.toLowerCase().includes(q)
    );
  }, [patients, search]);

  // Reset to page 1 on search
  useEffect(() => { setPage(1); }, [search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePatient(deleteTarget.id);
      toast.success(`${deleteTarget.name} deleted successfully.`);
      setDeleteTarget(null);
      fetchPatients();
    } catch {
      toast.error('Failed to delete patient.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="patient-list">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Patients</h1>
          <p className="page-header__subtitle">
            {loading ? 'Loading...' : `${filtered.length} patient${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <button className="btn btn--primary" onClick={() => navigate('/patients/new')}>
          <Plus size={18} /> New Patient
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div className="filter-bar">
        <div className="filter-bar__search">
          <Search className="filter-bar__search-icon" size={16} />
          <input
            className="form-input"
            placeholder="Search by name, email, or address..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search patients"
          />
        </div>
        {search && (
          <button className="btn btn--ghost btn--sm" onClick={() => setSearch('')}>
            Clear
          </button>
        )}
      </div>

      {/* ── Loading ── */}
      {loading && <LoadingSpinner text="Loading patients..." />}

      {/* ── Empty state ── */}
      {!loading && filtered.length === 0 && (
        <div className="patient-table-wrapper">
          <div className="table-empty">
            <Users size={56} className="table-empty__icon" />
            <h3 className="table-empty__title">
              {search ? 'No results found' : 'No patients yet'}
            </h3>
            <p className="table-empty__text">
              {search
                ? `No patients match "${search}". Try a different search term.`
                : 'Get started by adding your first patient record.'}
            </p>
            {!search && (
              <button className="btn btn--primary" onClick={() => navigate('/patients/new')}>
                <Plus size={16} /> Add First Patient
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Desktop Table ── */}
      {!loading && paginated.length > 0 && (
        <div className="patient-table-wrapper">
          <table className="patient-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Email</th>
                <th>Address</th>
                <th>Date of Birth</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p, idx) => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </td>
                  <td>
                    <div className="patient-table__name-cell">
                      <div className="patient-table__avatar">{getInitials(p.name)}</div>
                      <div>
                        <div className="patient-table__name">{p.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{p.email || '—'}</td>
                  <td>{p.address || '—'}</td>
                  <td>{formatDate(p.dateOfBirth)}</td>
                  <td>{formatDate(p.registeredDate)}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn--icon btn--icon--primary"
                        title="View patient"
                        onClick={() => navigate(`/patients/${p.id}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn--icon btn--icon--success"
                        title="Edit patient"
                        onClick={() => navigate(`/patients/${p.id}/edit`)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn--icon btn--icon--danger"
                        title="Delete patient"
                        onClick={() => setDeleteTarget(p)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Mobile Cards ── */}
      {!loading && paginated.length > 0 && (
        <div className="patient-cards">
          {paginated.map(p => (
            <div key={p.id} className="patient-card">
              <div className="patient-card__top">
                <div className="patient-card__avatar">{getInitials(p.name)}</div>
                <div className="patient-card__info">
                  <div className="patient-card__name">{p.name}</div>
                  <div className="patient-card__meta">{p.email} · {p.address}</div>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
              <div className="patient-card__actions">
                <button className="btn btn--outline btn--sm btn--full" onClick={() => navigate(`/patients/${p.id}`)}>
                  <Eye size={14} /> View
                </button>
                <button className="btn btn--secondary btn--sm btn--full" onClick={() => navigate(`/patients/${p.id}/edit`)}>
                  <Pencil size={14} /> Edit
                </button>
                <button className="btn btn--danger btn--sm" onClick={() => setDeleteTarget(p)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && filtered.length > PAGE_SIZE && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      {/* ── Delete Modal ── */}
      {deleteTarget && (
        <Modal
          title="Delete Patient"
          message={`Are you sure you want to permanently delete "${deleteTarget.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          isLoading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
