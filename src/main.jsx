import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import './style.css';

const projects = [
  { n: '01', title: 'CINEMATIC PORTFOLIO', type: 'DIGITAL IDENTITY · 2026', desc: 'An expressive home for ideas, engineered to move with you.', tag: 'WEB EXPERIENCE', art: 'art-one' },
  { n: '02', title: 'INTELLIGENCE, REIMAGINED', type: 'AI PRODUCT · 2025', desc: 'A calmer, more human interface for working with machine intelligence.', tag: 'PRODUCT DESIGN', art: 'art-two' },
  { n: '03', title: 'OBJECTS OF INTENT', type: 'COMMERCE · 2025', desc: 'A considered shopping experience for objects made to last.', tag: 'E-COMMERCE', art: 'art-three' },
];

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.style.setProperty('--delay', `${delay}ms`); el.classList.add('is-visible'); observer.disconnect(); }
    }, { threshold: 0.12 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function Navbar() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 24); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn); }, []);
  const close = () => setMenu(false);
  return <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
    <a className="brand" href="#home" onClick={close}><span className="brand-mark">K<span>.</span></span><span>KARAN<span className="brand-divider"> / </span>DEVELOPER</span></a>
    <nav className={menu ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
      {[['HOME','#home'],['ABOUT','#about'],['WORK','#work'],['CONTACT','#contact']].map(([label,href]) => <a key={href} href={href} onClick={close}>{label}</a>)}
    </nav>
    <a className="nav-cta" href="#contact">LET’S TALK <ArrowUpRight size={13}/></a>
    <button className="menu-toggle" aria-label={menu ? 'Close menu' : 'Open menu'} onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
  </header>;
}

function Cursor() {
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return;
    const el = ref.current;
    let x = 0, y = 0, tx = 0, ty = 0, frame;
    const move = e => { tx = e.clientX; ty = e.clientY; el.classList.add('cursor-active'); };
    const enter = e => { const target = e.target.closest('a,button,[data-cursor]'); if (target) { el.classList.add('cursor-hover'); el.querySelector('span').textContent = target.dataset.cursor || (target.classList.contains('project-link') ? 'VIEW' : 'OPEN'); } };
    const leave = e => { if (e.target.closest('a,button,[data-cursor]')) el.classList.remove('cursor-hover'); };
    const draw = () => { x += (tx - x) * .18; y += (ty - y) * .18; el.style.transform = `translate3d(${x}px,${y}px,0)`; frame = requestAnimationFrame(draw); };
    window.addEventListener('mousemove', move); document.addEventListener('mouseover', enter); document.addEventListener('mouseout', leave); draw();
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseover', enter); document.removeEventListener('mouseout', leave); cancelAnimationFrame(frame); };
  }, []);
  return <div className="cursor" ref={ref}><span/></div>;
}

function Hero() {
  const [revealed, setRevealed] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const hero = useRef(null);
  const move = e => {
    if (matchMedia('(pointer: coarse)').matches) return;
    const rect = hero.current.getBoundingClientRect();
    setPointer({ x: (e.clientX - rect.left - rect.width / 2) / rect.width, y: (e.clientY - rect.top - rect.height / 2) / rect.height });
  };
  return <section className={`hero ${revealed ? 'hero-revealed' : ''}`} id="home" ref={hero} onMouseMove={move} onMouseLeave={() => { setRevealed(false); setPointer({x:0,y:0}); }}>
    <div className="hero-glow" style={{ '--px': `${50 + pointer.x * 17}%`, '--py': `${47 + pointer.y * 14}%` }}/>
    <div className="hero-grid"/>
    <div className="hero-meta"><span>INDEPENDENT DEVELOPER</span><span>BASED IN INDIA <i className="status-dot"/></span></div>
    <div className="hero-copy hero-copy-left" style={{ transform: `translate3d(${pointer.x * -5}px,${pointer.y * -4}px,0)` }}>
      <p className="eyebrow"><span className="eyebrow-line"/> HEY, I’M KARAN</p>
      <h1>BUILDING<br/>DIGITAL<br/><em>WORLDS.</em></h1>
      <p className="hero-index">01 — FULL-STACK DEVELOPER</p>
    </div>
    <div className="hero-portrait" onMouseEnter={() => setRevealed(true)} onClick={() => setRevealed(!revealed)} role="button" tabIndex={0} aria-label="Reveal the person behind the alter ego" onKeyDown={e => e.key === 'Enter' && setRevealed(!revealed)}>
      <div className="portrait-halo"/>
      <img className="portrait-image portrait-default" src="/images/hero-default.png" alt="Karan's mysterious red-lit developer alter ego" style={{ '--mx': `${pointer.x * 10}px`, '--my': `${pointer.y * 8}px` }}/>
      <img className="portrait-image portrait-real" src="/images/hero-hover.png" alt="Karan, the person behind the portfolio" style={{ '--mx': `${pointer.x * 10}px`, '--my': `${pointer.y * 8}px` }}/>
      <span className="reveal-hint"><span className="hint-pulse"/> {revealed ? 'THE HUMAN BEHIND THE CODE' : 'HOVER TO REVEAL'}</span>
    </div>
    <div className="hero-copy hero-copy-right" style={{ transform: `translate3d(${pointer.x * 4}px,${pointer.y * 3}px,0)` }}>
      <p className="eyebrow">DESIGN-LED ENGINEERING</p>
      <p className="hero-description">I turn ambitious ideas into <span>distinctive digital experiences</span> — shaped by design, brought to life with code.</p>
      <a className="round-link" href="#work" aria-label="Explore selected work"><ArrowDownRight size={17}/></a>
    </div>
    <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><span className="scroll-track"><i/></span><span>01 — 08</span></div>
    <span className="hero-side-note">THE OTHER SIDE IS CLOSER THAN YOU THINK</span>
  </section>;
}

