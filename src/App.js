
import './App.css';

function App() {
  return (
    <div className="App">
      <h3 className="hero-title garamond">Geometry of color</h3>
      <section className="credits-section" aria-labelledby="credits-heading">
        <h2 id="credits-heading" className="credits-title garamond">Contributions and Credits</h2>
        <div className="credits-divider" aria-hidden="true" />
        <ul className="credits-list" aria-label="Contributor list">
          <li><a href="#" rel="noopener noreferrer">This project was carried out as part of Project 2 at IDC, IIT Bombay, under the guidance of Professor Girish Dalvi.</a></li>
          <li><a href="#" rel="noopener noreferrer">A. Rao – Data Geometry</a></li>
          <li><a href="#" rel="noopener noreferrer">L. Chen – Spectral Models</a></li>
          <li><a href="#" rel="noopener noreferrer">S. Patel – Interaction Design</a></li>
          <li><a href="#" rel="noopener noreferrer">J. Singh – Visualization Engine</a></li>
        </ul>
      </section>
      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner">
          <p className="credit">Research, design & development by <span className="name">Mukil</span>.</p>
          <div className="cc-license" aria-label="Creative Commons Attribution 4.0 International License">
            <span className="cc-icons" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="9" stroke="#555" strokeWidth="2"/>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize="9" fontFamily="Helvetica,Arial,sans-serif" fill="#555">CC</text>
              </svg>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="9" stroke="#555" strokeWidth="2"/>
                <path d="M10 5.4a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2Zm0 5.3c2.26 0 4.1 1.84 4.1 4.1v.4H5.9v-.4c0-2.26 1.84-4.1 4.1-4.1Z" fill="#555"/>
              </svg>
              <span className="cc-text">BY 4.0</span>
            </span>
            <span className="license-text">This work is licensed under a <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">Creative Commons Attribution 4.0 International License</a>.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
