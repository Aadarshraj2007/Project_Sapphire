import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FolderKanban, Plus, Users, LogOut, Shield,
  Building2, HardHat, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role;

  const navItems = {
    SUPREME_ADMIN: [
      { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/admin/users', icon: Users, label: 'Manage Users' },
    ],
    GOVERNMENT: [
      { to: '/gov', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/gov/create-project', icon: Plus, label: 'Create Project' },
    ],
    CONTRACTOR: [
      { to: '/contractor', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  };

  const items = navItems[role] || [];

  const roleIcon = {
    SUPREME_ADMIN: <Shield size={16} />,
    GOVERNMENT: <Building2 size={16} />,
    CONTRACTOR: <HardHat size={16} />,
  };

  const roleLabel = {
    SUPREME_ADMIN: 'Supreme Admin',
    GOVERNMENT: 'Government',
    CONTRACTOR: 'Contractor',
  };

  return (
    <aside
      style={{
        width: collapsed ? '72px' : 'var(--sidebar-width)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '1.25rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)',
        minHeight: '64px',
      }}>
        {!collapsed && (
          <span style={{ fontWeight: 800, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Gov
            </span>
            Chain
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn-ghost btn-icon"
          style={{ flexShrink: 0, marginLeft: collapsed ? 'auto' : 0, marginRight: collapsed ? 'auto' : 0 }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--gradient-primary)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {roleIcon[role]} {roleLabel[role]}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: collapsed ? '0.7rem' : '0.7rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: isActive ? 'var(--color-primary-hover)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              justifyContent: collapsed ? 'center' : 'flex-start',
              whiteSpace: 'nowrap',
            })}
          >
            <item.icon size={20} style={{ flexShrink: 0 }} />
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: collapsed ? '0.7rem' : '0.7rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-danger)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'background 0.15s ease',
            fontFamily: 'var(--font-family)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-danger-bg)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={20} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
