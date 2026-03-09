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
  ArrowRight
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
  // Proje genel ilerleme yüzdesi (Haftalara göre dinamik hesaplanabilir, şimdilik manuel %15)
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
          <a href="#about">Vizyon</a>
          <a href="#stats">İstatistikler</a>
          <a href="#timeline">Günlük</a>
          <button className="btn-contact">
            Malik Ömer Ceylan <User size={16} />
          </button>
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
            <button className="btn-main">Projeyi İncele <ArrowRight size={18} /></button>
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

        {/* PROGRESS DASHBOARD GRAPHICS */}
        <section id="stats" className="stats-dashboard">
          <motion.div 
            className="dashboard-card"
            whileHover={{ y: -5 }}
          >
            <div className="card-header">
              <h3>Genel Proje Sağlığı</h3>
              <Activity size={20} className="text-primary" />
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
            <a href="#">GitHub</a>
            <a href="#">LinkedIn</a>
            <a href="#">Raporlar</a>
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
