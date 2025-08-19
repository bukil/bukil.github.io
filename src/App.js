
import './App.css';

function App() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh', textAlign: 'center', fontFamily: 'monospace' }}>
      <div style={{ marginTop: '40px' }}>
        <h1 style={{ fontWeight: 'bold', fontSize: '2.5em', marginBottom: '0.2em' }}>
          This is 6502 Cat, Worship this cat.
        </h1>
        <div style={{ fontWeight: 'bold', fontSize: '1.5em', marginBottom: '1em' }}>
          THE 6502 CAT.
        </div>
        <img src="/god_cat.jpg" alt="6502 Cat" style={{ marginTop: '20px', border: '2px solid #000', maxWidth: '300px', width: '80%', height: 'auto' }} />
      </div>
      <marquee><h1>=== THE GOD CAT - AFDOB ===</h1></marquee>
    </div>

  );
}

export default App;
