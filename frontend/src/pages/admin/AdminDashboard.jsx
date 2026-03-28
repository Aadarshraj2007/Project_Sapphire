import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CheckCircle, XCircle, Clock, ShieldCheck,
  Building2, HardHat, Landmark, Plus, RefreshCw, CreditCard,
  UserCheck, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('USERS'); // 'USERS' or 'BANK'
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [showAddBank, setShowAddBank] = useState(false);

  // Form State for new Bank Account
  const [bankForm, setBankForm] = useState({
    userId: '',
    accountNo: '',
    holderName: '',
    balance: 0,
    type: 'GOV'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, bankRes] = await Promise.all([
        API.get('/auth/users'),
        API.get('/bank/all').catch(() => ({ data: { accounts: [] } }))
      ]);
      setUsers(userRes.data);
      setAccounts(bankRes.data.accounts || []);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (userId, approve) => {
    try {
      await API.post('/auth/approve', { userId, approve });
      toast.success(approve ? 'User approved!' : 'User rejected!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Action failed');
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bank/create', bankForm);
      toast.success('Bank account created successfully');
      setShowAddBank(false);
      setBankForm({ userId: '', accountNo: '', holderName: '', balance: 0, type: 'GOV' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to create account');
    }
  };

  const onUserSelect = (uid) => {
    const selected = users.find(u => u.id === uid);
    if (selected) {
      setBankForm({
        ...bankForm,
        userId: selected.id,
        holderName: selected.name,
        type: selected.role === 'GOVERNMENT' ? 'GOV' : 'CONTRACTOR'
      });
    }
  };

  // Logic: Users who don't have a bank account yet
  const eligibleUsers = users.filter(u =>
    u.approved &&
    u.role !== 'SUPREME_ADMIN' &&
    !accounts.some(acc => acc.userId === u.id)
  );

  const filteredUsers = users.filter(u => {
    if (u.role === 'SUPREME_ADMIN') return false;
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return !u.approved;
    if (filter === 'APPROVED') return u.approved;
    return u.role === filter;
  });

  const stats = {
    total: users.filter(u => u.role !== 'SUPREME_ADMIN').length,
    pending: users.filter(u => !u.approved && u.role !== 'SUPREME_ADMIN').length,
    bank: accounts.length,
    gov: users.filter(u => u.role === 'GOVERNMENT').length,
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage users and internal banking systems</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={fetchData}>
              <RefreshCw size={14} /> Sync
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-icon primary"><Users size={22} /></div>
              <div className="stat-info"><h4>{stats.total}</h4><p>Total Users</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon warning"><Clock size={22} /></div>
              <div className="stat-info"><h4>{stats.pending}</h4><p>Pending Apps</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success"><Landmark size={22} /></div>
              <div className="stat-info"><h4>{stats.bank}</h4><p>Bank Accounts</p></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon info"><ShieldCheck size={22} /></div>
              <div className="stat-info"><h4>{stats.gov}</h4><p>Active Officials</p></div>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <button
              onClick={() => setActiveTab('USERS')}
              style={{
                padding: '0.75rem 1.5rem', background: 'none', border: 'none',
                borderBottom: activeTab === 'USERS' ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: activeTab === 'USERS' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'USERS' ? 600 : 400, cursor: 'pointer', transition: '0.2s'
              }}>
              User Management
            </button>
            <button
              onClick={() => setActiveTab('BANK')}
              style={{
                padding: '0.75rem 1.5rem', background: 'none', border: 'none',
                borderBottom: activeTab === 'BANK' ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: activeTab === 'BANK' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'BANK' ? 600 : 400, cursor: 'pointer', transition: '0.2s'
              }}>
              Bank Management
            </button>
          </div>

          {activeTab === 'USERS' ? (
            /* USER MANAGEMENT VIEW */
            <>
              <div className="tabs">
                {['ALL', 'PENDING', 'APPROVED', 'GOVERNMENT', 'CONTRACTOR'].map(f => (
                  <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                    {f === 'ALL' ? 'All' : f === 'PENDING' ? 'Pending' : f === 'APPROVED' ? 'Approved' : f === 'GOVERNMENT' ? 'Gov' : 'Contractor'}
                  </button>
                ))}
              </div>

              {loading ? <Loader /> : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No users found</td></tr>
                      ) : filteredUsers.map(u => (
                        <tr key={u.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div className="avatar-circle">
                                {u.name?.charAt(0)?.toUpperCase()}
                              </div>
                              <span style={{ fontWeight: 500 }}>{u.name}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.email}</td>
                          <td>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                              {u.role === 'GOVERNMENT' ? <Building2 size={14} /> : <HardHat size={14} />}
                              {u.role === 'GOVERNMENT' ? 'Gov' : 'Contractor'}
                            </span>
                          </td>
                          <td><StatusBadge status={u.approved} /></td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              {!u.approved ? (
                                <button className="btn btn-success btn-sm" onClick={() => handleApprove(u.id, true)}>
                                  <CheckCircle size={14} /> Approve
                                </button>
                              ) : (
                                <button className="btn btn-outline btn-sm" onClick={() => handleApprove(u.id, false)}>
                                  Revoke
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            /* BANK MANAGEMENT VIEW */
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem' }}>Internal Bank Accounts</h2>
                <button className="btn btn-primary" onClick={() => setShowAddBank(!showAddBank)}>
                  <Plus size={18} /> Create Account
                </button>
              </div>

              {/* Create Bank Account Form (Expandable) */}
              <AnimatePresence>
                {showAddBank && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-card-static"
                    style={{ marginBottom: '2rem', overflow: 'hidden' }}
                  >
                    <form onSubmit={handleCreateAccount} className="grid grid-2" style={{ gap: '1.5rem' }}>
                      <div className="form-group">
                        <label>Select Approved User</label>
                        <select
                          className="form-input"
                          value={bankForm.userId}
                          onChange={(e) => onUserSelect(e.target.value)}
                          required
                        >
                          <option value="">-- Choose User --</option>
                          {eligibleUsers.map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                          ))}
                        </select>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          Only approved users without an account are listed.
                        </p>
                      </div>

                      <div className="form-group">
                        <label>Account Number</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 100092384"
                          value={bankForm.accountNo}
                          onChange={(e) => setBankForm({ ...bankForm, accountNo: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Holder Name (Auto-fetched)</label>
                        <input
                          type="text"
                          className="form-input"
                          value={bankForm.holderName}
                          disabled
                          style={{ background: 'rgba(255,255,255,0.05)' }}
                        />
                      </div>

                      <div className="form-group">
                        <label>Initial Balance (₹)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={bankForm.balance}
                          onChange={(e) => setBankForm({ ...bankForm, balance: Number(e.target.value) })}
                          required
                        />
                      </div>

                      <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-ghost" onClick={() => setShowAddBank(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create Account</button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {loading ? <Loader /> : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Holder</th>
                        <th>Type</th>
                        <th>Balance</th>
                        <th>Associated User</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No bank accounts found</td></tr>
                      ) : accounts.map(acc => (
                        <tr key={acc.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Landmark size={14} style={{ color: 'var(--color-primary)' }} />
                              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{acc.accountNo}</span>
                            </div>
                          </td>
                          <td style={{ fontWeight: 500 }}>{acc.holderName}</td>
                          <td>
                            <span className={`badge badge-${acc.type === 'GOV' ? 'info' : 'warning'}`}>
                              {acc.type}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                            ₹{acc.balance?.toLocaleString()}
                          </td>
                          <td>
                            <div style={{ fontSize: '0.85rem' }}>
                              <div style={{ fontWeight: 500 }}>{acc.user?.name}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ID: {acc.user?.id?.slice(0, 8)}...</div>
                            </div>
                          </td>
                          <td>
                            <button className="btn btn-outline btn-sm" disabled>Manage</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

        </motion.div>
      </main>

      <style>{`
        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--gradient-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
