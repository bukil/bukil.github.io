
import './App.css';
import Footer from './Footer';
import VisibleSpectrumCanvas from './VisibleSpectrumCanvas';
import ProjectorScene from './ProjectorScene';
import ScrollRail from './ScrollRail';
import ColorPalette from './ColorPalette';

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
        <div className="intro-full" style={{maxWidth: '100vw'}}>
          <p className="intro-text">
            Colour is a surprisingly complex idea. Just when it feels simple, red is red, blue is blue, it slips into something much deeper. At its core, Colour doesn’t really “exist” in the world. Objects don’t carry intrinsic Colour with them. What they do is reflect certain wavelengths of light. Our eyes capture that light, and our brain turns it into the experience we call Colour. In other words, Colour is a construction of perception, not a fixed property of things. This is why Colour is so fascinating, it lives between Physics, Biology, Mathematics and Psychology. When we bring Colour into the digital world, things get even trickier. Computers and screens try to map this messy mix of light and perception into neat systems, RGB, CMYK, Lab, and somehow it all works. The fact that a glowing screen can reproduce even a fraction of what we see in the real world is nothing short of remarkable.
          </p>
          <div className="intro-divider" aria-hidden="true">---</div>
          <div className="intro-meta" style={{marginTop: '1.2rem', textAlign: 'center'}}>
            <div className="intro-meta__name">MUKIL KUMAR</div>
            <div className="intro-meta__org">IDC IIT Bombay</div>
            <div className="intro-meta__date">MM 2026</div>
          </div>
        </div>
      </section>

      

      {/* What is Colour? section with right-side canvas placeholder for animation */}
      <section id="what-is-colour" data-topic="What is Colour?" className="credits-section" aria-labelledby="wic-heading">
        <div className="what-is-content">
          <h2 id="wic-heading" className="credits-title garamond">WHAT IS COLOUR?</h2>
          <p className="intro-text">
            Colour is not an intrinsic property of objects themselves, but a perception created in our brain. When light hits an object, some wavelengths are absorbed and others are reflected. Our eyes capture this reflected light, and the brain transforms it into the experience we call Colour.For example, an apple's skin contains pigments that absorb short waves while reflecting long waves. Our eyes are sensitive to these reflected wavelengths ; they transmit a signal to the brain, which then gets interpreted as the sensation of colour, in this case, red.
          </p>
          <div className="what-is-grid" aria-hidden="true">
            {/* Dense HS color grid similar to provided screenshot */}
            <ColorPalette type="hs" rows={8} cols={22} />
          </div>
        </div>
      </section>

        {/* Types of Color Mixture section (simple, full-width) */}
        <section id="types-of-mixture" className="intro-grid-section" aria-labelledby="types-heading">

          <div className="intro-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="intro-col intro-slot" />
            <div className="intro-col">
              <h2 id="types-heading" className="credits-title garamond">TYPES OF COLOR MIXTURE</h2>
              <p className="intro-text">Additive and subtractive colour mixing are two basic ways of creating colours. Additive colour mixing happens when different coloured lights combine, mainly red, green, and blue (RGB). When these lights overlap, they form new colours. For example, red and green make yellow, and combining all three gives white light. This method is used in digital screens and displays.

Subtractive colour mixing works with pigments, inks, or filters that absorb some wavelengths of light and reflect others, usually using cyan, magenta, and yellow (CMY). When these pigments mix, more light is absorbed, creating darker colours, and mixing all three can make black. This process involves more complex chemistry because it depends on how materials absorb and reflect light at the molecular level.

In this project, we will focus only on additive (light-based) colour mixing and will not discuss subtractive, substance-based mixing.</p>
            </div>
          </div>
  </section>
        
          {/* Physical Models of Color section */}
          <section id="physical-models" className="credits-section" aria-labelledby="physical-heading">
            <h2 id="physical-heading" className="credits-title garamond">PHYSICAL MODELS OF COLOR</h2>
            <div className="physical-spectrum-full">
              <h3 className="credits-title" style={{fontSize: '1.15rem', marginTop: '1.5rem'}}>The Visible Spectrum</h3>
              <p className="intro-text">We can decompose sunlight using a glass prism. This process reveals the individual colour of each wavelength, which are the colors of the rainbow: red, yellow, green, cyan, and blue-violet. This visible spectrum is our first color space; it is a 1-dimensional space that contains all "pure" colors, with each corresponding to a single wavelength. In reality, other waves like infrared and ultraviolet exist on either side of this spectrum, but our eyes cannot detect them.</p>
               <VisibleSpectrumCanvas width={700} height={300} />
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
