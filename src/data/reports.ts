export interface ProjectReport {
  id: number;
  week: string;
  date: string;
  title: string;
  content: string;
  status: 'Tamamlandı' | 'Devam Ediyor' | 'Planlandı';
  tasks: string[];
}

export const reports: ProjectReport[] = [
  {
    id: 1,
    week: "Hafta 1",
    date: "9 Mart 2026",
    title: "Proje Başlangıcı ve Teknoloji Seçimi",
    content: "Sistem Analizi ve Tasarımı dersi kapsamında 'Diş Hekimi Hasta Takip Otomasyonu' projesi başlatıldı. Projenin kapsamı, hedefleri ve kullanılacak teknolojiler belirlendi. Modern bir web mimarisi (React + Node.js + PostgreSQL) üzerinden ilerlenmesine karar verildi.",
    status: "Tamamlandı",
    tasks: [
        "Proje konusunun netleştirilmesi",
        "Pazar araştırması ve ihtiyaç analizi",
        "Teknoloji yığını (Stack) seçimi",
        "Proje ilerleme blogunun kurulması"
    ]
  },
  {
    id: 2,
    week: "Hafta 2",
    date: "16 Mart 2026",
    title: "UML Modelleme ve Sistem Analizi",
    content: "Projenin kavramsal tasarımı için gerekli UML diyagramları oluşturuldu. Aktörler, kullanım durumları (Use Case), iş akışları (Activity) ve sistem etkileşimleri (Sequence) detaylandırıldı. Veri tabanı durum geçişleri planlandı.",
    status: "Tamamlandı",
    tasks: [
        "Aktörlerin ve Use Case listesinin belirlenmesi",
        "Use Case diyagramının çizilmesi",
        "Süreçler için Aktivite ve Sıralama diyagramlarının hazırlanması",
        "Durum Makinesi diyagramının oluşturulması",
        "Sistem Analizi raporunun tamamlanması"
    ]
  }
];
