import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import Loader from '../../components/Loader';

const CreateProject = () => {
  const [form, setForm] = useState({
    name: '', description: '', locationState: '', locationCity: '', budget: '', contractorCppId: '',
  });
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingContractors, setLoadingContractors] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const res = await API.get('/projects/contractors');
        setContractors(res.data);
      } catch (err) {
        toast.error('Failed to load contractors');
      } finally {
        setLoadingContractors(false);
      }
    };
    fetchContractors();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        locationState: form.locationState,
        locationCity: form.locationCity,
        budget: parseFloat(form.budget),
        contractorCppId: form.contractorCppId || undefined,
      };
      await API.post('/projects', payload);
      toast.success('Project created successfully!');
      navigate('/gov');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ maxWidth: '640px' }}>
          <div className="page-header">
            <h1>Create New Project</h1>
            <p>Fill in the project details below</p>
          </div>

          <div className="glass-card-static">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input name="name" className="form-input" placeholder="e.g., Highway Construction Phase 2" value={form.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-textarea" placeholder="Describe the project scope and objectives..." value={form.description} onChange={handleChange} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input name="locationState" className="form-input" placeholder="e.g., Maharashtra" value={form.locationState} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input name="locationCity" className="form-input" placeholder="e.g., Mumbai" value={form.locationCity} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Budget (₹)</label>
                <input name="budget" type="number" className="form-input" placeholder="Enter budget amount" value={form.budget} onChange={handleChange} required min="1" />
              </div>

              <div className="form-group">
                <label className="form-label">Assign Contractor</label>
                {loadingContractors ? (
                  <div style={{ padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading contractors...</div>
                ) : (
                  <select name="contractorCppId" className="form-select" value={form.contractorCppId} onChange={handleChange} required>
                    <option value="">Select a contractor</option>
                    {contractors.map(c => (
                      <option key={c.cppUserId} value={c.cppUserId}>
                        {c.name} ({c.cppUserId})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> : <><Plus size={18} /> Create Project</>}
                </button>
                <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate('/gov')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateProject;
