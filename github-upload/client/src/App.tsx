function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      background: 'linear-gradient(135deg, #1a0f29 0%, #2d1f3d 50%, #1a0f29 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Opictuary</h1>
      <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '0.5rem' }}>Digital Memorials Platform</p>
      <p style={{ opacity: 0.7 }}>Honor and preserve the memory of your loved ones</p>
    </div>
  );
}

export default App;
