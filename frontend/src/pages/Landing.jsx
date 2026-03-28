import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, Landmark, FileCheck, Link2, Users } from 'lucide-react';
import Navbar from '../components/Navbar';

const Landing = () => {
  return (
    <>
      <Navbar />
      <div className="landing-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Shield size={40} style={{ color: 'var(--color-primary)' }} />
          </div>
          <h1>
            <span className="text-gradient">Transparent</span> Government
            <br />Project Management
          </h1>
          <p>
            Blockchain-secured tracking of government projects, milestones, payments, and documents.
            Every transaction is immutable and publicly verifiable.
          </p>
          <div className="landing-actions">
            <Link to="/signup">
              <button className="btn btn-primary btn-lg">Get Started</button>
            </Link>
            <Link to="/public/project">
              <button className="btn btn-outline btn-lg">Explore Projects</button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="landing-features"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        >
          <div className="feature-card">
            <div className="feature-icon"><Link2 size={20} /></div>
            <h3>Blockchain Verified</h3>
            <p>Every milestone and document hash is stored on-chain, ensuring tamper-proof records.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
              <Eye size={20} />
            </div>
            <h3>Public Transparency</h3>
            <p>Citizens can verify any project's progress, documents, and payment status in real time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
              <Landmark size={20} />
            </div>
            <h3>Secure Payments</h3>
            <p>Automated milestone-based payments with full audit trails from government to contractor.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ marginTop: '4rem', display: 'flex', gap: '3rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCheck size={16} /> Document Verification
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} /> Role-Based Access
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} /> Admin Approval System
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Landing;
