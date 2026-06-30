import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Stethoscope, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import '../styles/components/Navbar.css';

export default function Navbar({ onToggleSidebar }) {
  const { userEmail, logoutUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : 'U';

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <Link to="/dashboard" className="navbar__logo">
          <div className="navbar__logo-icon">
            <Stethoscope size={20} />
          </div>
          <span className="navbar__logo-text">PatientCare</span>
        </Link>
      </div>

      <div className="navbar__right">
        <div className="navbar__user" ref={dropdownRef} onClick={() => setDropdownOpen(o => !o)}>
          <div className="navbar__avatar">{initials}</div>
          <div className="navbar__user-info">
            <div className="navbar__user-email">{userEmail || 'User'}</div>
            <div className="navbar__user-role">Administrator</div>
          </div>
          <ChevronDown size={16} style={{ color: 'var(--color-text-muted)', marginLeft: 4 }} />

          {dropdownOpen && (
            <div className="navbar__dropdown">
              <button className="navbar__dropdown-item">
                <User size={16} /> Profile
              </button>
              <button className="navbar__dropdown-item">
                <Settings size={16} /> Settings
              </button>
              <hr className="navbar__dropdown-divider" />
              <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={logoutUser}>
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
