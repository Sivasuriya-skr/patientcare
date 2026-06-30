import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, CreditCard, BarChart2,
  Settings, HelpCircle, Stethoscope
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/components/Sidebar.css';

const navItems = [
  { label: 'Dashboard',  icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Patients',   icon: Users,            to: '/patients' },
  { label: 'Billing',    icon: CreditCard,       to: '/billing' },
  { label: 'Analytics',  icon: BarChart2,        to: '/analytics' },
];

const bottomItems = [
  { label: 'Settings',     icon: Settings,   to: '/settings' },
  { label: 'Help',         icon: HelpCircle, to: '/help' },
];

export default function Sidebar({ collapsed, mobileOpen, onOverlayClick }) {
  const { userEmail } = useAuth();
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : 'U';

  const sidebarClass = [
    'sidebar',
    collapsed ? 'sidebar--collapsed' : '',
    mobileOpen ? 'sidebar--mobile-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={onOverlayClick} />}

      <aside className={sidebarClass}>
        <nav className="sidebar__nav">
          <div className="sidebar__section-label">Main Menu</div>

          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar__item${isActive ? ' sidebar__item--active' : ''}`
              }
              data-tooltip={label}
            >
              <Icon className="sidebar__item-icon" size={20} />
              <span className="sidebar__item-text">{label}</span>
            </NavLink>
          ))}

          <div className="sidebar__section-label" style={{ marginTop: 'var(--space-6)' }}>Support</div>

          {bottomItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar__item${isActive ? ' sidebar__item--active' : ''}`
              }
              data-tooltip={label}
            >
              <Icon className="sidebar__item-icon" size={20} />
              <span className="sidebar__item-text">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user-card">
            <div className="sidebar__user-avatar">{initials}</div>
            <span className="sidebar__user-name">{userEmail || 'User'}</span>
          </div>
        </div>
      </aside>
    </>
  );
}
