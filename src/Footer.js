import React from 'react';
import './App.css';

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <p className="credit">Research, design & development by <span className="name">Mukil Kumar</span>.</p>
        <div className="cc-license" aria-label="Creative Commons Attribution 4.0 International License">
          <img src="/idc.png" alt="IDC IIT Bombay" className="idc-logo" />
          <img src="/by.png" alt="CC BY 4.0" className="cc-by-icon" />
          <span className="license-text">
            <a href="https://bukil.github.io/">Colour IDC IITB</a> © 2025 by <a href="https://www.linkedin.com/in/mukilk/">Mukil Kumar</a> is licensed under <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a>
            <img src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="" style={{maxWidth:'1em',maxHeight:'1em',marginLeft:'.2em',verticalAlign:'middle'}} />
            <img src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="" style={{maxWidth:'1em',maxHeight:'1em',marginLeft:'.2em',verticalAlign:'middle'}} />
          </span>
        </div>
      </div>
    </footer>
  );
}
