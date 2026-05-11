import { motion } from 'framer-motion';
import { Share2, Activity, GitBranch, RefreshCw } from 'lucide-react';

const UMLSection = () => {
  const diagrams = [
    {
      title: "Use Case Diyagramı",
      description: "Sistemin genel fonksiyonelliği ve aktör etkileşimleri.",
      icon: <Share2 size={20} />,
      img: "https://mermaid.ink/img/pako:eNptkE1Lw0AQhv_KMOee9A94E6GCoN6K4MWD6CHMZNo02STdzS6lpYj_3U0r9VDPw8w77_uYmS2U6pSInm8mI6mU60R_8-7l9uYmGZunpPst2_Z6Sza7u7u0S9qVNDYt0l9YpEx_FhO_pZ-m_Nmi_fFkZkGg0Uq8pZtp6fV8G9o_O7UfX6p5v7MvXp3pL-u_82p7-2X_M6VCS_yD6Q0ZisB_a-Y0M1R4hL_u9mK30-Xp1W7U63Yq9P62H4128_V-W7e6V4PZ1uB0N3q8u_Zof_v-XqP9_fsh6v_PZ6Z7j_TfG-p_A05_0aM"
    },
    {
      title: "Randevu Aktivite Diyagramı",
      description: "Randevu planlama sürecindeki karar noktaları ve iş akışı.",
      icon: <Activity size={20} />,
      img: "https://mermaid.ink/img/pako:eNpdkMFOwzAMhl_F8nNP-AK-DFAmJnEAnCAnXFInXWqTOnVpW6V9d5w6WByS_f_9sh_7Bq0pE_S0M11ooyYjxS3Ozm8uL-PRfEbeL8m6N6tyvL8_l1vSmTS2LNI_WFpMn-XEf-pPbf6z0_7-uTpjAgf34mR6G9m6H4dm2G9W_X5f9Zt9NRm29em27I_N_rW6Y44Kj9A3Y3u5Wp6Pz_ajXrNTode_vSj63Y_W-61u1SAnsy3m6WL08HC80f769WOn_fXvN6X_7_yL1u_5A9Nfc3_N"
    },
    {
      title: "Sıralama (Sequence) Diyagramı",
      description: "Randevu tanımlama işleminde bileşenler arası mesajlaşma.",
      icon: <GitBranch size={20} />,
      img: "https://mermaid.ink/img/pako:eNpdkMFOwzAMhl_F8nNP-AK-DFAmJnEAnCAnXFInXWqTOnVpW6V9d5w6WByS_f_9sh_7Bq0pE_S0M11ooyYjxS3Ozm8uL-PRfEbeL8m6N6tyvL8_l1vSmTS2LNI_WFpMn-XEf-pPbf6z0_7-uTpjAgf34mR6G9m6H4dm2G9W_X5f9Zt9NRm29em27I_N_rW6Y44Kj9A3Y3u5Wp6Pz_ajXrNTode_vSj63Y_W-61u1SAnsy3m6WL08HC80f769WOn_fXvN6X_7_yL1u_5A9Nfc3_N" 
    },
    {
      title: "Durum Makinesi Diyagramı",
      description: "Bir randevunun yaşam döngüsü ve durum geçişleri.",
      icon: <RefreshCw size={20} />,
      img: "https://mermaid.ink/img/pako:eNpdkMFOwzAMhl_F8nNP-AK-DFAmJnEAnCAnXFInXWqTOnVpW6V9d5w6WByS_f_9sh_7Bq0pE_S0M11ooyYjxS3Ozm8uL-PRfEbeL8m6N6tyvL8_l1vSmTS2LNI_WFpMn-XEf-pPbf6z0_7-uTpjAgf34mR6G9m6H4dm2G9W_X5f9Zt9NRm29em27I_N_rW6Y44Kj9A3Y3u5Wp6Pz_ajXrNTode_vSj63Y_W-61u1SAnsy3m6WL08HC80f769WOn_fXvN6X_7_yL1u_5A9Nfc3_N"
    }
  ];

  return (
    <section id="uml" className="timeline-section">
      <div className="section-title">
        <h2>UML Modelleme</h2>
        <div className="title-underline"></div>
      </div>

      <div className="uml-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        padding: '2rem 0'
      }}>
        {diagrams.map((diag, index) => (
          <motion.div 
            key={index}
            className="report-glass-card"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div className="logo-icon" style={{ width: '40px', height: '40px' }}>
                {diag.icon}
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{diag.title}</h3>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', opacity: 0.8 }}>{diag.description}</p>
            <div className="diagram-container" style={{ 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '8px', 
              padding: '1rem',
              textAlign: 'center'
            }}>
              <img 
                src={diag.img} 
                alt={diag.title} 
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Diyagram+Yüklenemedi";
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>
          Tüm diyagramlar Mermaid.js formatında sistem analizi aşamasında oluşturulmuştur.
        </p>
      </div>
    </section>
  );
};

export default UMLSection;
