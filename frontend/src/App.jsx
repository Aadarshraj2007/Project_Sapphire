import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import GovDashboard from './pages/gov/GovDashboard';
import CreateProject from './pages/gov/CreateProject';
import ProjectDetail from './pages/gov/ProjectDetail';
import ContractorDashboard from './pages/contractor/ContractorDashboard';
import ProjectView from './pages/contractor/ProjectView';
import PublicProject from './pages/public/PublicProject';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#1e293b',
              border: '1px solid rgba(15, 23, 42, 0.1)',
              borderRadius: '12px',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#ffffff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/public/project" element={<PublicProject />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['SUPREME_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['SUPREME_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Government Routes */}
          <Route path="/gov" element={
            <ProtectedRoute roles={['GOVERNMENT']}>
              <GovDashboard />
            </ProtectedRoute>
          } />
          <Route path="/gov/create-project" element={
            <ProtectedRoute roles={['GOVERNMENT']}>
              <CreateProject />
            </ProtectedRoute>
          } />
          <Route path="/gov/project/:id" element={
            <ProtectedRoute roles={['GOVERNMENT']}>
              <ProjectDetail />
            </ProtectedRoute>
          } />

          {/* Contractor Routes */}
          <Route path="/contractor" element={
            <ProtectedRoute roles={['CONTRACTOR']}>
              <ContractorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/contractor/project/:id" element={
            <ProtectedRoute roles={['CONTRACTOR']}>
              <ProjectView />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
