
import './App.css';
import { useState } from 'react';
import Footer from './Footer';
import VisibleSpectrumCanvas from './VisibleSpectrumCanvas';
import ConeRodResponseCanvas from './ConeRodResponseCanvas';
import ProjectorScene from './ProjectorScene';
import ScrollRail from './ScrollRail';
import ColorPalette from './ColorPalette';
import RGBColorSpace3D from './RGBColorSpace3D';
import HSVColorSpace3D from './HSVColorSpace3D';

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
      </section>
      <section id="munsell" data-topic="Munsell" className="credits-section" aria-labelledby="munsell-heading">
        <h2 id="munsell-heading" className="credits-title garamond" style={{ fontSize: '1rem', marginTop: '1.4rem' }}>Munsell Color System</h2>
        <div className="intro-text" style={{ fontSize: '14px', color: '#444', marginTop: '0.6rem', lineHeight: 1.6 }}>
          The Munsell system organizes colours by three perceptual attributes: Hue (five principal hues with intermediate steps), Value (lightness from black 0 to white 10), and Chroma (colour strength radiating outward). Unlike HSV’s geometric cylinder, Munsell is arranged so equal visual steps feel uniform, producing an irregular three‑dimensional solid. This section will illustrate its structure and compare it with HSV.
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
          <li><span className="contrib-item single-line">Data Geometry <a className="prof-link" href="https://in.linkedin.com/in/sumant-rao-a5aaa042" target="_blank" rel="noopener noreferrer">XXXXXXXXX.</a></span></li>
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
