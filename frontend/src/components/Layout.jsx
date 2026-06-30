import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/components/Layout.css';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileOpen(o => !o);
    } else {
      setCollapsed(o => !o);
    }
  };

  return (
    <div className="layout">
      <Navbar onToggleSidebar={toggleSidebar} />
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onOverlayClick={() => setMobileOpen(false)}
      />
      <main className={`layout__content${collapsed ? ' layout__content--collapsed' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}
