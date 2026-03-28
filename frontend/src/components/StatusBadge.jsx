const statusConfig = {
  // Milestone statuses
  PENDING: { className: 'badge-pending', label: 'Pending' },
  SUBMITTED: { className: 'badge-warning', label: 'Submitted' },
  VERIFIED: { className: 'badge-success', label: 'Verified' },
  REJECTED: { className: 'badge-danger', label: 'Rejected' },
  PAID: { className: 'badge-info', label: 'Paid' },
  // Verification statuses
  APPROVED: { className: 'badge-success', label: 'Approved' },
  // Project statuses
  ACTIVE: { className: 'badge-success', label: 'Active' },
  COMPLETED: { className: 'badge-info', label: 'Completed' },
  CANCELLED: { className: 'badge-danger', label: 'Cancelled' },
  // Site inspection
  PASSED: { className: 'badge-success', label: 'Passed' },
  FAILED: { className: 'badge-danger', label: 'Failed' },
  // Blockchain
  TAMPERED: { className: 'badge-danger', label: 'Tampered' },
  NOT_STORED: { className: 'badge-warning', label: 'Not Stored' },
  // Approval
  true: { className: 'badge-success', label: 'Approved' },
  false: { className: 'badge-warning', label: 'Pending' },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[String(status)] || { className: 'badge-pending', label: status };
  return <span className={`badge ${config.className}`}>{config.label}</span>;
};

export default StatusBadge;
