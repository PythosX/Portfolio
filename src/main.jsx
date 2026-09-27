import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDownRight, ArrowUpRight, Menu, X, Search, Github, Star, GitFork } from 'lucide-react';
import './style.css';
import './enhancements.css';

const GITHUB_USER = 'pythosx';
const GITHUB_URL = `https://github.com/${GITHUB_USER}`;
const safeHomepage = url => { try { const parsed=new URL(/^https?:\/\//i.test(url)?url:`https://${url}`); return ['http:','https:'].includes(parsed.protocol)?parsed.href:''; } catch { return ''; } };
const homepageHost = url => { try { return new URL(safeHomepage(url)).hostname || 'LIVE PROJECT'; } catch { return 'LIVE PROJECT'; } };
const projectKind = repo => {
  const terms = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')} ${repo.language || ''}`.toLowerCase();
  if (/ai|llm|machine.learning|neural/.test(terms)) return 'ai';
  if (/python|terminal|cli|automation/.test(terms)) return 'code';
  if (/game|unity|godot/.test(terms)) return 'game';
  if (/3d|three|blender|webgl/.test(terms)) return 'three';
  if (/react|next|javascript|typescript/.test(terms)) return 'web';
  return 'project';
};

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

function ScrollProgress() {
  const ref=useRef(null);
  useEffect(()=>{let frame;const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;ref.current?.style.setProperty('transform',`scaleX(${max>0?scrollY/max:0})`);frame=0;};const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update);};window.addEventListener('scroll',onScroll,{passive:true});update();return()=>{window.removeEventListener('scroll',onScroll);cancelAnimationFrame(frame);};},[]);
  return <div className="scroll-progress" ref={ref}/>;
}

