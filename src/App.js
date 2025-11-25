
import './App.css';
import { useState } from 'react';
import Footer from './Footer';
import VisibleSpectrumCanvas from './VisibleSpectrumCanvas';
import ConeRodResponseCanvas from './ConeRodResponseCanvas';
import ProjectorScene from './ProjectorScene';
import ScrollRail from './ScrollRail';
import MunsellColorSpace3D from './MunsellColorSpace3D';
import ColorPalette from './ColorPalette';
import RGBColorSpace3D from './RGBColorSpace3D';
import HSVColorSpace3D from './HSVColorSpace3D';
import CIELABColorSpace3D from './CIELABColorSpace3D';
import ColorMixer from './ColorMixer';
import GamutDiagram from './GamutDiagram';

function App() {
  const [hueDeg, setHueDeg] = useState(0);
  const [ballHeight, setBallHeight] = useState(1);
  const [radiusPct, setRadiusPct] = useState(100);
  // independent controls for the duplicated second HSV canvas
  const [hueDeg2, setHueDeg2] = useState(0);
  const [ballHeight2] = useState(1);
  const [radiusPct2] = useState(100);
  // independent controls for the duplicated third HSV canvas
  const [hueDeg3, setHueDeg3] = useState(0);
  const [ballHeight3, setBallHeight3] = useState(1);
  const [radiusPct3, setRadiusPct3] = useState(100);
  return (
    <div className="App">
      <h3 id="hero" data-topic="XXXXXXXXX of color" className="hero-title playfair">Space of color</h3>
      <div id="intro" className="three-intro full-bleed" aria-label="3D introduction scene">
        <ProjectorScene />
      </div>

      {/* Introduction section in a 3-column horizontal grid */}
      <section id="introduction" data-topic="Introduction" className="intro-grid-section" aria-labelledby="intro-heading">
        <h2 id="intro-heading" className="visually-hidden">Introduction</h2>
        <div className="intro-full" style={{ maxWidth: '100vw' }}>
          <p className="intro-text">
            Colour is a surprisingly complex idea. Just when it feels simple, red is red, blue is blue, it slips into something much deeper. At its core, Colour doesn’t really “exist” in the world. Objects don’t carry intrinsic Colour with them. What they do is reflect certain wavelengths of light. Our eyes capture that light, and our brain turns it into the experience we call Colour. In other words, Colour is a construction of perception, not a fixed property of things. This is why Colour is so fascinating, it lives between Physics, Biology, Mathematics and Psychology. When we bring Colour into the digital world, things get even trickier. Computers and screens try to map this messy mix of light and perception into neat systems, RGB, CMYK, Lab, and somehow it all works. The fact that a glowing screen can reproduce even a fraction of what we see in the real world is nothing short of remarkable.
          </p>
          <div className="intro-divider" aria-hidden="true">---</div>
          <div className="intro-meta" style={{ marginTop: '1.2rem', textAlign: 'center' }}>
            <div className="intro-meta__name">MUKIL KUMAR</div>
            <div className="intro-meta__org">IDC IIT Bombay</div>
            <div className="intro-meta__date">MM 2026</div>
          </div>
        </div>
      </section>

      {/* CIELAB section moved to end as requested */}



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
          {/* Left column now hosts the interactive mixer */}
          <div className="intro-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <ColorMixer />
          </div>
          {/* Right column retains heading and explanatory text */}
          <div className="intro-col">
            <h2 id="types-heading" className="credits-title garamond">TYPES OF COLOR MIXTURE</h2>
            <p className="intro-text">Additive and subtractive colour mixing are two basic ways of creating colours. Additive colour mixing happens when different coloured lights combine, mainly red, green, and blue (RGB). When these lights overlap, they form new colours. For example, red and green make yellow, and combining all three gives white light. This method is used in digital screens and displays.<br /><br />
              Subtractive colour mixing works with pigments, inks, or filters that absorb some wavelengths of light and reflect others, usually using cyan, magenta, and yellow (CMY). When these pigments mix, more light is absorbed, creating darker colours, and mixing all three can make black. This process involves more complex chemistry because it depends on how materials absorb and reflect light at the molecular level.<br /><br />
              In this project, we will focus only on additive (light-based) colour mixing and will not discuss subtractive, substance-based mixing.</p>
          </div>
        </div>
      </section>

      {/* Physical Models of Color section */}
      <section id="physical-models" className="credits-section" aria-labelledby="physical-heading">
        <h2 id="physical-heading" className="credits-title garamond">PHYSICAL MODELS OF COLOR</h2>
        <div className="physical-spectrum-full">
          <h3 className="credits-title" style={{ fontSize: '1.15rem', marginTop: '1.5rem', textAlign: 'left' }}>The Visible Spectrum</h3>
          <p className="intro-text">We can decompose sunlight using a glass prism. This process reveals the individual colour of each wavelength, which are the colors of the rainbow: red, yellow, green, cyan, and blue-violet. This visible spectrum is our first color space; it is a 1-dimensional space that contains all "pure" colors, with each corresponding to a single wavelength. In reality, other waves like infrared and ultraviolet exist on either side of this spectrum, but our eyes cannot detect them.</p>
          <VisibleSpectrumCanvas width={700} height={300} />
          <figcaption className="global-caption">Electro magnetic spectrum</figcaption>
          <div className="intro-text" style={{ maxWidth: 700, margin: '1.2rem auto 2.2rem auto', fontSize: '14px', textAlign: 'justify', fontWeight: 400, fontFamily: 'NewYork Local, Georgia, Times New Roman, serif' }}>
            The Sun is always sending energy to Earth in the form of electromagnetic waves. We can only see a small part of these waves — the part we call visible light. Sunlight looks white, but it is actually made of many different colours that our brain mixes together.<br /><br />
            Our eyes have two kinds of cells that react to light — rods and cones. Rods help us see in dim light or at night, while cones let us see colours when it is bright.<br /><br />
            There are three types of cone cells, and each one reacts to a different colour of light:<br />
            <ul style={{ marginTop: '0.5rem', marginBottom: '0.5rem', paddingLeft: '1.2em' }}>
              <li>S-cones: Sensitive to short wavelengths, mostly blue light (around 420 nm).</li>
              <li>M-cones: Sensitive to medium wavelengths, mostly green light (around 530 nm).</li>
              <li>L-cones: Sensitive to long wavelengths, mostly red light (around 560 nm).</li>
            </ul>
            All three types work together to help us see the full range of colours around us.
          </div>
          <div style={{ width: '100%', margin: '0 0 0.5rem 0' }}>
            <img src={process.env.PUBLIC_URL + '/EYE.png'} alt="Eye diagram" style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'block' }} />
            <figcaption className="global-caption">Rod and Cone cells in the eye</figcaption>
            <div className="intro-text" style={{ maxWidth: 700, margin: '1.2rem auto 2.2rem auto', fontSize: '14px', textAlign: 'justify', fontWeight: 400, fontFamily: 'NewYork Local, Georgia, Times New Roman, serif' }}>
              The cones are located deeper within the retina, meaning they need more energy to be activated. Each type of cone also responds differently to various wavelengths of light.
            </div>
            <div style={{ width: '100%', margin: '0 0 0.5rem 0' }}>
              {/* Relative response vs wavelength plot */}
              <ConeRodResponseCanvas width={700} height={260} />
              <figcaption className="global-caption">Relative response of cones and rods vs wavelength</figcaption>
            </div>
            <div className="intro-text" style={{ maxWidth: 700, margin: '1.2rem auto 2.2rem auto', fontSize: '14px', textAlign: 'justify', fontWeight: 400, fontFamily: 'NewYork Local, Georgia, Times New Roman, serif' }}>
              When light hits these cones, it starts a chain of chemical reactions that send signals to the brain, which then interprets them as color. When the wavelengths overlap, two types of cones are activated at once, and we see a mixed color, like purple.<br /><br />
              However, our eyes don’t respond equally to all wavelengths. They are most sensitive to green light, somewhat less to red, and least to blue.<br /><br />
              This means that light with the same energy can appear to have different brightness depending on its wavelength. For instance, green light at 555 nm looks brighter than blue light at 450 nm, even if both have equal energy.
            </div>
            <h2 className="credits-title garamond" style={{ textAlign: 'left', fontSize: '1.35rem', margin: '2.2rem 0 0.8rem 0' }}>COLOR SPACE</h2>
            <div className="intro-text" style={{ width: '100%', maxWidth: '100%', margin: '0 0 2.2rem 0', fontSize: '14px', textAlign: 'justify', fontWeight: 400, fontFamily: 'NewYork Local, Georgia, Times New Roman, serif' }}>
              A color space is a specific system used to represent and organize colors in a consistent way, so that different devices, like cameras, monitors, and printers can capture, display, and reproduce the same colors accurately.<br /><br />
              For instance, the RGB color space is used in digital screens, where colors are created by combining red, green, and blue light. On the other hand, printers use the CMYK color space, which mixes cyan, magenta, yellow, and black inks to produce a similar range of colors on paper.
            </div>
            {/* Colorpicker PNG grid row */}
            <div className="colorpicker-image-row" style={{ width: '100%', margin: '2.2rem 0', display: 'flex', justifyContent: 'center', gap: '2rem', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', alignItems: 'center', padding: '1rem 0' }}>
              <img src={process.env.PUBLIC_URL + '/colorpicker.png'} alt="Color Picker 1" style={{ width: '220px', height: '220px', objectFit: 'contain', borderRadius: '12px' }} />
              <img src={process.env.PUBLIC_URL + '/colorpicker2.png'} alt="Color Picker 2" style={{ width: '220px', height: '220px', objectFit: 'contain', borderRadius: '12px' }} />
              <img src={process.env.PUBLIC_URL + '/colorpicker3.png'} alt="Color Picker 3" style={{ width: '220px', height: '220px', objectFit: 'contain', borderRadius: '12px' }} />
            </div>
            {/* Move RGB Color Space here, directly after the three images row */}
            <h3 className="credits-title" style={{ fontSize: '1.15rem', marginTop: '1.5rem', fontFamily: 'NewYork Web, Georgia, Times New Roman, serif' }}>RGB Color Space</h3>
            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2.2rem', alignItems: 'start', margin: '2.2rem 0' }}>
              <div style={{ width: '400px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RGBColorSpace3D />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <div className="intro-text" style={{ fontSize: '15px', color: '#222', fontFamily: 'NewYork Local, Georgia, Times New Roman, serif', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                  The RGB color space is a three-dimensional cube where each axis represents one of the primary colors: Red, Green, and Blue. Every point inside the cube corresponds to a unique color created by mixing different intensities of these three components. The origin (0,0,0) is black, while the far corner (1,1,1) is white. Pure red, green, and blue are found at the ends of their respective axes. This space is fundamental to digital screens and imaging, as it models how colors are generated by light.
                </div>
                <ul style={{ fontSize: '14px', color: '#444', marginLeft: '1.2em' }}>
                  <li><b>Red axis :</b> Controls the intensity of red.</li>
                  <li><b>Green axis :</b> Controls the intensity of green.</li>
                  <li><b>Blue axis :</b> Controls the intensity of blue.</li>
                </ul>
                {/* small sample text removed as requested */}
              </div>
            </div>
            {/* RGB Color Space block inserted above the HSV section */}

            <div className="intro-text" style={{ width: '100%', maxWidth: '100%', margin: '0 0 2.2rem 0', fontSize: '14px', textAlign: 'justify', fontWeight: 400, fontFamily: 'NewYork Local, Georgia, Times New Roman, serif' }}>
              <p style={{ marginTop: '0.5rem' }}>
                The RGB color space is a way of representing colors using three basic components , Red (R), Green (G), and Blue (B). These three colors of light can be mixed in different amounts to create almost every color you see on a digital screen.
              </p>
              <p style={{ marginTop: '0.25rem' }}>
                • When all three are at full intensity, you get white light.<br />
                • When all three are off, you get black.<br />
                • Mixing two of them gives new colors , for example:
              </p>
              <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                <table style={{ margin: '0 auto', fontSize: '13px', borderCollapse: 'collapse', minWidth: 220 }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '4px 12px 4px 0', textAlign: 'right', color: '#222' }}>Red + Green</td>
                      <td style={{ padding: '4px 0 4px 12px', borderLeft: '1px solid #ddd', textAlign: 'left', color: '#222' }}>Yellow</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 12px 4px 0', textAlign: 'right', color: '#222' }}>Red + Blue</td>
                      <td style={{ padding: '4px 0 4px 12px', borderLeft: '1px solid #ddd', textAlign: 'left', color: '#222' }}>Magenta</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 12px 4px 0', textAlign: 'right', color: '#222' }}>Green + Blue</td>
                      <td style={{ padding: '4px 0 4px 12px', borderLeft: '1px solid #ddd', textAlign: 'left', color: '#222' }}>Cyan</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ marginTop: '0.5rem' }}>
                This system is called additive color mixing, because the more light you add, the brighter the color becomes. It’s used in computer monitors, TVs, phone screens, and cameras, where light is emitted directly from the screen.
              </p>

              <div className="intro-text" style={{ width: '100%', maxWidth: '100%', margin: '0 0 2.2rem 0', fontSize: '14px', textAlign: 'justify', fontWeight: 400, fontFamily: 'NewYork Local, Georgia, Times New Roman, serif' }}>
                <p style={{ marginTop: '0.5rem', fontWeight: 700 }}>Why Colors Use the 0–255 Range</p>
                <p style={{ marginTop: '0.25rem' }}>
                  Each color channel  Red, Green, and Blue   is stored as a number between 0 and 255.
                  This comes from how computers store data:
                </p>

                <p style={{ marginTop: '0.25rem' }}>8 bits (1 byte) can represent 256 possible values (from 0 to 255). So, each color channel uses one byte of memory.</p>


                <p style={{ marginTop: '0.25rem' }}>This means:</p>
                <div style={{ marginTop: '0.25rem', textAlign: 'center' }}>
                  <table style={{ margin: '0 auto', fontSize: '13px', borderCollapse: 'collapse', minWidth: 300 }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '4px 12px 4px 0', textAlign: 'right', color: '#222' }}>(0, 0, 0)</td>
                        <td style={{ padding: '4px 0 4px 12px', borderLeft: '1px solid #ddd', textAlign: 'left', color: '#222' }}>Black (no light)</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px 12px 4px 0', textAlign: 'right', color: '#222' }}>(255, 255, 255)</td>
                        <td style={{ padding: '4px 0 4px 12px', borderLeft: '1px solid #ddd', textAlign: 'left', color: '#222' }}>White (full light)</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px 12px 4px 0', textAlign: 'right', color: '#222' }}>(255, 0, 0)</td>
                        <td style={{ padding: '4px 0 4px 12px', borderLeft: '1px solid #ddd', textAlign: 'left', color: '#222' }}>Red</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px 12px 4px 0', textAlign: 'right', color: '#222' }}>(0, 255, 0)</td>
                        <td style={{ padding: '4px 0 4px 12px', borderLeft: '1px solid #ddd', textAlign: 'left', color: '#222' }}>Green</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '4px 12px 4px 0', textAlign: 'right', color: '#222' }}>(0, 0, 255)</td>
                        <td style={{ padding: '4px 0 4px 12px', borderLeft: '1px solid #ddd', textAlign: 'left', color: '#222' }}>Blue</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p style={{ marginTop: '0.25rem' }}>By changing these numbers, your screen creates millions of color combinations.</p>
              </div>
            </div>
            <h3 className="credits-title" style={{ fontSize: '1.15rem', marginTop: '1.5rem', fontFamily: 'NewYork Web, Georgia, Times New Roman, serif' }}>HSV Color Space</h3>
            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2.2rem', alignItems: 'start', margin: '2.2rem 0' }}>
              <div style={{ width: '400px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <HSVColorSpace3D hueDeg={hueDeg} ballHeight={ballHeight} radiusPct={radiusPct} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <div className="intro-text" style={{ fontSize: '15px', color: '#222', fontFamily: 'NewYork Local, Georgia, Times New Roman, serif', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                  The HSV color space is represented as a cylinder, where colors are organized by Hue (angle around the cylinder), Saturation (distance from the center), and Value (height). This model is intuitive for artists and designers, as it separates color intensity from color type. The top of the cylinder is bright, the bottom is dark, and the center is gray.
                </div>
                <ul style={{ fontSize: '14px', color: '#444', marginLeft: '1.2em' }}>
                  <li><b>Hue:</b> The type of color, represented by the angle around the cylinder.</li>
                  <li><b>Saturation:</b> The intensity or purity of the color, represented by the radius.</li>
                  <li><b>Value:</b> The brightness, represented by the height.</li>
                </ul>
                {/* Controls: placed to the right of the canvas */}
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.2rem' }}>
                    <label style={{ width: 56, textAlign: 'right' }}>Hue</label>
                    <input className="hue-range" type="range" min={0} max={360} value={hueDeg} onChange={e => setHueDeg(Number(e.target.value))} style={{ width: 220 }} />
                    <div style={{ width: 60 }}>{Math.round(hueDeg)}°</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <label style={{ width: 56, textAlign: 'right' }}>Value</label>
                    <input className="value-range" type="range" min={0} max={100} value={Math.round(ballHeight * 100)} onChange={e => setBallHeight(Number(e.target.value) / 100)} style={{ width: 220, '--hue': hueDeg }} />
                    <div style={{ width: 48 }}>{Math.round(ballHeight * 100)}%</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <label style={{ width: 56, textAlign: 'right' }}>Saturation</label>
                    <input className="sat-range" type="range" min={0} max={100} value={Math.round(radiusPct)} onChange={e => setRadiusPct(Number(e.target.value))} style={{ width: 220, '--hue': hueDeg }} />
                    <div style={{ width: 48 }}>{Math.round(radiusPct)}%</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Full-width hue explanation placed below the controls with gap */}
            <div style={{ width: '100%', marginTop: '1.8rem' }}>
              <h4 className="credits-title" style={{ fontSize: '1rem', margin: 0, fontFamily: 'NewYork Web, Georgia, Times New Roman, serif', textAlign: 'left' }}>Hue in HSV</h4>
              <div className="intro-text" style={{ fontSize: '14px', color: '#444', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Hue describes the base colour and is encoded as an angle around the cylinder (0°–360°). As you move the hue, you rotate around the circle while keeping Value (height/brightness) and Saturation (radius/purity) fixed. Typical anchors are 0° red, 60° yellow, 120° green, 180° cyan, 240° blue, and 300° magenta, wrapping back to red at 360°.
              </div>
            </div>
            {/* Duplicate of the above interactive HSV block (canvas only - text removed) */}
            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2.2rem', alignItems: 'start', margin: '2.2rem 0' }}>
              <div style={{ width: '400px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HSVColorSpace3D hueDeg={hueDeg2} ballHeight={ballHeight2} radiusPct={radiusPct2} markerType="plane" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <div style={{ marginTop: '3.6rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '2.5rem' }}>
                    <label style={{ width: 56, textAlign: 'right' }}>Hue</label>
                    <input className="hue-range" type="range" min={0} max={360} value={hueDeg2} onChange={e => setHueDeg2(Number(e.target.value))} style={{ width: 220 }} />
                    <div style={{ width: 48 }}>{Math.round(hueDeg2)}°</div>
                  </div>
                  {/* Height and Radius controls removed for the second (plane) HSV preview */}
                </div>
              </div>
            </div>
            {/* Full-width Value explanation placed above the third block */}
            <div style={{ width: '100%', marginTop: '1.8rem' }}>
              <h4 className="credits-title" style={{ fontSize: '1rem', margin: 0, fontFamily: 'NewYork Web, Georgia, Times New Roman, serif', textAlign: 'left' }}>Value in HSV</h4>
              <div className="intro-text" style={{ fontSize: '14px', color: '#444', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Value sets how much light the colour carries. In the cylinder it is the vertical axis: bottom is 0% (black), top is 100% (maximum brightness). Raising Value lifts a horizontal slice: the circular preview below the slider shows all Hue–Saturation combinations at that height, fading darker when lowered.
              </div>
            </div>
            {/* Duplicate of the above interactive HSV block (3rd copy) */}
            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2.2rem', alignItems: 'start', margin: '2.2rem 0' }}>
              <div style={{ width: '400px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ width: '400px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HSVColorSpace3D
                    hueDeg={hueDeg3}
                    ballHeight={ballHeight3}
                    radiusPct={radiusPct3}
                    markerType="circle"
                    onHueChange={setHueDeg3}
                    onRadiusChange={setRadiusPct3}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <label style={{ width: 56, textAlign: 'right' }}>Value</label>
                    <div className="value-host" style={{ position: 'relative', width: 220 }}>
                      <input className="value-range" type="range" min={0} max={100} value={Math.round(ballHeight3 * 100)} onChange={e => setBallHeight3(Number(e.target.value) / 100)} style={{ width: '100%', '--hue': hueDeg3 }} />
                    </div>
                    <div style={{ width: 48 }}>{Math.round(ballHeight3 * 100)}%</div>
                  </div>
                  {/* Radius control removed for the third (circle) HSV preview */}
                </div>
              </div>
            </div>
            <figcaption className="global-caption" style={{ textAlign: 'center', fontSize: '1rem', marginTop: '0.8rem', color: '#444' }}>HSV Colour space as colour picker</figcaption>
          </div>
        </div>
      </section>

      <section id="color-space" data-topic="Color Space" className="credits-section" aria-labelledby="color-space-heading">
        <h2 id="color-space-heading" className="credits-title garamond">Munsell Colour Space</h2>
        <div className="intro-text" style={{ fontSize: '14px', color: '#444', marginTop: '0.6rem', lineHeight: 1.6, width: '100%', maxWidth: '100%' }}>
          The Munsell color system is a way to describe colors using three clear qualities: hue, value, and chroma. Hue tells you the basic color family, value shows how light or dark the color is, and chroma tells how strong or dull the color looks. It is arranged like a three-dimensional space so each quality can change on its own. The system is based on how people actually see color, so it stays consistent, practical, and easy to compare across different uses.
        </div>
        <div style={{ width: '100%', marginTop: '1.6rem' }}>
          <MunsellColorSpace3D />
        </div>
        <div className="intro-text" style={{ fontSize: '14px', color: '#444', marginTop: '1.4rem', lineHeight: 1.6, width: '100%', maxWidth: '100%' }}>
          The Munsell system has a distorted shape because human color vision is not evenly spaced. Our eyes notice some color changes more easily than others, so the space must stretch or squeeze to match how we actually see.
          For example, we can see many small differences in green, so the green region expands. We see fewer differences in blue and yellow, so those regions become tighter. Chroma also does not increase equally for every hue, which bends the outer shape even more.
          The result is a color space that looks uneven, but the unevenness is the point. It reflects the natural limits and sensitivities of human perception rather than forcing colors into a perfect geometric form.
        </div>
      </section>

      <section id="cielab-space" data-topic="CIELAB Color Space" className="credits-section" aria-labelledby="cielab-heading" style={{ marginTop: '3.2rem' }}>
        <h2 id="cielab-heading" className="credits-title garamond">CIELAB Colour Space</h2>
        {/* Two-column layout: left explanatory text, right 3D model canvas */}
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2.2rem', alignItems: 'start', marginTop: '1.2rem' }}>
          <div style={{ maxWidth: '400px' }}>
            <div className="intro-text" style={{ fontSize: '14px', color: '#444', lineHeight: 1.6 }}>
              CIELAB represents colour using three axes: L* (lightness), a* (green ↔ red), and b* (blue ↔ yellow). Neutral greys sit along the L* axis, while chromatic colours extend outward along a* and b*. Its design aims for perceptual uniformity: equal numeric shifts try to feel like equal visual shifts, making it practical for assessing colour differences (ΔE) in industries like printing, textiles, and packaging.
              <br /><br />
              <b>What does CIELAB stand for?</b><br />
              CIE is the International Commission on Illumination (Commission Internationale de l'Éclairage). LAB denotes the three coordinates. Plotting a colour places it at a point where lightness sets height, and a* / b* define its chromatic direction and distance from the neutral axis.
            </div>
          </div>
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '500px', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CIELABColorSpace3D />
            </div>
          </div>
        </div>
      </section>

      <section id="new-colour" data-topic="New Colour !" className="credits-section" aria-labelledby="new-colour-heading">
        <h2 id="new-colour-heading" className="credits-title garamond">New Colour !</h2>
        <div className="intro-text" style={{ fontSize: '14px', color: '#444', marginTop: '0.6rem', lineHeight: 1.6, width: '100%', maxWidth: '100%' }}>
          Recent advancements in vision science, specifically using Adaptive Optics Scanning Laser Ophthalmoscopy (AO-SLO), have allowed researchers to bypass the eye's natural optics and stimulate individual cone photoreceptors directly. This precise stimulation has revealed the "Olo effect" (referring to the AO-SLO phenomenon), where activating single cones can trigger sensations of "novel colors" that do not exist in standard color spaces or natural viewing conditions.
          <br /><br />
          Unlike the mixture of signals we usually perceive, these isolated signals can produce intense, pure color sensations—such as a "white" from a single red cone or colors that defy the traditional opponent-process theory. This research suggests that our brain's color processing is even more complex and plastic than previously thought, opening the door to experiencing colors that lie outside the limits of the visible spectrum and current display technologies.
        </div>
      </section>

      <section id="srgb-space" data-topic="SRGB Color Space" className="credits-section" aria-labelledby="srgb-heading">
        <h2 id="srgb-heading" className="credits-title garamond">SRGB Color space</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.2rem', alignItems: 'start', marginTop: '1.2rem' }}>
          <div className="intro-text" style={{ fontSize: '14px', color: '#444', lineHeight: 1.6 }}>
            The CIE 1931 chromaticity diagram represents all the colors visible to the average human eye. The horseshoe-shaped curve contains the spectral colors, ranging from violet (380 nm) to red (700 nm).
            <br /><br />
            The triangle inside represents the sRGB color gamut—the range of colors that standard screens and monitors can display. The three corners correspond to the primary red, green, and blue phosphors used in displays.
            <br /><br />
            Any color inside the triangle can be reproduced by mixing these three primaries. However, the large area outside the triangle but inside the horseshoe represents visible colors that cannot be displayed on a standard sRGB screen, such as highly saturated cyans and greens.
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <GamutDiagram />
            <figcaption className="global-caption" style={{ marginTop: '0' }}>CIE 1931 Chromaticity Diagram showing sRGB Gamut</figcaption>
          </div>
        </div>
      </section>

      

      <section id="references" data-topic="References" className="credits-section" aria-labelledby="references-heading">
        <h2 id="references-heading" className="credits-title garamond">REFERENCES</h2>
        <div className="credits-divider" aria-hidden="true" />
        <ul className="credits-list" aria-label="Contributor list">
          <li><span className="contrib-item">[1] Peruzzi, Giulio, and Valentina Roberti. 2023. “Helmholtz and the Geometry of Color Space: Gestation and Development of Helmholtz’s Line Element.” <i>Archive for History of Exact Sciences</i> 77: 201–220. <a href="https://doi.org/10.1007/s00407-023-00304-2" target="_blank" rel="noopener noreferrer">https://doi.org/10.1007/s00407-023-00304-2</a>.</span></li>
          
          <li><span className="contrib-item">[2] Fong, James, Hannah K. Doyle, Congli Wang, Alexandra E. Boehm, Sofie R. Herbeck, Vimal Prabhu Pandiyan, Brian P. Schmidt, et al. 2025. “Novel Color via Stimulation of Individual Photoreceptors at Population Scale.” <i>Science Advances</i> 11 (18): eadu1052. <a href="https://doi.org/10.1126/sciadv.adu1052" target="_blank" rel="noopener noreferrer">https://doi.org/10.1126/sciadv.adu1052</a>.</span></li>
          
          <li><span className="contrib-item">[3] Puls, Thomas. 2025. “Chromaticity Preserving Analytic Approximations to the CIE Color Matching Functions.” <i>Journal of Computer Graphics Techniques</i> 14 (1): 1–20.</span></li>
          
          <li><span className="contrib-item">[4] Chou, Tzren-Ru, and Yi-Zhen Wang. 2024. “A Study on Color Theme Generation Using Convolutional Neural Networks.” <i>Proceedings of the 6th World Symposium on Software Engineering (WSSE 2024)</i>, Kyoto, Japan, 1–6. <a href="https://doi.org/10.1145/3698062.3698103" target="_blank" rel="noopener noreferrer">https://doi.org/10.1145/3698062.3698103</a>.</span></li>
          
          <li><span className="contrib-item">[5] Milotta, Filippo L. M., Filippo Stanco, Davide Tanasi, and Anna M. Gueli. 2018. “Munsell Color Specification Using ARCA (Automatic Recognition of Color for Archaeology).” <i>ACM Journal on Computing and Cultural Heritage</i> 11 (4): 17:1–17:15. <a href="https://doi.org/10.1145/3216463" target="_blank" rel="noopener noreferrer">https://doi.org/10.1145/3216463</a>.</span></li>
          
          <li><span className="contrib-item">[6] Bujack, Roxana, Emily Teti, Jonah Miller, Elektra Caffrey, and Terece L. Turton. 2022. “The Non-Riemannian Nature of Perceptual Color Space.” <i>Proceedings of the National Academy of Sciences</i> 119 (18): e2119753119. <a href="https://doi.org/10.1073/pnas.2119753119" target="_blank" rel="noopener noreferrer">https://doi.org/10.1073/pnas.2119753119</a>.</span></li>
          
          <li><span className="contrib-item">[7] MacAdam, David L. 1942. “Visual Sensitivities to Color Differences in Daylight.” <i>Journal of the Optical Society of America</i> 32 (5): 247–274.</span></li>
        </ul>
      </section>

      <section id="footnotes" data-topic="Footnotes" className="credits-section" aria-labelledby="footnotes-heading">
        <h2 id="footnotes-heading" className="credits-title garamond">FOOTNOTES</h2>
        <div className="credits-divider" aria-hidden="true" />
        <ul className="credits-list" aria-label="Footnotes list">
          <li><span className="contrib-item">1. HSV and related models in the prototype are simplified, hard coded interpretations of RGB. They support real time interaction but are not perceptually uniform.</span></li>
          <li><span className="contrib-item">2. Opponent process theory shapes the hue circle. Some spectral hues fall outside the RGB gamut, so the model compresses or clips them.</span></li>
          <li><span className="contrib-item">3. Additive and subtractive mixing are approximations. True mixing depends on full spectral curves, which the system does not compute.</span></li>
          <li><span className="contrib-item">4. Display gamut limits, ambient light, and screen brightness shift how colors appear. Parts of the color space cannot be shown accurately on sRGB displays.</span></li>
          <li><span className="contrib-item">5. Interaction methods influence perception. Rotations, scaling, and gesture navigation can exaggerate or soften relationships between hue, saturation, and value.</span></li>
          <li><span className="contrib-item">6. Continuous color spaces are discretised into meshes for rendering. This introduces mild banding and geometric artifacts.</span></li>
          <li><span className="contrib-item">7. The RGB to HSV transform uses a fast piecewise formulation without gamma correction. The CIELAB conversion uses a hard coded white point and an approximate XYZ matrix.</span></li>
          <li><span className="contrib-item">8. The wavelength feature uses a polynomial fit to estimate RGB from wavelength. Full spectral rendering is not possible within real time constraints.</span></li>
          <li><span className="contrib-item">9. Hue slices and 3D geometry use cylindrical coordinates sampled on a finite grid, introducing slight quantisation in curves and transitions.</span></li>
          <li><span className="contrib-item">10. Distance in perceptual space is shown with ΔE from CIELAB. This metric is an approximation and not the full ΔE2000 standard.</span></li>
          <li><span className="contrib-item">11. Shader calculations run in single precision and may show small rounding differences between devices.</span></li>
          <li><span className="contrib-item">12. Procedural meshes approximate curvature with vertex normals instead of exact analytic surfaces, producing minor deviations from ideal models.</span></li>
          <li><span className="contrib-item">13. The RGB to HSV conversion in the prototype follows the standard piecewise formulation h = atan2(√3 (G−B), 2R−G−B), s = (max−min)/max, v = max. This representation is simplified and omits gamma correction for speed.</span></li>
          <li><span className="contrib-item">14. The RGB to CIELAB mapping uses an approximate sRGB to XYZ transform, followed by L* = 116 f(Y/Yn) − 16, a* = 500 (f(X/Xn) − f(Y/Yn)), b* = 200 (f(Y/Yn) − f(Z/Zn)), where f is a piecewise cube root function. The reference white values are hard coded and not device calibrated.</span></li>
          <li><span className="contrib-item">15. The internal wavelength approximation uses a polynomial fit to estimate RGB from a given λ in the range 380 to 700 nm. True spectral integration would require summing over response curves, which is not feasible in real time.</span></li>
          <li><span className="contrib-item">16. The project visualises hue-slices by sampling points on cylindrical coordinates x = r cos θ, y = r sin θ, z = v, with r and θ derived from saturation and hue. The sampling grid is finite and introduces quantisation in the rendered geometry.</span></li>
          <li><span className="contrib-item">17. The interactive wavelength animation maps frequency to position using E = hcλ<sup>-1</sup>, but is displayed through an RGB pipeline, which loses the full spectral resolution and compresses violet and red regions disproportionately.</span></li>
          <li><span className="contrib-item">18. Gamut boundaries are approximated using triangular RGB interpolation rather than the full convex hull of the device gamut in CIE xyY space. This keeps computation light but underrepresents extreme saturated colors.</span></li>
          <li><span className="contrib-item">19. The perceptual uniformity demonstration relies on calculating Euclidean distances in CIELAB, ΔE = √((ΔL*)² + (Δa*)² + (Δb*)²). This metric is an approximation; ΔE2000 would be more accurate but is computationally heavier.</span></li>
          <li><span className="contrib-item">20. Interpolation between interaction states uses linear blending of hue values, even though hue is circular. Minor discontinuities occur when wrapping near 0 or 360 degrees.</span></li>
          <li><span className="contrib-item">21. Shader based color transforms use single precision floating point arithmetic. Precision limits introduce small rounding errors at high saturation or low value levels.</span></li>
          <li><span className="contrib-item">22. The prototype’s 3D geometric models are constructed with procedurally generated meshes. Curvature is approximated with vertex normals rather than analytical surfaces, producing small deviations from ideal geometry.</span></li>
        </ul>
      </section>

      <section id="credits" data-topic="Contributions and Credits" className="credits-section" aria-labelledby="credits-heading">
        <h2 id="credits-heading" className="credits-title garamond">Contributions and Credits</h2>
        <div className="credits-divider" aria-hidden="true" />
        <ul className="credits-list" aria-label="Contributor list">
          <li><span className="contrib-item single-line">This project was carried out as part of Project 2 at IDC, IIT Bombay, under the guidance of <a className="prof-link" href="https://www.idc.iitb.ac.in/people/phd/girish-vinod-dalvi" target="_blank" rel="noopener noreferrer">Professor Girish Dalvi.</a></span></li>
          <li><span className="contrib-item single-line">Special thanks to Professor Jayesh Pillai and Professor Venkatesh Rajamanickam for their valuable feedback on the stage presentations.</span></li>
        </ul>
      </section>
      <Footer />


      {/* Right-edge hover-to-reveal scroll rail (auto-discovers topics via [data-topic]) */}
      <ScrollRail />
    </div>
  );
}

export default App;
