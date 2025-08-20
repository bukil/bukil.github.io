import React from 'react';
import './App.css';

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <p className="credit">Research, design & development by <span className="name">Mukil Kumar</span>.</p>
        <div className="cc-license" aria-label="Creative Commons Attribution 4.0 International License">
          <img src="/idc.png" alt="IDC IIT Bombay" style={{width:'160px',height:'auto',display:'block'}} />
          <img src="/by.png" alt="CC BY 4.0" className="cc-by-icon" />
          <span className="license-text">
            <a href="https://creativecommons.org">Color IDC IITB</a> © 2025 by <a href="https://creativecommons.org">Mukil Kumar</a> is licensed under <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