function MagneticInteractions() {
  useEffect(()=>{if(matchMedia('(pointer: coarse)').matches)return;const items=[...document.querySelectorAll('.magnetic,.button-link,.nav-cta')];const move=e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.transform=`translate3d(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.12}px,0)`;};const reset=e=>{e.currentTarget.style.transform='translate3d(0,0,0)';};items.forEach(el=>{el.addEventListener('pointermove',move);el.addEventListener('pointerleave',reset);});return()=>items.forEach(el=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',reset);});},[]);
  return null;
}

function Navbar() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 24); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn); }, []);
  const close = () => setMenu(false);
  return <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
    <a className="brand" href="#home" onClick={close}><span className="brand-mark">K<span>.</span></span><span>KARAN<span className="brand-divider"> / </span>PythosX</span></a>
    <nav className={menu ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
      {[['HOME','#home'],['ABOUT','#about'],['WORK','#work'],['CONTACT','#contact']].map(([label,href]) => <a key={href} href={href} onClick={close} onMouseEnter={e=>{const node=e.currentTarget;node.dataset.original=label;node.textContent=label.replaceAll('O','0').replaceAll('E','3').replaceAll('S','5').replaceAll('I','1');setTimeout(()=>{if(node.isConnected)node.textContent=node.dataset.original;},130);}}>{label}</a>)}
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
  const [nearImage, setNearImage] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const hero = useRef(null);
  const move = e => {
    if (matchMedia('(pointer: coarse)').matches) return;
    const rect = hero.current.getBoundingClientRect();
    const imageRect=hero.current.querySelector('.hero-portrait').getBoundingClientRect();
    setNearImage(e.clientX>=imageRect.left-35&&e.clientX<=imageRect.right+35&&e.clientY>=imageRect.top-35&&e.clientY<=imageRect.bottom+35);
    setPointer({ x: (e.clientX - rect.left - rect.width / 2) / rect.width, y: (e.clientY - rect.top - rect.height / 2) / rect.height });
  };
  return <section className={`hero ${revealed ? 'hero-revealed' : ''} ${nearImage?'hero-near':''}`} id="home" ref={hero} onMouseMove={move} onMouseLeave={() => { setRevealed(false); setNearImage(false); setPointer({x:0,y:0}); }}>
    <div className="hero-glow" style={{ '--px': `${50 + pointer.x * 17}%`, '--py': `${47 + pointer.y * 14}%` }}/>
    <div className="hero-grid"/>
    <div className="hero-meta"><span>01 / INTRO</span><span>BASED IN INDIA <i className="status-dot"/></span></div>
    <div className="hero-copy hero-copy-left" style={{ transform: `translate3d(${pointer.x * -5}px,${pointer.y * -4}px,0)` }}>
      <p className="eyebrow"><span className="eyebrow-line"/> HEY, I’M KARAN</p>
      <h1>BUILDING<br/>DIGITAL<br/><em>WORLDS.</em></h1>
      <p className="hero-index">01 — B.Tech Engineering Student</p>
      <p className="hero-index">02 — At SAKEC Mumbai</p>
    </div>
    <div className="hero-portrait" onMouseEnter={() => {if(!matchMedia('(pointer: coarse)').matches)setRevealed(true);}} onClick={() => setRevealed(value=>matchMedia('(pointer: coarse)').matches?!value:true)} role="button" tabIndex={0} aria-label={revealed?'Show the alter ego':'Reveal the person behind the alter ego'} onKeyDown={e => (e.key === 'Enter'||e.key === ' ') && (e.preventDefault(),setRevealed(value=>!value))}>
      <div className="portrait-halo"/>
      <img className="portrait-image portrait-default" src="/images/hero-default.png" alt="Karan's mysterious red-lit developer alter ego" fetchPriority="high" style={{ '--mx': `${pointer.x * 10}px`, '--my': `${pointer.y * 8}px` }}/>
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
    <div className="section-kicker"><span>02 / ABOUT</span><span>THE HUMAN / THE SYSTEM</span></div>
    <div className="persona-grid">
      <Reveal className="persona-visual"><div className="persona-frame"><img src="/images/hero.png" alt="Portrait of Karan" loading="lazy" decoding="async"/><span className="frame-corner frame-tl"/><span className="frame-corner frame-br"/><span className="portrait-label">KARAN / THE HUMAN SIDE</span></div><span className="persona-stamp">CREATIVE<br/>BY NATURE<br/><b>×</b> BUILDER<br/>BY INSTINCT</span></Reveal>
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
  const toolkit=[['REACT','Interactive UI systems'],['NEXT.JS','Fast, structured web apps'],['JAVASCRIPT','The language of the web'],['TYPESCRIPT','Reliable application code'],['PYTHON','Automation and useful tools'],['NODE','Server-side JavaScript'],['TAILWIND','Rapid visual systems'],['GIT','Versioned collaboration'],['GITHUB','Building in public'],['FIGMA','Ideas into interfaces']];
  const [activeTool,setActiveTool]=useState('REACT');
  return <section className="capabilities section-pad" id="capabilities"><div className="section-kicker"><span>03 / CAPABILITIES</span><span>CAPABILITIES, NOT CHECKBOXES</span></div><Reveal><h2 className="section-title">WHAT I <em>BUILD.</em></h2></Reveal>
    <div className="cap-list">{capabilities.map(([n,title,desc,stack])=><div className="cap-row" key={n}><span className="cap-num">{n}</span><h3>{title}</h3><p>{desc}</p><span className="cap-stack">{stack}</span><ArrowUpRight className="cap-arrow" size={19}/></div>)}</div>
    <div className="toolkit"><div className="toolkit-heading"><span className="eyebrow"><span className="eyebrow-line"/> THE TOOLKIT</span><span className="toolkit-description">{toolkit.find(t=>t[0]===activeTool)?.[1]}</span></div><div className="toolkit-words">{toolkit.map(([name])=><button key={name} onMouseEnter={()=>setActiveTool(name)} onFocus={()=>setActiveTool(name)} className={activeTool===name?'tool-active':''}>{name}</button>)}</div></div>
    <div className="tech-note"><span className="status-dot"/> ALWAYS LEARNING. ALWAYS MAKING.</div>
  </section>;
}

