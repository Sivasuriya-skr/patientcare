import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, CreditCard, Calendar, Activity, Plus, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { getPatients } from '../api/patientApi';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/DashboardPage.css';
import '../styles/components/Button.css';

// Generate last 30 days mock chart data
const generateChartData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({
      date: format(d, 'MMM d'),
      registrations: Math.floor(Math.random() * 8) + 1,
    });
  }
  return data;
};

const chartData = generateChartData();

const UPCOMING = [
  { time: 'Today  2:00 PM',  name: 'Dr. Sarah Smith — General Checkup',   type: 'Consultation' },
  { time: 'Tue  10:00 AM',   name: 'Lab Work — Blood Test',                type: 'Lab' },
  { time: 'Wed   3:30 PM',   name: 'Dr. Kumar — Follow-up',               type: 'Follow-up' },
  { time: 'Thu   9:00 AM',   name: 'Prescription Review',                  type: 'Prescription' },
];

export default function DashboardPage() {
  const { userEmail } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
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
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const initials = (name) =>
    name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'P';

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <div className="dashboard__header">
        <h1 className="dashboard__greeting">
          {greeting()}, {userEmail?.split('@')[0] || 'Doctor'} 👋
        </h1>
        <p className="dashboard__date">
          <Calendar size={14} />
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="dashboard__stats">
        <StatCard
          title="Total Patients"
          value={loading ? '...' : patients.length}
          trend={12}
          trendLabel="this week"
          icon={Users}
          variant="blue"
        />
        <StatCard
          title="Billing Revenue"
          value="$12.5K"
          trend={8}
          trendLabel="this month"
          icon={CreditCard}
          variant="green"
        />
        <StatCard
          title="Appointments"
          value="24"
          trend={-3}
          trendLabel="vs last week"
          icon={Calendar}
          variant="orange"
        />
        <StatCard
          title="Active Staff"
          value="28"
          trend={5}
          trendLabel="this month"
          icon={Activity}
          variant="purple"
        />
      </div>

      {/* ── Quick Actions ── */}
      <div className="dashboard__actions">
        <span className="dashboard__actions-title">Quick Actions:</span>
        <button className="btn btn--primary btn--sm" onClick={() => navigate('/patients/new')}>
          <Plus size={15} /> New Patient
        </button>
        <button className="btn btn--secondary btn--sm" onClick={() => navigate('/billing')}>
          <FileText size={15} /> View Reports
        </button>
        <button className="btn btn--secondary btn--sm" onClick={() => navigate('/patients')}>
          <Users size={15} /> All Patients
        </button>
        <button className="btn btn--secondary btn--sm">
          <Download size={15} /> Export Data
        </button>
      </div>

      {/* ── Middle Grid ── */}
      <div className="dashboard__middle">
        {/* Recent Patients */}
        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title">Recent Patients</h3>
            <Link to="/patients" className="dash-card__link">View all →</Link>
          </div>

          {loading ? (
            <LoadingSpinner size={32} text="Loading patients..." />
          ) : patients.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: 'var(--space-8)' }}>
              No patients yet. <Link to="/patients/new">Add the first one →</Link>
            </p>
          ) : (
            patients.slice(0, 6).map((p) => (
              <div
                key={p.id}
                className="recent-patient"
                onClick={() => navigate(`/patients/${p.id}`)}
                title="View patient"
              >
                <div className="recent-patient__avatar">
                  {initials(p.name)}
                </div>
                <div className="recent-patient__info">
                  <div className="recent-patient__name">{p.name}</div>
                  <div className="recent-patient__meta">
                    {p.email} • {p.address}
                  </div>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
            ))
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title">Upcoming Appointments</h3>
            <a href="#" className="dash-card__link">View calendar →</a>
          </div>

          {UPCOMING.map((appt, i) => (
            <div key={i} className="appointment-item">
              <div className="appointment-item__dot" />
              <div>
                <div className="appointment-item__time">{appt.time}</div>
                <div className="appointment-item__name">{appt.name}</div>
                <div className="appointment-item__type">{appt.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="dashboard__chart">
        <div className="chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">Patient Registrations — Last 30 Days</h3>
            <div className="chart-card__legend">
              <span className="chart-card__legend-dot" />
              Registrations
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 5, right: 16, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: 13,
                }}
                cursor={{ stroke: '#2563EB', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="registrations"
                stroke="#2563EB"
                strokeWidth={2.5}
                fill="url(#colorReg)"
                dot={false}
                activeDot={{ r: 5, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
