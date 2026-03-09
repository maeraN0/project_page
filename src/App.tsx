import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Database, 
  Layout, 
  Server, 
  Stethoscope, 
  User,
  ArrowRight,
  Sun,
  Moon,
  Monitor,
  Target,
  Rocket,
  Shield
} from 'lucide-react';
import './App.css';
import { reports } from './data/reports';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 100 }
  }
};

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (theme === 'system') {
        root.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
      }
    };

    if (theme === 'system') {
      root.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }

    mediaQuery.addEventListener('change', handleChange);
    localStorage.setItem('theme', theme);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={20} />;
    if (theme === 'dark') return <Moon size={20} />;
    return <Monitor size={20} />;
  };

  const scrollToTimeline = () => {
    const element = document.getElementById('timeline');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToVision = () => {
    const element = document.getElementById('vision');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Proje genel ilerleme yüzdesi
  const overallProgress = 15;

  return (
    <div className="app">
      {/* Background Decorators */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <Stethoscope size={24} />
          </div>
          <span>DH-TAKİP</span>
        </div>
        <div className="nav-links">
          <a href="#vision" onClick={(e) => { e.preventDefault(); scrollToVision(); }}>Vizyon</a>
          <a href="#stats" onClick={(e) => { e.preventDefault(); document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' }); }}>İstatistikler</a>
          <a href="#timeline" onClick={(e) => { e.preventDefault(); scrollToTimeline(); }}>Günlük</a>
        </div>
        <div className="nav-actions">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title={`Tema: ${theme === 'system' ? 'Sistem' : theme === 'dark' ? 'Koyu' : 'Açık'}`}
          >
            {getThemeIcon()}
          </button>
          <a 
            href="https://github.com/maeraN0" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-contact"
            style={{ textDecoration: 'none' }}
          >
            Malik Ömer Ceylan <User size={16} />
          </a>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge-wrapper"
          >
            <span className="premium-badge">Sistem Analizi ve Tasarımı 2026</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Diş Hekimi <span>Hasta Takip Otomasyonu</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Klinik yönetiminde dijital dönüşüm: Verimlilik, hız ve güvenli veri takibi.
          </motion.p>

          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button className="btn-main" onClick={scrollToTimeline}>
              Projeyi İncele <ArrowRight size={18} />
            </button>
            <div className="hero-stats">
              <div className="stat-item">
                <strong>{reports.length}</strong>
                <span>Hafta</span>
              </div>
              <div className="stat-sep"></div>
              <div className="stat-item">
                <strong>{overallProgress}%</strong>
                <span>İlerleme</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* VISION SECTION */}
        <section id="vision" className="timeline-section" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="section-title">
            <h2>Vizyon ve Hedefler</h2>
            <div className="title-underline"></div>
          </div>
          <div className="tech-pills" style={{ justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
            <motion.div className="report-glass-card" style={{ maxWidth: '300px', textAlign: 'center' }} whileHover={{ y: -10 }}>
              <Target size={40} className="text-primary" style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
              <h3>Doğruluk</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Hatasız veri girişi ve güvenilir raporlama mekanizmaları.</p>
            </motion.div>
            <motion.div className="report-glass-card" style={{ maxWidth: '300px', textAlign: 'center' }} whileHover={{ y: -10 }}>
              <Rocket size={40} className="text-primary" style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
              <h3>Hız</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Hasta kayıt ve randevu işlemlerinde maksimum performans.</p>
            </motion.div>
            <motion.div className="report-glass-card" style={{ maxWidth: '300px', textAlign: 'center' }} whileHover={{ y: -10 }}>
              <Shield size={40} className="text-primary" style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
              <h3>Güvenlik</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>KVKK uyumlu veri saklama ve yetkilendirme sistemleri.</p>
            </motion.div>
          </div>
        </section>

        {/* PROGRESS DASHBOARD GRAPHICS */}
        <section id="stats" className="stats-dashboard">
          <motion.div 
            className="dashboard-card"
            whileHover={{ y: -5 }}
          >
            <div className="card-header">
              <h3>Genel Proje Sağlığı</h3>
              <Activity size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="progress-container">
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                ></motion.div>
              </div>
              <span className="progress-text">%{overallProgress} Tamamlandı</span>
            </div>
            <div className="tech-pills">
              <div className="pill"><Layout size={14} /> React</div>
              <div className="pill"><Server size={14} /> Node.js</div>
              <div className="pill"><Database size={14} /> PostgreSQL</div>
            </div>
          </motion.div>
        </section>

        {/* TIMELINE SECTION */}
        <section id="timeline" className="timeline-section">
          <div className="section-title">
            <h2>Proje Zaman Tüneli</h2>
            <div className="title-underline"></div>
          </div>

          <motion.div 
            className="timeline-container"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {reports.slice().reverse().map((report, index) => (
              <motion.div 
                key={report.id} 
                className="timeline-item"
                variants={itemVariants}
              >
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  {index !== reports.length - 1 && <div className="marker-line"></div>}
                </div>
                
                <div className="timeline-content">
                  <div className="report-glass-card">
                    <div className="report-meta">
                      <span className="week-tag">{report.week}</span>
                      <span className="date-tag"><Calendar size={14} /> {report.date}</span>
                    </div>
                    <h3>{report.title}</h3>
                    <p>{report.content}</p>
                    
                    <div className="tasks-grid">
                      {report.tasks.map((task, tIdx) => (
                        <div key={tIdx} className="task-pill">
                          <CheckCircle2 size={14} /> {task}
                        </div>
                      ))}
                    </div>

                    <div className="report-footer">
                      <span className={`status-tag ${report.status.toLowerCase().replace(' ', '-')}`}>
                        <Clock size={14} /> {report.status}
                      </span>
                      <button className="btn-detail">Detay <ChevronRight size={16} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      <footer className="modern-footer">
        <div className="footer-top">
          <div className="footer-info">
            <h4>DH-TAKİP</h4>
            <p>Malik Ömer Ceylan | Sistem Analizi ve Tasarımı</p>
          </div>
          <div className="footer-links">
            <a href="https://github.com/maeraN0" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/malik-%C3%B6mer-ceylan-36779b329/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="#timeline" onClick={(e) => { e.preventDefault(); scrollToTimeline(); }}>Raporlar</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