function ProjectArtwork({ repo }) {
  const kind = projectKind(repo);
  return <div className={`project-art art-${kind}`} aria-hidden="true"><div className="art-browser"><div className="browser-bar"><i/><i/><i/><span>{repo.homepage ? homepageHost(repo.homepage) : repo.language || 'OPEN SOURCE'}</span></div><div className="browser-body"><div className="browser-lines"><i/><i/><i/></div><div className="browser-glyph"><span/></div><div className="browser-lines short"><i/><i/></div></div></div><div className="art-grain"/><span className="art-coordinate">{(repo.language || (repo.topics?.[0] || 'PUBLIC REPOSITORY')).toUpperCase()} / {repo.owner.login.toUpperCase()}</span></div>;
}

const ProjectCard = React.memo(function ProjectCard({ repo, index, onPreview }) {
  const liveUrl=safeHomepage(repo.homepage);
  return <article className="project-card" onPointerEnter={e => onPreview(repo, e)} onPointerMove={e => onPreview(repo, e)} onPointerLeave={() => onPreview(null)}>
    <div className="project-card-main">
      <div className="project-card-visual"><ProjectArtwork repo={repo}/><span className="project-card-num">{String(index + 1).padStart(2,'0')}</span><span className="project-card-open"><ArrowUpRight size={17}/></span></div>
      <div className="project-card-copy"><div className="project-card-title"><h3>{repo.name.replaceAll('-', ' ')}</h3><ArrowUpRight className="project-arrow" size={17}/></div><p>{repo.description || 'An open-source experiment, built and shared in public.'}</p>
        <div className="project-card-tags"><span>{repo.language || (repo.topics?.[0] || 'OPEN SOURCE')}</span>{repo.topics?.slice(0,2).map(topic=><span key={topic}>{topic}</span>)}</div>
        <div className="project-card-stats"><span><Star size={12}/>{repo.stargazers_count}</span><span><GitFork size={12}/>{repo.forks_count}</span><time dateTime={repo.updated_at}>UPDATED {new Date(repo.updated_at).toLocaleDateString(undefined,{year:'numeric',month:'short'})}</time></div>
        <div className="project-card-actions"><a href={repo.html_url} target="_blank" rel="noreferrer" data-cursor="VIEW">VIEW PROJECT <ArrowUpRight size={12}/></a>{liveUrl && <a href={liveUrl} target="_blank" rel="noreferrer">LIVE SITE <ArrowUpRight size={12}/></a>}</div>
      </div>
    </div>
  </article>;
});

