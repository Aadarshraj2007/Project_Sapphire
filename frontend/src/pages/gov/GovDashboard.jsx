import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderKanban, Plus, MapPin, IndianRupee, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';

const GovDashboard = () => {
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
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
            <div className="page-header" style={{ marginBottom: 0 }}>
              <h1>My Projects</h1>
              <p>Manage your government projects</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/gov/create-project')}>
              <Plus size={18} /> New Project
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-icon primary"><FolderKanban size={22} /></div>
              <div className="stat-info"><h4>{stats.total}</h4><p>Total Projects</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success"><Clock size={22} /></div>
              <div className="stat-info"><h4>{stats.active}</h4><p>Active</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon info"><FolderKanban size={22} /></div>
              <div className="stat-info"><h4>{stats.completed}</h4><p>Completed</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon warning"><IndianRupee size={22} /></div>
              <div className="stat-info"><h4>₹{stats.totalBudget.toLocaleString()}</h4><p>Total Budget</p></div>
            </div>
          </div>

          {loading ? <Loader /> : projects.length === 0 ? (
            <div className="empty-state">
              <FolderKanban size={64} />
              <h3>No Projects Yet</h3>
              <p>Create your first project to get started.</p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/gov/create-project')}>
                <Plus size={18} /> Create Project
              </button>
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
                  onClick={() => navigate(`/gov/project/${project.id}`)}
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

export default GovDashboard;
