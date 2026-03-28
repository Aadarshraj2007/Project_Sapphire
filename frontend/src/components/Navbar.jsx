import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  const dashboardPath = {
    SUPREME_ADMIN: '/admin',
    GOVERNMENT: '/gov',
    CONTRACTOR: '/contractor',
  };

  return (
    <nav className="top-navbar">
      <Link to="/" className="logo" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
        <Shield size={22} style={{ color: 'var(--color-primary)' }} />
        <span>
          <span className="text-gradient">Gov</span>Chain
        </span>
      </Link>
      <div className="nav-links">
        <Link to="/public/project">
          <button className="btn btn-ghost">Explore Projects</button>
        </Link>
        {isAuthenticated ? (
          <Link to={dashboardPath[user?.role] || '/login'}>
            <button className="btn btn-primary btn-sm">Dashboard</button>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <button className="btn btn-ghost">Login</button>
            </Link>
            <Link to="/signup">
              <button className="btn btn-primary btn-sm">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
