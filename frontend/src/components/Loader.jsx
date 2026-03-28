const Loader = ({ text = 'Loading...' }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1rem',
    gap: '1rem',
  }}>
    <div className="spinner" />
    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text}</p>
  </div>
);

export default Loader;
