
import './App.css';
import Footer from './Footer';
import ProjectorScene from './ProjectorScene';
import ScrollRail from './ScrollRail';

function App() {
  return (
    <div className="App">
  <h3 id="hero" data-topic="XXXXXXXXX of color" className="hero-title playfair">Space of color</h3>
      <div id="intro" className="three-intro full-bleed" aria-label="3D introduction scene">
        <ProjectorScene />
      </div>

      {/* Introduction section in a 3-column horizontal grid */}
      <section id="introduction" data-topic="Introduction" className="intro-grid-section" aria-labelledby="intro-heading">
        <h2 id="intro-heading" className="visually-hidden">Introduction</h2>
        <div className="intro-grid">
          <div className="intro-col">
            <p className="intro-text">
              Colour is a surprisingly complex idea. Just when it feels simple, red is red, blue is blue, it slips into something much deeper.

At its core, Colour doesn’t really “exist” in the world. Objects don’t carry intrinsic Colour with them. What they do is reflect certain wavelengths of light. Our eyes capture that light, and our brain turns it into the experience we call Colour. In other words, Colour is a construction of perception, not a fixed property of things.

This is why Colour is so fascinating, it lives between Physics, Biology, Mathematics and Psychology.

When we bring Colour into the digital world, things get even trickier. Computers and screens try to map this messy mix of light and perception into neat systems—RGB, CMYK, Lab, and somehow it all works. The fact that a glowing screen can reproduce even a fraction of what we see in the real world is nothing short of remarkable. </p>
          </div>
          <div className="intro-col intro-slot" aria-hidden="true" />
          <div className="intro-col">
            <div className="intro-meta" aria-label="Author and date">
              <div className="intro-meta__name">Mukil Kumar</div>
              <div className="intro-meta__org">IDC IIT Bombay</div>
              <div className="intro-meta__date">MM 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Colour? section with right-side canvas placeholder for animation */}
      <section id="what-is-colour" data-topic="What is Colour?" className="credits-section" aria-labelledby="wic-heading">
        <div className="box-line">
          <div className="box-line-grid">
            <div className="box-col box-col--left">
              <h2 id="wic-heading" className="credits-title garamond">WHAT IS COLOUR?</h2>
              <p className="intro-text">
                Colour is not an intrinsic property of objects themselves, but a perception created in our brain. When light hits an object, some wavelengths are absorbed and others are reflected. Our eyes capture this reflected light, and the brain transforms it into the experience we call Colour.
              </p>
            </div>
            <div className="box-col box-col--right" aria-hidden="false">
              <canvas className="anim-canvas" aria-label="Animation canvas" />
            </div>
          </div>
        </div>
      </section>

  <section id="references" data-topic="References" className="credits-section" aria-labelledby="references-heading">
        <h2 id="references-heading" className="credits-title garamond">REFERENCES</h2>
        <div className="credits-divider" aria-hidden="true" />
        <ul className="credits-list" aria-label="Contributor list">
          <li><span className="contrib-item">[1] </span></li>
          <li><span className="contrib-item">[2]</span></li>
          <li><span className="contrib-item">[3]</span></li>
          <li><span className="contrib-item">[4]</span></li>
        </ul>
      </section>

  <section id="footnotes" data-topic="Footnotes" className="credits-section" aria-labelledby="footnotes-heading">
        <h2 id="footnotes-heading" className="credits-title garamond">FOOTNOTES</h2>
        <div className="credits-divider" aria-hidden="true" />
        <ul className="credits-list" aria-label="Contributor list">
          <li><span className="contrib-item single-line">This project was carried out as part of Project 2 at IDC, IIT Bombay, under the guidance of <a className="prof-link" href="https://www.idc.iitb.ac.in/people/phd/girish-vinod-dalvi" target="_blank" rel="noopener noreferrer">Professor Girish Dalvi.</a></span></li>
          <li><span className="contrib-item">xxxxxx – Data Geometry</span></li>
          <li><span className="contrib-item">xxxxxx – Spectral Models</span></li>
          <li><span className="contrib-item">xxxxxx – Interaction Design</span></li>
          <li><span className="contrib-item">xxxxxx – Visualization Engine</span></li>
        </ul>
      </section>
          
  <section id="credits" data-topic="Contributions and Credits" className="credits-section" aria-labelledby="credits-heading">
        <h2 id="credits-heading" className="credits-title garamond">Contributions and Credits</h2>
        <div className="credits-divider" aria-hidden="true" />
        <ul className="credits-list" aria-label="Contributor list">
          <li><span className="contrib-item single-line">This project was carried out as part of Project 2 at IDC, IIT Bombay, under the guidance of <a className="prof-link" href="https://www.idc.iitb.ac.in/people/phd/girish-vinod-dalvi" target="_blank" rel="noopener noreferrer">Professor Girish Dalvi.</a></span></li>
          <li><span className="contrib-item single-line">Data Geometry <a className="prof-link" href="https://in.linkedin.com/in/sumant-rao-a5aaa042" target="_blank" rel="noopener noreferrer">Professor Sumant Rao.</a></span></li>
          <li><span className="contrib-item">xxxxxx – </span></li>
          <li><span className="contrib-item">xxxxxx – </span></li>
          <li><span className="contrib-item">xxxxxx – </span></li>
        </ul>
      </section>
  <Footer />

  {/* Right-edge hover-to-reveal scroll rail (auto-discovers topics via [data-topic]) */}
  <ScrollRail />
    </div>
  );
}

export default App;
