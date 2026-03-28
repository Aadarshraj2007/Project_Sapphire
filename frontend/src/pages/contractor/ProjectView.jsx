import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, IndianRupee, FileText, Upload, CheckCircle,
  XCircle, Clock, Shield, AlertTriangle, Send, UploadCloud
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [milestoneDocuments, setMilestoneDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  // Upload state
  const [uploadModal, setUploadModal] = useState(null); // milestoneId
  const [uploadForm, setUploadForm] = useState({ file: null, type: 'PROOF', isPublic: true });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      setProject(res.data);
      if (res.data.milestones) {
        setMilestones(res.data.milestones);
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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      toast.error('Please select a file');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('milestoneId', uploadModal);
      formData.append('type', uploadForm.type);
      formData.append('isPublic', uploadForm.isPublic);

      const uploadRes = await API.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const documentId = uploadRes.data.document?.id;
      if (documentId) {
        await API.put(`/documents/submit/${documentId}`);
        toast.success('Document uploaded and submitted!');
      } else {
        toast.success('Document uploaded!');
      }

      setUploadModal(null);
      setUploadForm({ file: null, type: 'PROOF', isPublic: true });
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.msg || err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleResubmit = async (documentId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append('file', file);
        await API.post(`/documents/resubmit/${documentId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Document resubmitted!');
        fetchProject();
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Resubmit failed');
      }
    };
    input.click();
  };

  const statusClass = (s) => s?.toLowerCase() || 'pending';

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

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <button className="btn btn-ghost" onClick={() => navigate('/contractor')} style={{ marginBottom: '1rem' }}>
              <ArrowLeft size={16} /> Back to Projects
            </button>
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
            </div>
          </div>

          {/* Milestones */}
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
            Milestones ({milestones.length})
          </h2>

          {milestones.length === 0 ? (
            <div className="empty-state">
              <Clock size={48} />
              <h3>No Milestones</h3>
              <p>The government hasn't created milestones for this project yet.</p>
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

                          {/* Site Inspection Status */}
                          <div style={{ marginBottom: '1rem' }}>
                            <div className="flex items-center gap-1">
                              <Shield size={16} style={{ color: 'var(--text-muted)' }} />
                              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Site Inspection:</span>
                              <StatusBadge status={milestone.siteInspection} />
                            </div>
                          </div>

                          {/* Upload Button */}
                          {(milestone.status === 'PENDING' || milestone.status === 'SUBMITTED' || milestone.status === 'REJECTED') && (
                            <button className="btn btn-primary btn-sm" style={{ marginBottom: '1rem' }}
                              onClick={() => setUploadModal(milestone.id)}>
                              <UploadCloud size={16} /> Upload Document
                            </button>
                          )}

                          {/* Documents */}
                          <div>
                            <div className="flex items-center gap-1" style={{ marginBottom: '0.5rem' }}>
                              <FileText size={16} style={{ color: 'var(--text-muted)' }} />
                              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Documents ({docs.length})</span>
                            </div>
                            {docs.length === 0 ? (
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.5rem 0' }}>
                                No documents uploaded yet. Upload proof of work to proceed.
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
                                    {doc.verification === 'REJECTED' && (
                                      <>
                                        {doc.rejectionReason && (
                                          <span className="tag" style={{ color: 'var(--color-danger)', fontSize: '0.7rem' }}>
                                            <AlertTriangle size={10} /> {doc.rejectionReason}
                                          </span>
                                        )}
                                        <button className="btn btn-warning btn-sm" onClick={() => handleResubmit(doc.id)}>
                                          <Upload size={14} /> Resubmit
                                        </button>
                                      </>
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

        {/* Upload Modal */}
        <AnimatePresence>
          {uploadModal && (
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="modal" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UploadCloud size={22} /> Upload Document
                </h2>
                <form onSubmit={handleUpload}>
                  <div className="form-group">
                    <label className="form-label">Document Type</label>
                    <select className="form-select" value={uploadForm.type}
                      onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}>
                      <option value="PROOF">Proof</option>
                      <option value="INVOICE">Invoice</option>
                      <option value="BILL">Bill</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">File</label>
                    <div
                      className={`file-upload-zone ${uploadForm.file ? 'active' : ''}`}
                      onClick={() => fileRef.current?.click()}
                    >
                      <input ref={fileRef} type="file" style={{ display: 'none' }}
                        onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })} />
                      {uploadForm.file ? (
                        <div>
                          <CheckCircle size={24} style={{ color: 'var(--color-success)', margin: '0 auto 0.5rem' }} />
                          <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{uploadForm.file.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {(uploadForm.file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Upload size={24} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem' }} />
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Click to select file</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF, images, documents</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={uploading || !uploadForm.file}>
                      {uploading ? 'Uploading...' : <><Send size={16} /> Upload & Submit</>}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={() => {
                      setUploadModal(null);
                      setUploadForm({ file: null, type: 'PROOF', isPublic: true });
                    }}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ProjectView;
