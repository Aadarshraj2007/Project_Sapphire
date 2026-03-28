import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, MapPin, IndianRupee, FileText, CheckCircle, XCircle,
  Eye, Upload, Clock, Shield, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [milestoneDocuments, setMilestoneDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  // Create milestone form
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({ title: '', description: '', amount: '', sequence: '' });
  const [creatingMilestone, setCreatingMilestone] = useState(false);

  // Rejection modal
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      setProject(res.data);
      if (res.data.milestones) {
        setMilestones(res.data.milestones);
        // Fetch documents for each milestone
        for (const m of res.data.milestones) {
          try {
            const docRes = await API.get(`/documents/milestone/${m.id}`);
            setMilestoneDocuments(prev => ({ ...prev, [m.id]: docRes.data.documents }));
          } catch {}
        }
      }
    } catch (err) {
      toast.error('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProject(); }, [id]);

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    setCreatingMilestone(true);
    try {
      await API.post('/milestones', {
        projectId: id,
        title: milestoneForm.title,
        description: milestoneForm.description,
        amount: parseFloat(milestoneForm.amount),
        sequence: parseInt(milestoneForm.sequence),
      });
      toast.success('Milestone created!');
      setShowMilestoneForm(false);
      setMilestoneForm({ title: '', description: '', amount: '', sequence: '' });
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to create milestone');
    } finally {
      setCreatingMilestone(false);
    }
  };

  const handleVerifyDocument = async (documentId, verification) => {
    try {
      const payload = { verification };
      if (verification === 'REJECTED' && rejectionReason) {
        payload.rejectionReason = rejectionReason;
      }
      await API.put(`/documents/verify/${documentId}`, payload);
      toast.success(`Document ${verification.toLowerCase()}!`);
      setRejectModal(null);
      setRejectionReason('');
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.message || 'Verification failed');
    }
  };

  const handleSiteInspection = async (milestoneId, status) => {
    try {
      await API.put(`/milestones/${milestoneId}`, { siteInspection: status });
      toast.success(`Site inspection marked as ${status}`);
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Update failed');
    }
  };

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content"><Loader /></main>
    </div>
  );

  if (!project) return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="empty-state"><h3>Project not found</h3></div>
      </main>
    </div>
  );

  const statusClass = (s) => {
    return s?.toLowerCase() || 'pending';
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <button className="btn btn-ghost" onClick={() => navigate('/gov')} style={{ marginBottom: '1rem' }}>
              <ArrowLeft size={16} /> Back to Projects
            </button>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                  <h1 style={{ margin: 0 }}>{project.name}</h1>
                  <StatusBadge status={project.status} />
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{project.description}</p>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} /> {project.locationCity}, {project.locationState}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <IndianRupee size={14} /> ₹{project.budget?.toLocaleString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Contractor: <strong>{project.contractorCppId}</strong>
                  </span>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => setShowMilestoneForm(!showMilestoneForm)}>
                <Plus size={18} /> Add Milestone
              </button>
            </div>
          </div>

          {/* Create Milestone Form */}
          <AnimatePresence>
            {showMilestoneForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden', marginBottom: '1.5rem' }}
              >
                <div className="glass-card-static">
                  <h3 style={{ marginBottom: '1rem' }}>Create Milestone</h3>
                  <form onSubmit={handleCreateMilestone}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Title</label>
                        <input className="form-input" placeholder="Milestone title" value={milestoneForm.title}
                          onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Sequence</label>
                        <input type="number" className="form-input" placeholder="1, 2, 3..." value={milestoneForm.sequence}
                          onChange={(e) => setMilestoneForm({ ...milestoneForm, sequence: e.target.value })} required min="1" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea className="form-textarea" placeholder="Describe this milestone..." value={milestoneForm.description}
                        onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Amount (₹)</label>
                      <input type="number" className="form-input" placeholder="Amount for this milestone" value={milestoneForm.amount}
                        onChange={(e) => setMilestoneForm({ ...milestoneForm, amount: e.target.value })} required min="0" />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button type="submit" className="btn btn-success" disabled={creatingMilestone}>
                        {creatingMilestone ? 'Creating...' : <><Plus size={16} /> Create</>}
                      </button>
                      <button type="button" className="btn btn-outline" onClick={() => setShowMilestoneForm(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Milestones */}
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
            Milestones ({milestones.length})
          </h2>

          {milestones.length === 0 ? (
            <div className="empty-state">
              <Clock size={48} />
              <h3>No Milestones</h3>
              <p>Add milestones to track project progress.</p>
            </div>
          ) : (
            <div className="milestone-list">
              {milestones.map((milestone, i) => {
                const docs = milestoneDocuments[milestone.id] || [];
                const isExpanded = expandedMilestone === milestone.id;

                return (
                  <motion.div
                    key={milestone.id}
                    className={`milestone-item ${statusClass(milestone.status)}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div
                      className="flex items-center justify-between"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setExpandedMilestone(isExpanded ? null : milestone.id)}
                    >
                      <div>
                        <div className="flex items-center gap-1" style={{ marginBottom: '0.25rem' }}>
                          <span className="tag">#{milestone.sequence}</span>
                          <h3 style={{ fontSize: '1rem', margin: 0 }}>{milestone.title}</h3>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{milestone.description}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <StatusBadge status={milestone.status} />
                        <span className="tag">₹{milestone.amount?.toLocaleString()}</span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <hr className="divider" />

                          {/* Site Inspection */}
                          <div style={{ marginBottom: '1rem' }}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Shield size={16} style={{ color: 'var(--text-muted)' }} />
                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Site Inspection:</span>
                                <StatusBadge status={milestone.siteInspection} />
                              </div>
                              {milestone.siteInspection === 'PENDING' && (
                                <div className="flex gap-1">
                                  <button className="btn btn-success btn-sm" onClick={() => handleSiteInspection(milestone.id, 'PASSED')}>
                                    <CheckCircle size={14} /> Pass
                                  </button>
                                  <button className="btn btn-danger btn-sm" onClick={() => handleSiteInspection(milestone.id, 'FAILED')}>
                                    <XCircle size={14} /> Fail
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Documents */}
                          <div>
                            <div className="flex items-center gap-1" style={{ marginBottom: '0.5rem' }}>
                              <FileText size={16} style={{ color: 'var(--text-muted)' }} />
                              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Documents ({docs.length})</span>
                            </div>
                            {docs.length === 0 ? (
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>
                                No documents uploaded yet.
                              </p>
                            ) : (
                              docs.map(doc => (
                                <div key={doc.id} className="doc-item">
                                  <a
                                    href={`http://localhost:5000/api/public/document/${doc.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="doc-info"
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                  >
                                    <FileText size={18} style={{ color: 'var(--color-primary)' }} />
                                    <div>
                                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{doc.fileName}</div>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {doc.type} • {new Date(doc.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </a>
                                  <div className="doc-actions">
                                    <StatusBadge status={doc.verification} />
                                    {doc.verification === 'SUBMITTED' && (
                                      <>
                                        <button className="btn btn-success btn-sm" onClick={() => handleVerifyDocument(doc.id, 'APPROVED')}>
                                          <CheckCircle size={14} /> Approve
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => setRejectModal(doc.id)}>
                                          <XCircle size={14} /> Reject
                                        </button>
                                      </>
                                    )}
                                    {doc.rejectionReason && (
                                      <span className="tag" style={{ color: 'var(--color-danger)' }}>
                                        <AlertTriangle size={12} /> {doc.rejectionReason}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Rejection Modal */}
        <AnimatePresence>
          {rejectModal && (
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="modal" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
                <h2>Reject Document</h2>
                <div className="form-group">
                  <label className="form-label">Rejection Reason (optional)</label>
                  <textarea className="form-textarea" placeholder="Provide a reason for rejection..." value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn btn-danger" onClick={() => handleVerifyDocument(rejectModal, 'REJECTED')}>
                    <XCircle size={16} /> Reject
                  </button>
                  <button className="btn btn-outline" onClick={() => { setRejectModal(null); setRejectionReason(''); }}>Cancel</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ProjectDetail;
