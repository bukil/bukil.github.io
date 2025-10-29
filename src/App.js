import ThreeDCanvas from './ThreeDCanvas';
import Blank3DCanvas from './Blank3DCanvas';

import './App.css';
import Footer from './Footer';
import VisibleSpectrumCanvas from './VisibleSpectrumCanvas';
import ConeRodResponseCanvas from './ConeRodResponseCanvas';
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
               <figcaption className="global-caption">Electro magnetic spectrum</figcaption>
               <div className="intro-text" style={{maxWidth: 700, margin: '1.2rem auto 2.2rem auto', fontSize: '14px', textAlign: 'justify', fontWeight: 400, fontFamily: 'NewYork Local, Georgia, Times New Roman, serif'}}>
                 The Sun is always sending energy to Earth in the form of electromagnetic waves. We can only see a small part of these waves — the part we call visible light. Sunlight looks white, but it is actually made of many different colours that our brain mixes together.<br /><br />
                 Our eyes have two kinds of cells that react to light — rods and cones. Rods help us see in dim light or at night, while cones let us see colours when it is bright.<br /><br />
                 There are three types of cone cells, and each one reacts to a different colour of light:<br />
                 <ul style={{marginTop: '0.5rem', marginBottom: '0.5rem', paddingLeft: '1.2em'}}>
                   <li>S-cones: Sensitive to short wavelengths, mostly blue light (around 420 nm).</li>
                   <li>M-cones: Sensitive to medium wavelengths, mostly green light (around 530 nm).</li>
                   <li>L-cones: Sensitive to long wavelengths, mostly red light (around 560 nm).</li>
                 </ul>
                 All three types work together to help us see the full range of colours around us.
               </div>
               <div style={{width: '100%', margin: '0 0 0.5rem 0'}}>
                 <img src={process.env.PUBLIC_URL + '/EYE.png'} alt="Eye diagram" style={{width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'block'}} />
                 <figcaption className="global-caption">Rod and Cone cells in the eye</figcaption>
                 <div className="intro-text" style={{maxWidth: 700, margin: '1.2rem auto 2.2rem auto', fontSize: '14px', textAlign: 'justify', fontWeight: 400, fontFamily: 'NewYork Local, Georgia, Times New Roman, serif'}}>
                   The cones are located deeper within the retina, meaning they need more energy to be activated. Each type of cone also responds differently to various wavelengths of light.
                 </div>
                 <div style={{width: '100%', margin: '0 0 0.5rem 0'}}>
                   {/* Relative response vs wavelength plot */}
                   <ConeRodResponseCanvas width={700} height={260} />
                   <figcaption className="global-caption">Relative response of cones and rods vs wavelength</figcaption>
                 </div>
                 <div className="intro-text" style={{maxWidth: 700, margin: '1.2rem auto 2.2rem auto', fontSize: '14px', textAlign: 'justify', fontWeight: 400, fontFamily: 'NewYork Local, Georgia, Times New Roman, serif'}}>
                   When light hits these cones, it starts a chain of chemical reactions that send signals to the brain, which then interprets them as color. When the wavelengths overlap, two types of cones are activated at once, and we see a mixed color, like purple.<br /><br />
                   However, our eyes don’t respond equally to all wavelengths. They are most sensitive to green light, somewhat less to red, and least to blue.<br /><br />
                   This means that light with the same energy can appear to have different brightness depending on its wavelength. For instance, green light at 555 nm looks brighter than blue light at 450 nm, even if both have equal energy.
                 </div>
                 <h2 className="credits-title garamond" style={{textAlign: 'left', fontSize: '1.35rem', margin: '2.2rem 0 0.8rem 0'}}>COLOR SPACE</h2>
                 <div className="intro-text" style={{width: '100%', maxWidth: '100%', margin: '0 0 2.2rem 0', fontSize: '14px', textAlign: 'justify', fontWeight: 400, fontFamily: 'NewYork Local, Georgia, Times New Roman, serif'}}>
                   A color space is a specific system used to represent and organize colors in a consistent way, so that different devices, like cameras, monitors, and printers can capture, display, and reproduce the same colors accurately.<br /><br />
                   For instance, the RGB color space is used in digital screens, where colors are created by combining red, green, and blue light. On the other hand, printers use the CMYK color space, which mixes cyan, magenta, yellow, and black inks to produce a similar range of colors on paper.
                 </div>
                {/* Blank3DCanvas removed as requested */}
                <div style={{width: '100%', minHeight: '340px', background: '#f8f8fa', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.2rem'}}>
                  <ThreeDCanvas width={800} height={340} />
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