function Projects() {
  const [repos, setRepos] = useState([]);
  const [status, setStatus] = useState('loading');
  const [active, setActive] = useState('ALL');
  const [query, setQuery] = useState('');
  const [settledQuery, setSettledQuery] = useState('');
  const [sort, setSort] = useState('updated');
  const [preview, setPreview] = useState(null);
  const previewRef = useRef(null);
  const pointerRef = useRef({x:0,y:0});
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const all = [];
        for (let page=1; ; page++) {
          const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&page=${page}&sort=updated`, {headers:{Accept:'application/vnd.github+json'},signal:controller.signal});
          if (!res.ok) throw new Error(`GitHub returned ${res.status}`);
          const batch = await res.json(); all.push(...batch);
          if (batch.length < 100) break;
        }
        if (!all.length) throw new Error('No public repositories found');
        setRepos(all); setStatus('ready');
      } catch (error) { if (error.name !== 'AbortError') setStatus('error'); }
    };
    load(); return () => controller.abort();
  }, []);
  useEffect(() => { const timer=setTimeout(()=>setSettledQuery(query.trim().toLowerCase()),140); return()=>clearTimeout(timer); },[query]);
  useEffect(() => {
    if (!preview) return;
    let frame;
    const draw = () => {
      const el=previewRef.current;
      if (el && preview) { const w=246,h=155,x=Math.max(12,Math.min(pointerRef.current.x+18,innerWidth-w-12)),y=Math.max(12,Math.min(pointerRef.current.y+18,innerHeight-h-12));el.style.transform=`translate3d(${x}px,${y}px,0)`; }
      frame=requestAnimationFrame(draw);
    };
    frame=requestAnimationFrame(draw); return()=>cancelAnimationFrame(frame);
  },[preview]);
  const languages = [...new Set(repos.map(r=>r.language).filter(Boolean))].sort();
  const topicCounts = new Map(); repos.forEach(repo=>(repo.topics||[]).forEach(topic=>topicCounts.set(topic,(topicCounts.get(topic)||0)+1)));
  const topics = [...topicCounts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,8).map(([topic])=>topic);
  const filters = ['ALL',...languages,...topics.filter(t=>!languages.some(language=>language.toLowerCase()===t.toLowerCase()))];
  const filtered = repos.filter(r=>{
    const term=`${r.name} ${r.description||''} ${r.language||''} ${(r.topics||[]).join(' ')}`.toLowerCase();
    return (!settledQuery || term.includes(settledQuery)) && (active==='ALL' || (r.language||'').toLowerCase()===active.toLowerCase() || (r.topics||[]).some(t=>t.toLowerCase()===active.toLowerCase()));
  }).sort((a,b)=>{if(a.fork!==b.fork)return a.fork?1:-1;return sort==='stars'?b.stargazers_count-a.stargazers_count:sort==='az'?a.name.localeCompare(b.name):new Date(b.updated_at)-new Date(a.updated_at);});
  const updatePreview = useCallback((repo,e) => { if (matchMedia('(pointer: coarse)').matches) return; pointerRef.current={x:e.clientX,y:e.clientY};const rect=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--arrow-x',`${Math.max(-3,Math.min(3,(e.clientX-rect.left-rect.width/2)*.025))}px`);e.currentTarget.style.setProperty('--arrow-y',`${Math.max(-3,Math.min(3,(e.clientY-rect.top-rect.height/2)*.025))}px`);setPreview(repo); },[]);
  return <section className="projects section-pad" id="work"><div className="section-kicker"><span>04 / SELECTED WORK</span><span>REAL PROJECTS · REAL CODE</span></div>
    <div className="projects-heading"><Reveal><p className="eyebrow"><span className="eyebrow-line"/> SELECTED WORK</p><h2>BUILT IN<br/><em>PUBLIC.</em></h2></Reveal><Reveal delay={120}><p>A collection of experiments, applications<br/>and systems I’ve built and shipped.</p><a className="text-link magnetic" href={GITHUB_URL} target="_blank" rel="noreferrer">VIEW GITHUB <ArrowUpRight size={13}/></a></Reveal></div>
    <div className="archive-bar"><span className="repo-count">{status==='loading'?'SCANNING REPOSITORIES…':status==='error'?'ARCHIVE CONNECTION FAILED':`${repos.length} PUBLIC REPOSITORIES`}</span><a className="github-cta magnetic" href={GITHUB_URL} target="_blank" rel="noreferrer"><Github size={14}/> VIEW GITHUB <ArrowUpRight size={12}/></a></div>
    {status==='loading' && <div className="archive-loading"><span>SCANNING GITHUB</span><div className="scan-track"><i/></div><span>FETCHING PUBLIC REPOSITORIES</span></div>}
    {status==='error' && <div className="archive-error"><span>PROJECT ARCHIVE TEMPORARILY UNAVAILABLE</span><a href={GITHUB_URL} target="_blank" rel="noreferrer">VIEW GITHUB <ArrowUpRight size={13}/></a></div>}
    {status==='ready' && <>
      <div className="project-controls"><div className="project-filters" aria-label="Filter repositories">{filters.map(filter=><button key={filter} className={active===filter?'filter-active':''} onClick={()=>setActive(filter)}>{filter}</button>)}</div><div className="project-tools"><label className="project-search"><Search size={14}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="SEARCH PROJECTS…" aria-label="Search projects"/></label><label className="project-sort"><span>SORT</span><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort projects"><option value="updated">Recently Updated</option><option value="stars">Most Stars</option><option value="az">A–Z</option></select></label></div></div>
      <p className="results-count">SHOWING {filtered.length} / {repos.length} REPOSITORIES</p>
      <div className="project-grid">{filtered.map((repo,i)=><ProjectCard key={repo.id} repo={repo} index={i} onPreview={updatePreview}/>)}</div>
      {!filtered.length && <div className="no-results">NO PROJECTS MATCH THIS SEARCH.</div>}
    </>}
    <div className={`floating-preview ${preview?'preview-visible':''}`} ref={previewRef} aria-hidden="true">{preview && <><ProjectArtwork repo={preview}/><span className="preview-caption">{preview.name} <ArrowUpRight size={12}/></span></>}</div>
  </section>;
}

function Featured() {
  const ref = useRef(null);
  useEffect(() => { const el=ref.current; if(!el) return; let raf; const update=()=>{const r=el.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(window.innerHeight-r.top)/(window.innerHeight+r.height)));el.style.setProperty('--zoom',1+progress*.105);raf=0;};const scroll=()=>{if(!raf)raf=requestAnimationFrame(update);};window.addEventListener('scroll',scroll,{passive:true});update();return()=>{window.removeEventListener('scroll',scroll);cancelAnimationFrame(raf);};},[]);
  return <section className="featured" ref={ref}><div className="featured-backdrop"><div className="feature-ring ring-one"/><div className="feature-ring ring-two"/><div className="feature-core"/><div className="feature-grain"/></div><div className="featured-content"><div className="section-kicker"><span>FEATURED / AN EXERCISE IN ATMOSPHERE</span><span>DESIGN × ENGINEERING</span></div><div className="featured-main"><Reveal><p className="eyebrow"><span className="eyebrow-line"/> AN ONGOING EXPLORATION</p><h2>BUILDING<br/>DIGITAL <em>WORLDS.</em></h2><p className="featured-desc">A living experiment in how engineering, visual design and motion can turn the web into somewhere you can feel.</p><a href="#contact" className="button-link">EXPLORE THE EXPERIENCE <ArrowUpRight size={14}/></a></Reveal></div><div className="featured-bottom"><span>INDEPENDENT BY DESIGN</span><span>DESIGNED & BUILT BY KARAN</span><span>2026 / INDIA</span></div></div></section>;
}

function Contact() {
  return <section className="contact section-pad" id="contact"><div className="section-kicker"><span>05 / CONTACT</span><span>OPEN TO SELECT PROJECTS</span></div><div className="contact-grid"><div><Reveal><p className="eyebrow"><span className="eyebrow-line"/> HAVE A GOOD IDEA?</p><h2>LET’S MAKE<br/>IT <em>MATTER.</em></h2></Reveal><Reveal delay={100}><p className="contact-note">Have an idea, a challenge, or a world that needs building? I’d like to hear about it.</p><a className="button-link contact-cta" href="mailto:hello@karan.dev">START A CONVERSATION <ArrowUpRight size={14}/></a></Reveal></div><Reveal className="contact-details" delay={180}><span className="eyebrow">FIND ME ELSEWHERE</span><a href="mailto:hello@karan.dev"><span>EMAIL</span>hello@karan.dev<ArrowUpRight size={14}/></a><a href={GITHUB_URL} target="_blank" rel="noreferrer"><span>GITHUB</span>pythosx<ArrowUpRight size={14}/></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><span>LINKEDIN</span>linkedin.com<ArrowUpRight size={14}/></a></Reveal></div><div className="contact-orbit" aria-hidden="true"><span>K</span></div></section>;
}

function Footer() { const [time,setTime]=useState(()=>new Date());useEffect(()=>{const id=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(id);},[]);return <footer className="footer"><a className="brand" href="#home"><span className="brand-mark">K<span>.</span></span><span>KARAN<span className="brand-divider"> / </span>DEVELOPER</span></a><span>© 2026 KARAN. MADE WITH INTENT.</span><span className="local-clock">LOCAL TIME <b>{time.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'})}</b></span><span className="footer-status" title="AVAILABLE FOR SELECTED PROJECTS"><i className="status-dot"/> AVAILABLE FOR SELECT PROJECTS</span><a href="#home" className="back-top">BACK TO TOP <ArrowUpRight size={12}/></a></footer>; }

function App() { return <><ScrollProgress/><Cursor/><MagneticInteractions/><Navbar/><main><Hero/><Persona/><Capabilities/><Projects/><Featured/><Contact/></main><Footer/></>; }

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
