import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Shield, MapPin, IndianRupee, FileText, CheckCircle,
  XCircle, AlertTriangle, Link2, Eye, Calendar, ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Navbar from '../../components/Navbar';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';

const PublicProject = () => {
  const [projectId, setProjectId] = useState('');
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [searched, setSearched] = useState(false);

  // Complaint States
  const [showComplaint, setShowComplaint] = useState(false);
  const [complaintMsg, setComplaintMsg] = useState('');
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  const fetchAllProjects = async () => {
    try {
      const res = await API.get('/public/all');
      setProjects(res.data.data);
    } catch (err) {
      toast.error('Failed to load project list');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const handleSearch = async (e, manualId = null) => {
    if (e) e.preventDefault();
    const idToSearch = manualId || projectId;
    if (!idToSearch.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await API.get(`/public/project/${idToSearch.trim()}`);
      setData(res.data.data);
      setProjectId(idToSearch); // Sync input if clicked from card
      setShowComplaint(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Project not found');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async () => {
    if (!complaintMsg || complaintMsg.length < 10) return;
    setSubmittingComplaint(true);
    try {
      await API.post('/public/complaint', {
        projectId: data.project.id,
        message: complaintMsg
      });
      toast.success('Complaint submitted successfully');
      setShowComplaint(false);
      setComplaintMsg('');
    } catch (err) {
      toast.error('Failed to submit complaint');
    } finally {
      setSubmittingComplaint(false);
    }
  };

  const blockchainIcon = (status) => {
    if (status === 'VERIFIED') return <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />;
    if (status === 'TAMPERED') return <AlertTriangle size={16} style={{ color: 'var(--color-danger)' }} />;
    return <Link2 size={16} style={{ color: 'var(--color-warning)' }} />;
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: 'var(--radius-lg)',
                  background: 'rgba(99, 102, 241, 0.12)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Eye size={28} style={{ color: 'var(--color-primary)' }} />
                </div>
              </div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                Public <span className="text-gradient">Project Exploration</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                Explore government projects and verify their integrity on the blockchain.
              </p>
            </div>

            {/* Search + Navigation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <form onSubmit={handleSearch}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter Project ID to verify..."
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      style={{ paddingLeft: '3rem', height: '48px', fontSize: '0.95rem' }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? 'Verifying...' : <><Search size={18} /> Verify ID</>}
                  </button>
                </div>
              </form>

              {data && (
                <button className="btn btn-ghost" onClick={() => { setData(null); setSearched(false); setProjectId(''); }} style={{ alignSelf: 'flex-start' }}>
                  <ArrowLeft size={16} /> Back to Project List
                </button>
              )}
            </div>

            {loading ? (
              <Loader text="Performing deep blockchain verification..." />
            ) : (
              <AnimatePresence mode="wait">
                {data ? (
                  /* SINGLE PROJECT VIEW (Verification Details) */
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Project Info */}
                    <div className="glass-card-static" style={{ marginBottom: '1.5rem' }}>
                      <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>{data.project.name}</h2>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>{data.project.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={14} /> {data.project.location?.full}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Shield size={14} /> Assigned by: <strong style={{ color: 'var(--text-secondary)' }}>{data.project.assignedBy}</strong>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          Contractor: <strong style={{ color: 'var(--text-secondary)' }}>
                            {data.project.contractorName} ({data.project.assignedTo})
                          </strong>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={14} /> {new Date(data.project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Milestones */}
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.15rem' }}>
                      Milestones ({data.milestones?.length || 0})
                    </h3>

                    {data.milestones?.map((milestone, i) => (
                      <motion.div
                        key={milestone.id}
                        className={`glass-card-static ${milestone.blockchainStatus?.status === 'TAMPERED' ? 'tampered-pulse' : ''}`}
                        style={{ marginBottom: '1rem' }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        {/* Milestone Header */}
                        <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{milestone.title}</h4>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              Amount: ₹{milestone.amount?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <StatusBadge status={milestone.status} />
                          </div>
                        </div>

                        {/* Blockchain Status */}
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          padding: '0.6rem 0.9rem',
                          background: milestone.blockchainStatus?.status === 'VERIFIED'
                            ? 'var(--color-success-bg)'
                            : milestone.blockchainStatus?.status === 'TAMPERED'
                            ? 'var(--color-danger-bg)'
                            : 'var(--color-warning-bg)',
                          borderRadius: 'var(--radius-sm)',
                          marginBottom: '0.75rem',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                        }}>
                          {blockchainIcon(milestone.blockchainStatus?.status)}
                          <span>
                            Blockchain: {milestone.blockchainStatus?.status}
                            {milestone.blockchainStatus?.reason && (
                              <span style={{ fontWeight: 400, opacity: 0.8, marginLeft: '0.5rem' }}>
                                — {milestone.blockchainStatus.reason}
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Documents */}
                        {milestone.documents?.length > 0 && (
                          <>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                              Documents ({milestone.documents.length})
                            </div>
                            {milestone.documents.map(doc => (
                              <div key={doc.id} className="doc-item">
                                <a
                                  href={`http://localhost:5000/api/public/document/${doc.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="doc-info"
                                  style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                  <FileText size={16} style={{ color: 'var(--color-primary)' }} />
                                  <span style={{ fontSize: '0.85rem' }}>{doc.fileName}</span>
                                </a>
                                <div className="flex items-center gap-1">
                                  {doc.status === 'VERIFIED' && (
                                    <span className="badge badge-success"><CheckCircle size={12} /> Verified</span>
                                  )}
                                  {doc.status === 'TAMPERED' && (
                                    <span className="badge badge-danger"><AlertTriangle size={12} /> Tampered</span>
                                  )}
                                  {doc.status === 'NOT_STORED' && (
                                    <span className="badge badge-warning"><Link2 size={12} /> Not Stored</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </motion.div>
                    ))}

                    {/* Complaints Record Section */}
                    {data.complaints?.length > 0 && (
                      <div className="glass-card-static" style={{ marginTop: '2rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                          <AlertTriangle size={18} /> Public Complaints History ({data.complaints.length})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {data.complaints.map((c, i) => (
                            <motion.div 
                              key={c.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.05 }}
                              style={{ 
                                padding: '1rem', 
                                background: 'rgba(255, 255, 255, 0.02)', 
                                borderRadius: 'var(--radius-sm)',
                                borderLeft: '3px solid var(--color-danger)'
                              }}
                            >
                              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>"{c.message}"</p>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Submitted by: {c.submittedBy}</span>
                                <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Report / Complaint Section */}
                    <div className="glass-card-static" style={{ marginTop: '2rem', border: '1px solid rgba(255, 100, 100, 0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showComplaint ? '1.5rem' : '0' }}>
                        <div>
                          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)', margin: 0 }}>
                            <AlertTriangle size={20} /> Unsatisfied?
                          </h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                            If you find any discrepancy or are not satisfied with the progress, file an official complaint.
                          </p>
                        </div>
                        {!showComplaint && (
                          <button className="btn btn-danger" onClick={() => setShowComplaint(true)}>
                            File Complaint
                          </button>
                        )}
                      </div>

                      {showComplaint && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                          <textarea
                            className="form-input"
                            rows="4"
                            placeholder="Describe your concern in detail (min 10 characters)..."
                            value={complaintMsg}
                            onChange={(e) => setComplaintMsg(e.target.value)}
                            style={{ marginBottom: '1rem', width: '100%' }}
                          />
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <button 
                              className="btn btn-primary" 
                              onClick={handleSubmitComplaint}
                              disabled={submittingComplaint || complaintMsg.length < 10}
                            >
                              {submittingComplaint ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                            <button className="btn btn-ghost" onClick={() => { setShowComplaint(false); setComplaintMsg(''); }}>
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  /* PROJECT LIST VIEW (Default) */
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {loadingList ? (
                      <Loader text="Fetching projects..." />
                    ) : projects.length === 0 ? (
                      <div className="empty-state">
                        <Calendar size={48} />
                        <h3>No Projects Found</h3>
                        <p>There are no government projects available to view at the moment.</p>
                      </div>
                    ) : (
                      <div className="grid grid-2">
                        {projects.map((p, i) => (
                          <motion.div
                            key={p.id}
                            className="project-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => handleSearch(null, p.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                              <StatusBadge status={p.status} />
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                <Shield size={12} /> {p.government?.name}
                              </div>
                            </div>
                            <h3>{p.name}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {p.description}
                            </p>
                            <div className="project-meta">
                              <span><MapPin size={14} /> {p.locationCity}, {p.locationState}</span>
                              <span style={{ marginLeft: 'auto', color: 'var(--color-primary)', fontWeight: 600 }}>
                                <Eye size={14} /> Verify
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* No search results (manual entry) */}
            {!loading && searched && !data && (
              <div className="empty-state">
                <Search size={48} />
                <h3>Project Not Found</h3>
                <p>Check the project ID and try again.</p>
                <button className="btn btn-outline" onClick={() => { setSearched(false); setProjectId(''); }}>
                  View All Projects
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PublicProject;
