import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Single-file React component portfolio for Raj Kori
// TailwindCSS classes are used for styling (assumes Tailwind configured in project)
// Uses Unsplash dynamic images for mechanical backgrounds

export default function RajKoriPortfolio() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      document.body.style.background = "var(--bg)";
    } else {
      root.classList.remove("dark");
      document.body.style.background = "var(--bg-light)";
    }
  }, [dark]);

  const heroBg = "https://source.unsplash.com/1600x900/?mechanical,gears,engineering";
  const sectionBg1 = "https://source.unsplash.com/1600x900/?factory,workshop,machinery";
  const sectionBg2 = "https://source.unsplash.com/1600x900/?engine,metal,industrial";

  const gearVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="font-sans text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* page root vars (Tailwind should include dark mode class strategy 'class') */}
      <style>{`
        :root{ --bg: #0b1020; --card:#0f1724; --accent:#1f6feb; --bg-light:#f6f8fb }
        .dark .glass{ background: rgba(255,255,255,0.04); backdrop-filter: blur(6px); }
        .glass{ background: rgba(255,255,255,0.06); }
        .gear-float{ animation: floatGear 6s ease-in-out infinite; }
        @keyframes floatGear{ 0%{ transform: translateY(0) rotate(0deg)} 50%{ transform: translateY(-12px) rotate(15deg)} 100%{ transform: translateY(0) rotate(0deg)} }
      `}</style>

      {/* Top navigation / toggle */}
      <nav className="fixed w-full z-40 top-4 left-0 px-6 flex justify-between items-center">
        <div className="glass rounded-2xl px-4 py-2 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-bold">RK</div>
          <div>
            <div className="text-sm font-semibold">Raj Kori</div>
            <div className="text-xs opacity-70">Mechanical Engineer • Eicher</div>
          </div>
        </div>

        <div className="glass rounded-2xl px-3 py-2 flex items-center gap-3">
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            className="flex items-center gap-2 px-3 py-1 rounded-full hover:scale-105 transition-transform"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <span className="text-sm">{dark ? 'Dark' : 'Light'}</span>
          </button>

          <a href="#contact" className="hidden md:inline-block text-sm px-3 py-1 rounded-lg bg-indigo-600 text-white">Contact</a>
        </div>
      </nav>

      {/* HERO Section */}
      <header className="min-h-screen flex items-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-75"
          style={{ backgroundImage: `url(${heroBg})`, zIndex: -2 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 dark:to-black/70" style={{ zIndex: -1 }} />

        <div className="container mx-auto px-6 py-28">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Raj Kori
                <div className="text-xl font-medium mt-2 opacity-80">Mechanical Engineer at Eicher • 2+ years</div>
              </h1>

              <p className="mt-6 max-w-xl opacity-90 text-lg">I design and optimise mechanical systems with a strong focus on manufacturability, reliability and sustainable performance. I love turning complex engineering constraints into elegant, producible solutions.</p>

              <div className="mt-8 flex gap-4">
                <a href="#projects" className="px-5 py-3 rounded-lg bg-white dark:bg-indigo-600 text-black dark:text-white font-semibold shadow hover:scale-105 transition-transform">View Projects</a>
                <a href="#contact" className="px-5 py-3 rounded-lg border border-white/20 glass text-sm">Hire / Contact</a>
              </div>

              <div className="mt-8 flex items-center gap-6">
                <div className="text-sm opacity-80">Key skills</div>
                <div className="flex gap-3">
                  <span className="px-3 py-1 rounded-full glass text-xs">CAD (Creo, SolidWorks)</span>
                  <span className="px-3 py-1 rounded-full glass text-xs">FEA</span>
                  <span className="px-3 py-1 rounded-full glass text-xs">GD&T</span>
                </div>
              </div>
            </motion.div>

            {/* Hero right visual - floating gears */}
            <motion.div className="hidden md:flex justify-center items-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9 }}>
              <div className="relative w-80 h-80">
                <img src={heroBg} alt="mechanical background" className="w-full h-full object-cover rounded-2xl shadow-2xl" />

                <svg className="absolute -left-6 -top-6 w-28 h-28 gear-float" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(10,10)">
                    <circle cx="40" cy="40" r="18" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
                    <path d="M40 0 L45 12 L55 10 L60 22 L72 25 L70 35 L82 40 L70 45 L72 57 L60 60 L55 72 L45 70 L40 82 L35 70 L25 72 L20 60 L8 57 L10 45 L-2 40 L10 35 L8 25 L20 22 L25 10 L35 12 Z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="rgba(255,255,255,0.03)" />
                  </g>
                </svg>

              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Experience / Timeline Section with parallax backgrounds */}
      <section className="py-20 relative" style={{ backgroundImage: `url(${sectionBg1})`, backgroundAttachment: 'fixed', backgroundSize: 'cover' }}>
        <div className="backdrop-blur-sm" style={{ background: 'rgba(2,6,23,0.5)' }}>
          <div className="container mx-auto px-6 py-16">
            <motion.h2 className="text-3xl font-bold mb-6" initial="hidden" animate="show" variants={gearVariants}>Experience</motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass rounded-xl p-6 shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-xl">Mechanical Engineer — Eicher</h3>
                    <p className="text-sm opacity-80">Jun 2022 — Present (2+ years)</p>
                  </div>
                  <div className="text-sm font-medium">Full-time</div>
                </div>

                <ul className="mt-4 list-disc pl-5 space-y-2 text-sm opacity-90">
                  <li>Designed and validated drivetrain components for commercial vehicles resulting in improved durability.</li>
                  <li>Led tolerance stack-up and GD&amp;T workstreams to reduce manufacturing rework by ~12%.</li>
                  <li>Collaborated with suppliers to scale prototypes to production while meeting cost targets.</li>
                </ul>
              </div>

              <div className="glass rounded-xl p-6 shadow">
                <h3 className="font-semibold text-xl">Internships & Projects</h3>
                <p className="text-sm opacity-80 mt-1">Academic and early-career projects focused on thermal systems, bracket optimisation and fatigue life prediction.</p>

                <div className="mt-4 flex flex-col gap-3 text-sm">
                  <div className="p-3 rounded-md bg-white/5">Lightweighted a mounting bracket — 15% mass reduction (FEA + manufacturability)</div>
                  <div className="p-3 rounded-md bg-white/5">Thermal analysis for cooling system — improved heat rejection by 8%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24">
        <div className="container mx-auto px-6">
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-8">Selected Projects</motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((n)=> (
              <motion.div key={n} whileHover={{ scale: 1.03 }} className="rounded-xl overflow-hidden shadow-lg glass p-4">
                <div className="h-40 bg-cover bg-center rounded-md" style={{ backgroundImage: `url(https://source.unsplash.com/800x600/?mechanical,machinery,gear,part,${n})` }} />
                <h4 className="mt-4 font-semibold">Project {n}: Component Optimization</h4>
                <p className="text-sm opacity-80 mt-2">FEA-driven redesign focusing on weight, cost and cycle life.</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs opacity-80">Tools: Creo, ANSYS</span>
                  <a className="text-sm underline" href="#">Details</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Tools */}
      <section className="py-20" style={{ backgroundImage: `url(${sectionBg2})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container mx-auto px-6">
          <div className="glass rounded-2xl p-8 shadow">
            <h3 className="text-2xl font-bold">Skills & Tools</h3>
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold">Design</h4>
                <p className="text-sm opacity-80 mt-2">Creo, SolidWorks, Sheet metal design, GD&amp;T</p>
              </div>
              <div>
                <h4 className="font-semibold">Analysis</h4>
                <p className="text-sm opacity-80 mt-2">ANSYS, FEA, NVH basics, Fatigue analysis</p>
              </div>
              <div>
                <h4 className="font-semibold">Manufacturing</h4>
                <p className="text-sm opacity-80 mt-2">DFM, supplier collaboration, tolerance control</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Footer */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="glass rounded-xl p-8 shadow">
              <h3 className="text-2xl font-bold">Let's connect</h3>
              <p className="text-sm opacity-80 mt-2">Open to collaboration, freelance consulting and full-time roles.</p>

              <form className="mt-6 grid gap-3">
                <input className="p-3 rounded-md bg-transparent border border-white/10" placeholder="Your name" />
                <input className="p-3 rounded-md bg-transparent border border-white/10" placeholder="Email" />
                <textarea className="p-3 rounded-md bg-transparent border border-white/10" rows={4} placeholder="Message (project details)"></textarea>
                <div className="flex gap-3">
                  <button type="button" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Send</button>
                  <a href="#" className="px-4 py-2 rounded-lg border">Download Resume</a>
                </div>
              </form>
            </div>

            <div className="text-sm">
              <h4 className="font-semibold">Contact</h4>
              <p className="opacity-80 mt-2">Eicher Motors (current) • Pune / Available for relocation</p>
              <p className="mt-4">Email: <a className="underline" href="mailto:raj.kori@example.com">raj.kori@example.com</a></p>
              <p className="mt-2">LinkedIn: <a className="underline" href="#">linkedin.com/in/raj-kori</a></p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center opacity-80">
        <div className="container mx-auto px-6">© {new Date().getFullYear()} Raj Kori — Mechanical Engineer • Eicher</div>
      </footer>
    </div>
  );
}
