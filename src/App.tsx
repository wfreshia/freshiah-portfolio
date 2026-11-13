import { useEffect, useRef, useState, FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import * as L from 'lucide-react'
import { profile, projects, skills, experience, interests, Project } from './data'

const Icon = ({ name, className }: { name: string; className?: string }) => {
  const C = (L as unknown as Record<string, L.LucideIcon>)[name] ?? L.Circle
  return <C className={className} aria-hidden />
}
const nav = ['About','Projects','Skills','Experience','Exploring','Contact']
const id = (s: string) => s.toLowerCase()
const wrap = 'mx-auto max-w-6xl px-5 sm:px-8'
const btn = 'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition'
const primary = `${btn} bg-electric text-white hover:bg-electric-soft`
const ghost = `${btn} border border-navy/20 hover:border-electric dark:border-white/20`

function Network() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current!, g = cv.getContext('2d')!
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let w = 0, h = 0, raf = 0
    const pts = Array.from({ length: 48 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * 4e-4, vy: (Math.random() - .5) * 4e-4 }))
    const size = () => { w = cv.width = cv.offsetWidth; h = cv.height = cv.offsetHeight }
    size(); addEventListener('resize', size)
    const tick = () => {
      g.clearRect(0, 0, w, h)
      pts.forEach(p => { p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1 })
      pts.forEach((a, i) => { g.fillStyle = 'rgba(120,100,75,.7)'; g.beginPath(); g.arc(a.x * w, a.y * h, 2, 0, 7); g.fill()
        for (let j = i + 1; j < pts.length; j++) { const b = pts[j], d = Math.hypot((a.x - b.x) * w, (a.y - b.y) * h)
          if (d < 140) { g.strokeStyle = `rgba(120,100,75,${.35 * (1 - d / 140)})`; g.beginPath(); g.moveTo(a.x * w, a.y * h); g.lineTo(b.x * w, b.y * h); g.stroke() } } })
      raf = requestAnimationFrame(tick)
    }
    tick(); return () => { cancelAnimationFrame(raf); removeEventListener('resize', size) }
  }, [])
  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full opacity-70" />
}