function Persona() {
  return <section className="persona section-pad" id="about">
    <div className="section-kicker"><span>01 / A LITTLE ABOUT ME</span><span>THE HUMAN / THE SYSTEM</span></div>
    <div className="persona-grid">
      <Reveal className="persona-visual"><div className="persona-frame"><img src="/images/hero-hover.png" alt="Portrait of Karan"/><span className="frame-corner frame-tl"/><span className="frame-corner frame-br"/><span className="portrait-label">KARAN / THE HUMAN SIDE</span></div><span className="persona-stamp">CREATIVE<br/>BY NATURE<br/><b>×</b> BUILDER<br/>BY INSTINCT</span></Reveal>
      <div className="persona-copy"><Reveal><p className="eyebrow"><span className="eyebrow-line"/> A STUDY IN CONTRAST</p><h2>THE DUAL<br/><em>PERSONA.</em></h2></Reveal>
        <Reveal delay={120}><p className="body-copy">There are two sides to every great digital experience. The relentless logic behind the system, and the feeling that pulls you into an interface.</p><p className="body-copy">I’m Karan — a developer who moves between both. I bring complex ideas to life through thoughtful engineering, distinct visual language, and details that feel just right.</p></Reveal>
        <div className="persona-list">{['FULL-STACK FLUIDITY','SYSTEMS THAT SCALE','MOTION WITH MEANING','DETAILS THAT MATTER'].map((item,i)=><Reveal key={item} delay={i*80}><div className="persona-row"><span>0{i+1}</span><b>{item}</b><ArrowUpRight size={14}/></div></Reveal>)}</div>
      </div>
    </div>
  </section>;
}

const capabilities = [
  ['01','FRONTEND','Interfaces with feeling. Responsive layouts, meaningful motion, and a point of view.','REACT · TYPESCRIPT · CSS'],
  ['02','BACKEND','Reliable foundations. Thoughtful APIs, well-shaped data, and resilient systems.','NODE · DATABASES · APIS'],
  ['03','FULL-STACK','The full picture, from first sketch and architecture to a live product.','END-TO-END · DEPLOYMENT'],
  ['04','CREATIVE CODE','Playful experiments and digital worlds that leave a lasting impression.','INTERACTION · STORYTELLING'],
];
function Capabilities() {
  return <section className="capabilities section-pad" id="capabilities"><div className="section-kicker"><span>02 / WHAT I BRING</span><span>CAPABILITIES, NOT CHECKBOXES</span></div><Reveal><h2 className="section-title">WHAT I <em>BUILD.</em></h2></Reveal>
    <div className="cap-list">{capabilities.map(([n,title,desc,stack])=><div className="cap-row" key={n}><span className="cap-num">{n}</span><h3>{title}</h3><p>{desc}</p><span className="cap-stack">{stack}</span><ArrowUpRight className="cap-arrow" size={19}/></div>)}</div>
    <div className="tech-note"><span className="status-dot"/> ALWAYS LEARNING. ALWAYS MAKING.</div>
  </section>;
}

