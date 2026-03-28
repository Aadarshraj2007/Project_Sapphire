import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderKanban, MapPin, IndianRupee, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';

const ContractorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get('/projects/my');
        setProjects(res.data);
      } catch (err) {
        toast.error('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'ACTIVE').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length,
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="page-header">
            <h1>Contractor Dashboard</h1>
            <p>View your assigned projects and upload documents</p>
          </div>

          {/* Stats */}
          <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-icon primary"><FolderKanban size={22} /></div>
              <div className="stat-info"><h4>{stats.total}</h4><p>Assigned Projects</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success"><Clock size={22} /></div>
              <div className="stat-info"><h4>{stats.active}</h4><p>Active</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon info"><CheckCircle size={22} /></div>
              <div className="stat-info"><h4>{stats.completed}</h4><p>Completed</p></div>
            </div>
          </div>

          {loading ? <Loader /> : projects.length === 0 ? (
            <div className="empty-state">
              <FolderKanban size={64} />
              <h3>No Projects Assigned</h3>
              <p>You haven't been assigned to any projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  className="project-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/contractor/project/${project.id}`)}
                >
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                    <StatusBadge status={project.status} />
                  </div>
                  <h3>{project.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </p>
                  <div className="project-meta">
                    <span><MapPin size={14} /> {project.locationCity}, {project.locationState}</span>
                    <span><IndianRupee size={14} /> ₹{project.budget?.toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ContractorDashboard;