function Section({ name, title, lead, children }: { name: string; title: string; lead?: string; children: React.ReactNode }) {
  return <section id={id(name)} className="py-20 sm:py-28"><div className={wrap}>
    <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
    {lead && <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">{lead}</p>}
    <div className="mt-10">{children}</div></div></section>
}

function Modal({ p, onClose }: { p: Project; onClose: () => void }) {
  const [zoom, setZoom] = useState<string | null>(null)
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'; return () => { removeEventListener('keydown', k); document.body.style.overflow = '' } }, [onClose])
  const Block = ({ t, children }: { t: string; children: React.ReactNode }) => <div className="mt-6"><h3 className="text-lg font-semibold">{t}</h3><div className="mt-1 text-slate-600 dark:text-slate-300">{children}</div></div>
  return <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-900/70 p-0 backdrop-blur-sm sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <motion.div role="dialog" aria-modal="true" aria-label={p.title} onClick={e => e.stopPropagation()} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
      className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-navy-800 sm:rounded-3xl sm:p-8">
      <div className="flex items-start justify-between gap-4"><h2 className="text-2xl font-bold sm:text-3xl">{p.title}{p.status && <span className="ml-3 align-middle rounded-full bg-amber-400/20 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-300">{p.status}</span>}</h2>
        <button autoFocus onClick={onClose} aria-label="Close project details" className="rounded-full p-2 hover:bg-mist dark:hover:bg-white/10"><L.X /></button></div>
      <Block t="Overview">{p.summary}</Block><Block t="Problem being addressed">{p.problem}</Block><Block t="Proposed solution">{p.solution}</Block>
      {p.tech.length ? <Block t="Technologies used"><div className="mt-1 flex flex-wrap gap-2">{p.tech.map(t => <span key={t} className="rounded-full bg-electric/10 px-3 py-1 text-sm text-electric">{t}</span>)}</div></Block> : null}
      <Block t="Key features"><ul className="list-disc pl-5">{p.features.map(f => <li key={f}>{f}</li>)}</ul></Block>
      <Block t="My contribution">{p.contribution}</Block>
      {p.screenshots?.length ? <Block t="Screenshots"><div className="grid gap-3 sm:grid-cols-2">{p.screenshots.map(s => <button key={s} type="button" onClick={() => setZoom(s)} aria-label="Enlarge screenshot" className="block cursor-zoom-in"><img src={s} alt={`${p.title} screenshot`} loading="lazy" className="rounded-xl" /></button>)}</div></Block> : null}
      <div className="mt-8 flex flex-wrap gap-3">
        {p.repo && <a className={primary} href={p.repo} target="_blank" rel="noreferrer"><L.Github size={16} />View on GitHub</a>}
        {p.demo && <a className={ghost} href={p.demo} target="_blank" rel="noreferrer"><L.ExternalLink size={16} />Live demo</a>}</div>
    </motion.div>
    {zoom && <div className="fixed inset-0 z-[60] grid cursor-zoom-out place-items-center bg-black/90 p-4" onClick={e => { e.stopPropagation(); setZoom(null) }}><img src={zoom} alt="Enlarged screenshot" className="max-h-full max-w-full rounded-lg" /></div>}
  </motion.div>
}

export default function App() {
  const [dark, setDark] = useState(() => { try { return localStorage.getItem('theme') === 'dark' } catch { return false } })
  const [open, setOpen] = useState<Project | null>(null)
  const [menu, setMenu] = useState(false)
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch { /* ignore */ } }, [dark])
  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const f = new FormData(e.currentTarget)
    const body = `${f.get('message')}\n\nFrom: ${f.get('name')} (${f.get('email')})`
    location.href = `mailto:${profile.email}?subject=${encodeURIComponent(String(f.get('subject')))}&body=${encodeURIComponent(body)}`
  }
  const field = 'mt-1 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 dark:border-white/15 dark:bg-navy-900'
  return <>
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded focus:bg-electric focus:px-3 focus:py-2 focus:text-white">Skip to content</a>
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-navy-900/80">
      <nav aria-label="Primary" className={`${wrap} flex h-16 items-center justify-between`}>
        <a href="#home" className="font-display text-lg font-bold">Freshiah<span className="text-electric">.</span></a>
        <ul className="hidden gap-6 text-sm lg:flex">{nav.map(n => <li key={n}><a className="hover:text-electric" href={`#${id(n)}`}>{n}</a></li>)}</ul>
        <div className="flex items-center gap-2">
          <button onClick={() => setDark(!dark)} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} className="rounded-full p-2 hover:bg-mist dark:hover:bg-white/10">{dark ? <L.Sun size={18} /> : <L.Moon size={18} />}</button>
          <button className="rounded-full p-2 lg:hidden" aria-expanded={menu} aria-label="Toggle menu" onClick={() => setMenu(!menu)}>{menu ? <L.X size={20} /> : <L.Menu size={20} />}</button></div>
      </nav>
      {menu && <ul className="border-t border-navy/10 px-5 py-3 dark:border-white/10 lg:hidden">{nav.map(n => <li key={n}><a className="block py-2" href={`#${id(n)}`} onClick={() => setMenu(false)}>{n}</a></li>)}</ul>}
    </header>
    <main id="main">
      <section id="home" className="relative overflow-hidden bg-gradient-to-b from-mist to-white dark:from-navy-800 dark:to-navy-900">
        <Network />
        <div className={`${wrap} relative grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.4fr_1fr]`}>
          <div>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="font-medium text-electric">Hello, I'm Freshiah Wangari Mwaura.</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }} className="mt-4 text-4xl font-bold leading-[1.05] sm:text-6xl">Technology, Data &amp; Innovation — Building Solutions That Matter.</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .25 }} className="mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-300">I am an Information Systems and Technology student passionate about cybersecurity, digital innovation, data management and technology-driven problem solving. I enjoy exploring how technology can improve systems, strengthen security and create meaningful solutions.</motion.p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className={primary} href="#projects"><L.FolderOpen size={16} />View My Projects</a>
              <a className={ghost} href={profile.cv} download><L.Download size={16} />Download My CV</a>
              <a className={ghost} href="#contact"><L.Mail size={16} />Let's Connect</a></div>
          </div>
          <div className="mx-auto w-64 sm:w-80"><div className="rounded-[2.5rem] bg-gradient-to-br from-[#D8C7A8] to-[#B9A889] p-1.5">
            {profile.photo ? <img src={profile.photo} alt="Freshiah Wangari Mwaura" className="aspect-[4/5] w-full rounded-[2.2rem] object-cover" />
              : <div className="grid aspect-[4/5] place-items-center rounded-[2.2rem] bg-navy text-center text-white"><div><p className="font-display text-7xl font-bold">FM</p><p className="mt-2 text-sm text-white/70">Information Systems &amp; Technology</p></div></div>}</div></div>
        </div>
      </section>

      <Section name="About" title="Where technology meets governance" lead="I combine technical skills with an interest in policy, security and innovation, because practical problems rarely sit in one discipline.">
        <div className="grid gap-8 lg:grid-cols-2">
          <p className="text-slate-600 dark:text-slate-300">I am pursuing a Bachelor of Science in Information Systems and Technology at United States International University – Africa (USIU-Africa) in Nairobi, Kenya. I am interested in combining technology, governance and innovation to solve practical problems.</p>
          <div><h3 className="font-semibold">Concentrations</h3><ul className="mt-2 flex flex-wrap gap-2">{['Forensic Information Technology','Cybersecurity and Cyber Crime'].map(c => <li key={c} className="rounded-full bg-[#E6D8C0] px-4 py-1.5 text-sm text-navy dark:bg-navy-700 dark:text-white">{c}</li>)}</ul>
            <h3 className="mt-6 font-semibold">Wider interests</h3><ul className="mt-2 flex flex-wrap gap-2">{['Data Policy and Governance','Artificial Intelligence','Digital Transformation','Information Systems Auditing','Technology and Innovation','Data Analytics and Research','Project Management'].map(c => <li key={c} className="rounded-full border border-navy/15 px-3 py-1 text-sm dark:border-white/20">{c}</li>)}</ul></div>
        </div></Section>

      <Section name="Projects" title="Projects" lead="Select a project to see the problem, solution, technologies and my role.">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{projects.map(p =>
          <button key={p.id} onClick={() => setOpen(p)} className="group overflow-hidden rounded-2xl border border-navy/10 bg-white text-left transition hover:-translate-y-1 hover:border-electric hover:shadow-xl dark:border-white/10 dark:bg-navy-800">
            <div className="relative grid h-36 place-items-center bg-gradient-to-br from-[#EADDC6] to-[#D5CDBE] dark:from-navy-700 dark:to-navy-800"><Icon name={p.icon} className="h-12 w-12 text-navy/80 dark:text-white/90 transition group-hover:scale-110" /></div>
            <div className="p-5"><h3 className="text-lg font-semibold">{p.title}{p.status && <span className="ml-2 rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-300">{p.status}</span>}</h3><p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{p.summary}</p>
              {p.tech.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{p.tech.map(t => <span key={t} className="rounded-full bg-electric/10 px-2.5 py-0.5 text-xs text-electric">{t}</span>)}</div>}
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-electric">View details<L.ArrowRight size={14} /></span></div>
          </button>)}</div></Section>

      <Section name="Skills" title="Technical skills" lead="Grouped by area of work.">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{skills.map(s => <div key={s.title} className="rounded-2xl bg-mist p-6 dark:bg-navy-800">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-electric shadow-sm dark:bg-navy-900"><Icon name={s.icon} /></span><h3 className="font-semibold">{s.title}</h3></div>
          <ul className="mt-4 flex flex-wrap gap-2">{s.items.map(i => <li key={i} className="rounded-lg bg-white px-3 py-1 text-sm dark:bg-navy-900">{i}</li>)}</ul></div>)}</div></Section>

      <Section name="Experience" title="Professional experience">
        <ol className="relative ml-3 border-l-2 border-electric/40">{experience.map(x => <li key={x.role} className="mb-10 ml-6">
          <span className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-4 border-white bg-electric dark:border-navy-900" />
          <p className="text-sm font-medium text-electric">{x.when}</p><h3 className="text-xl font-semibold">{x.role}</h3><p className="text-slate-500">{x.org}</p><p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">{x.text}</p></li>)}</ol></Section>

      <Section name="Exploring" title="Areas I'm exploring" lead="Topics beyond the code that shape how I approach problems.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{interests.map(i => <div key={i.t} tabIndex={0} className="group rounded-2xl border border-navy/10 p-5 transition hover:bg-mist focus:bg-mist dark:border-white/10 dark:hover:bg-navy-700">
          <Icon name={i.i} className="h-7 w-7 text-electric" /><h3 className="mt-3 font-semibold">{i.t}</h3><p className="mt-1 text-sm opacity-80">{i.d}</p></div>)}</div></Section>

      <Section name="Contact" title="Have an opportunity, project or idea? Let's connect and create something meaningful.">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <ul className="space-y-4">
            <li><a className="flex items-center gap-3 hover:text-electric" href={`mailto:${profile.email}`}><L.Mail />{profile.email}</a></li>
            <li><a className="flex items-center gap-3 hover:text-electric" href={profile.linkedin} target="_blank" rel="noreferrer"><L.Linkedin />linkedin.com/in/freshiah-mwaura</a></li>
            <li className="flex items-center gap-3"><L.MapPin />{profile.location}</li></ul>
          <form onSubmit={send} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">Name<input required name="name" autoComplete="name" className={field} /></label>
              <label className="text-sm font-medium">Email<input required type="email" name="email" autoComplete="email" className={field} /></label></div>
            <label className="block text-sm font-medium">Subject<input required name="subject" className={field} /></label>
            <label className="block text-sm font-medium">Message<textarea required name="message" rows={5} className={field} /></label>
            <button className={primary} type="submit"><L.Send size={16} />Send message</button>
            <p className="text-xs text-slate-500">This opens your email app with the message ready to send.</p></form>
        </div></Section>
    </main>
    <footer className="border-t border-navy/10 py-8 text-center text-sm text-slate-500 dark:border-white/10">© {new Date().getFullYear()} Freshiah Wangari Mwaura · Nairobi, Kenya</footer>
    <AnimatePresence>{open && <Modal p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
  </>
}