function ProjectArtwork({ art }) { return <div className={`project-art ${art}`}><div className="art-grain"/><div className="art-orbit orbit-a"/><div className="art-orbit orbit-b"/><div className="art-object"><span/></div><div className="art-surface"/><span className="art-coordinate">FIG. 0{art === 'art-one' ? 1 : art === 'art-two' ? 2 : 3} / KARAN STUDIO</span></div>; }
function Projects() {
  return <section className="projects section-pad" id="work"><div className="section-kicker"><span>03 / SELECTED WORK</span><span>A FEW THINGS MADE WITH INTENT</span></div><div className="projects-heading"><Reveal><h2>SELECTED<br/><em>PROJECTS.</em></h2></Reveal><Reveal delay={120}><p>Each project starts with a question<br/>and ends somewhere unexpected.</p><a className="text-link" href="#contact">HAVE A GOOD ONE IN MIND? <ArrowUpRight size={13}/></a></Reveal></div>
    <div className="project-list">{projects.map((p,i)=><Reveal key={p.n} delay={i*80}><a className="project-item" href="#contact" data-cursor="VIEW"><div className="project-visual"><ProjectArtwork art={p.art}/><span className="visual-index">PROJECT — {p.n}</span><span className="visual-open"><ArrowUpRight size={20}/></span></div><div className="project-info"><span className="project-num">{p.n} /</span><div className="project-title-wrap"><h3>{p.title}</h3><p>{p.desc}</p></div><div className="project-meta"><span>{p.type}</span><span>{p.tag}</span></div><ArrowUpRight className="project-arrow" size={19}/></div></a></Reveal>)}</div>
  </section>;
}

function Featured() {
  const ref = useRef(null);
  useEffect(() => { const el=ref.current; if(!el) return; let raf; const update=()=>{const r=el.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(window.innerHeight-r.top)/(window.innerHeight+r.height)));el.style.setProperty('--zoom',1+progress*.105);raf=0;};const scroll=()=>{if(!raf)raf=requestAnimationFrame(update);};window.addEventListener('scroll',scroll,{passive:true});update();return()=>{window.removeEventListener('scroll',scroll);cancelAnimationFrame(raf);};},[]);
  return <section className="featured" ref={ref}><div className="featured-backdrop"><div className="feature-ring ring-one"/><div className="feature-ring ring-two"/><div className="feature-core"/><div className="feature-grain"/></div><div className="featured-content"><div className="section-kicker"><span>04 / FEATURED WORK</span><span>AN EXERCISE IN ATMOSPHERE</span></div><div className="featured-main"><Reveal><p className="eyebrow"><span className="eyebrow-line"/> AN ONGOING EXPLORATION</p><h2>BUILDING<br/>DIGITAL <em>WORLDS.</em></h2><p className="featured-desc">A living experiment in how engineering, visual design and motion can turn the web into somewhere you can feel.</p><a href="#contact" className="button-link">EXPLORE THE EXPERIENCE <ArrowUpRight size={14}/></a></Reveal></div><div className="featured-bottom"><span>INDEPENDENT BY DESIGN</span><span>DESIGNED & BUILT BY KARAN</span><span>2026 / INDIA</span></div></div></section>;
}

function Contact() {
  return <section className="contact section-pad" id="contact"><div className="section-kicker"><span>05 / THE NEXT CHAPTER</span><span>OPEN TO SELECT PROJECTS</span></div><div className="contact-grid"><div><Reveal><p className="eyebrow"><span className="eyebrow-line"/> HAVE A GOOD IDEA?</p><h2>LET’S MAKE<br/>IT <em>MATTER.</em></h2></Reveal><Reveal delay={100}><p className="contact-note">Have an idea, a challenge, or a world that needs building? I’d like to hear about it.</p><a className="button-link contact-cta" href="mailto:hello@karan.dev">START A CONVERSATION <ArrowUpRight size={14}/></a></Reveal></div><Reveal className="contact-details" delay={180}><span className="eyebrow">FIND ME ELSEWHERE</span><a href="mailto:hello@karan.dev"><span>EMAIL</span>hello@karan.dev<ArrowUpRight size={14}/></a><a href="https://github.com/" target="_blank" rel="noreferrer"><span>GITHUB</span>github.com<ArrowUpRight size={14}/></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><span>LINKEDIN</span>linkedin.com<ArrowUpRight size={14}/></a></Reveal></div><div className="contact-orbit" aria-hidden="true"><span>K</span></div></section>;
}

function Footer() { return <footer className="footer"><a className="brand" href="#home"><span className="brand-mark">K<span>.</span></span><span>KARAN<span className="brand-divider"> / </span>DEVELOPER</span></a><span>© 2026 KARAN. MADE WITH INTENT.</span><span><i className="status-dot"/> AVAILABLE FOR SELECT PROJECTS</span><a href="#home" className="back-top">BACK TO TOP <ArrowUpRight size={12}/></a></footer>; }

function App() { return <><Cursor/><Navbar/><main><Hero/><Persona/><Capabilities/><Projects/><Featured/><Contact/></main><Footer/></>; }

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
