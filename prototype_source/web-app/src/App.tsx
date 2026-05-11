import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Users, 
  Calendar, 
  Plus, 
  Search, 
  LayoutDashboard, 
  Activity,
  ClipboardList,
  LogOut,
  Edit,
  Trash2,
  X,
  CreditCard,
  Pill
} from 'lucide-react';
import './App.css';

interface Patient {
  id: number;
  name: string;
  phone: string;
  tc_no: string;
  last_visit: string;
}

interface Appointment {
  id: number;
  patient_id: number;
  patient_name: string;
  doctor_name: string;
  date: string;
  time: string;
  status: string;
}

interface User {
  id: number;
  name: string;
  role: string;
  email: string;
}

const API_URL = 'http://localhost:3001/api';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const [loginForm, setLoginForm] = useState({ email: 'admin@dhtakip.com', password: '123456' });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);

  const [patientForm, setPatientForm] = useState({ name: '', phone: '', tc_no: '' });
  const [apptForm, setApptForm] = useState({ patient_id: '', doctor_id: '', date: '', time: '', status: 'Beklemede' });

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchData();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, loginForm);
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Giriş başarısız.');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const patientsRes = await axios.get(`${API_URL}/patients`);
      const appointmentsRes = await axios.get(`${API_URL}/appointments`);
      setPatients(patientsRes.data);
      setAppointments(appointmentsRes.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Veri çekme hatası:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
      setLoading(false);
    }
  };

  // --- Filtering Logic (Search) ---
  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.tc_no.includes(searchTerm) ||
      p.phone.includes(searchTerm)
    );
  }, [patients, searchTerm]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => 
      a.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.date.includes(searchTerm)
    );
  }, [appointments, searchTerm]);

  // --- Patient Functions ---
  const openPatientModal = (patient: Patient | null = null) => {
    if (patient) {
      setEditingPatient(patient);
      setPatientForm({ name: patient.name, phone: patient.phone, tc_no: patient.tc_no });
    } else {
      setEditingPatient(null);
      setPatientForm({ name: '', phone: '', tc_no: '' });
    }
    setIsPatientModalOpen(true);
  };

  const closePatientModal = () => setIsPatientModalOpen(false);

  const savePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await axios.put(`${API_URL}/patients/${editingPatient.id}`, patientForm);
      } else {
        await axios.post(`${API_URL}/patients`, patientForm);
      }
      closePatientModal();
      fetchData();
    } catch (error: any) {
      alert(`Kayıt sırasında bir hata oluştu: ${error.response?.data?.error || error.message}`);
    }
  };

  const deletePatient = async (id: number) => {
    if (window.confirm('Bu hastayı silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`${API_URL}/patients/${id}`);
        fetchData();
      } catch (error: any) {
        alert(`Silme işlemi başarısız: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  // --- Appointment Functions ---
  const openApptModal = (appt: Appointment | null = null) => {
    if (appt) {
      setEditingAppt(appt);
      setApptForm({ 
        patient_id: appt.patient_id.toString(),
        doctor_id: '',
        date: appt.date, 
        time: appt.time, 
        status: appt.status 
      });
    } else {
      setEditingAppt(null);
      setApptForm({ 
        patient_id: patients.length > 0 ? patients[0].id.toString() : '',
        doctor_id: user?.role === 'Hekim' ? user.id.toString() : '',
        date: new Date().toISOString().split('T')[0], 
        time: '09:00', 
        status: 'Beklemede' 
      });
    }
    setIsApptModalOpen(true);
  };

  const closeApptModal = () => setIsApptModalOpen(false);

  const saveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAppt) {
        await axios.put(`${API_URL}/appointments/${editingAppt.id}`, apptForm);
      } else {
        await axios.post(`${API_URL}/appointments`, apptForm);
      }
      closeApptModal();
      fetchData();
    } catch (error: any) {
      alert(`Randevu kaydedilirken hata: ${error.response?.data?.error || error.message}`);
    }
  };

  const deleteAppointment = async (id: number) => {
    if (window.confirm('Randevuyu iptal etmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`${API_URL}/appointments/${id}`);
        fetchData();
      } catch (error: any) {
        alert(`Hata: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  if (!token || !user) {
    return (
      <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f4f8' }}>
        <div className="login-box" style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1e3a8a' }}>DH-TAKİP Giriş</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label>E-posta</label>
              <input 
                type="email" 
                value={loginForm.email} 
                onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label>Şifre</label>
              <input 
                type="password" 
                value={loginForm.password} 
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </div>
            <button type="submit" style={{ padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Giriş Yap</button>
          </form>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '15px', textAlign: 'center' }}>Test Bilgileri: admin@dhtakip.com / 123456</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Activity color="#3b82f6" size={32} />
          <span>DH-TAKİP</span>
        </div>
        <nav className="nav-menu">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Panel
          </button>
          <button className={activeTab === 'patients' ? 'active' : ''} onClick={() => setActiveTab('patients')}>
            <Users size={20} /> Hastalar
          </button>
          <button className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>
            <Calendar size={20} /> Randevular
          </button>
          {['Hekim', 'Admin'].includes(user.role) && (
            <>
              <button className={activeTab === 'treatments' ? 'active' : ''} onClick={() => setActiveTab('treatments')}>
                <ClipboardList size={20} /> Tedaviler
              </button>
              <button className={activeTab === 'prescriptions' ? 'active' : ''} onClick={() => setActiveTab('prescriptions')}>
                <Pill size={20} /> Reçeteler
              </button>
            </>
          )}
          {['Sekreter', 'Admin', 'Hekim'].includes(user.role) && (
            <button className={activeTab === 'payments' ? 'active' : ''} onClick={() => setActiveTab('payments')}>
              <CreditCard size={20} /> Ödemeler
            </button>
          )}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Hasta veya randevu ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="user-profile">
            <div className="avatar">{user.name.charAt(0)}</div>
            <span>{user.name} ({user.role})</span>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="dashboard-view fade-in">
            <h1>Hoş Geldiniz, {user.name}</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue"><Users /></div>
                <div className="stat-info">
                  <h3>{patients.length}</h3>
                  <p>Toplam Hasta</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><Calendar /></div>
                <div className="stat-info">
                  <h3>{appointments.length}</h3>
                  <p>Toplam Randevu</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Son Randevular</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Hasta</th>
                      <th>Hekim</th>
                      <th>Tarih / Saat</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 5).map(app => (
                      <tr key={app.id}>
                        <td>{app.patient_name}</td>
                        <td>{app.doctor_name}</td>
                        <td>{app.date} {app.time}</td>
                        <td><span className={`badge ${app.status.toLowerCase().replace('ı', 'i')}`}>{app.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="patients-view fade-in">
            <div className="view-header">
              <h1>Hasta Listesi {searchTerm && <span style={{fontSize: '14px', color: '#666'}}>(Filtrelendi: {searchTerm})</span>}</h1>
              {['Sekreter', 'Admin'].includes(user.role) && (
                <button className="add-btn" onClick={() => openPatientModal()}><Plus size={18} /> Yeni Hasta</button>
              )}
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Ad Soyad</th>
                    <th>TC Kimlik No</th>
                    <th>Telefon</th>
                    <th>Son Muayene</th>
                    {['Sekreter', 'Admin'].includes(user.role) && <th>İşlemler</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map(p => (
                    <tr key={p.id}>
                      <td className="patient-name-cell"><div className="initials">{p.name.charAt(0)}</div>{p.name}</td>
                      <td>{p.tc_no}</td>
                      <td>{p.phone}</td>
                      <td>{p.last_visit}</td>
                      {['Sekreter', 'Admin'].includes(user.role) && (
                        <td className="actions-cell">
                          <button className="action-icon-btn text-blue" onClick={() => openPatientModal(p)}><Edit size={16} /></button>
                          <button className="action-icon-btn text-red" onClick={() => deletePatient(p.id)}><Trash2 size={16} /></button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {filteredPatients.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>Aranan kriterlere uygun hasta bulunamadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="appointments-view fade-in">
            <div className="view-header">
              <h1>Randevular {searchTerm && <span style={{fontSize: '14px', color: '#666'}}>(Filtrelendi: {searchTerm})</span>}</h1>
              {['Sekreter', 'Admin'].includes(user.role) && (
                <button className="add-btn" onClick={() => openApptModal()}><Plus size={18} /> Yeni Randevu</button>
              )}
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Hasta</th>
                    <th>Hekim</th>
                    <th>Tarih / Saat</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(app => (
                    <tr key={app.id}>
                      <td>{app.patient_name}</td>
                      <td>{app.doctor_name}</td>
                      <td>{app.date} {app.time}</td>
                      <td><span className={`badge ${app.status.toLowerCase().replace('ı', 'i')}`}>{app.status}</span></td>
                      <td className="actions-cell">
                        <button className="action-icon-btn text-blue" onClick={() => openApptModal(app)}><Edit size={16} /></button>
                        {['Sekreter', 'Admin'].includes(user.role) && (
                          <button className="action-icon-btn text-red" onClick={() => deleteAppointment(app.id)}><Trash2 size={16} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>Aranan kriterlere uygun randevu bulunamadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(activeTab === 'treatments' || activeTab === 'prescriptions' || activeTab === 'payments') && (
          <div className="placeholder-view fade-in" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <ClipboardList size={48} color="#cbd5e1" style={{ marginBottom: '20px' }} />
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Modülü</h2>
            <p>Bu modülün arayüzü Prisma veritabanı modeline uygun olarak (UC-03, UC-04, UC-05) backend'de hazırlandı.</p>
            <p>React bileşenleri yakında buraya entegre edilebilir.</p>
          </div>
        )}
      </main>

      {/* Patient Modal */}
      {isPatientModalOpen && (
        <div className="modal-overlay" onClick={closePatientModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPatient ? 'Hastayı Düzenle' : 'Yeni Hasta Ekle'}</h2>
              <button className="close-btn" onClick={closePatientModal}><X size={24} /></button>
            </div>
            <form onSubmit={savePatient}>
              <div className="form-group">
                <label>Ad Soyad</label>
                <input 
                  type="text" 
                  required 
                  autoFocus
                  value={patientForm.name} 
                  onChange={e => setPatientForm({...patientForm, name: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Telefon</label>
                <input 
                  type="text" 
                  value={patientForm.phone} 
                  onChange={e => setPatientForm({...patientForm, phone: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>TC Kimlik No</label>
                <input 
                  type="text" 
                  value={patientForm.tc_no} 
                  onChange={e => setPatientForm({...patientForm, tc_no: e.target.value})} 
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closePatientModal}>İptal</button>
                <button type="submit" className="btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {isApptModalOpen && (
        <div className="modal-overlay" onClick={closeApptModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAppt ? 'Randevuyu Düzenle' : 'Yeni Randevu'}</h2>
              <button className="close-btn" onClick={closeApptModal}><X size={24} /></button>
            </div>
            <form onSubmit={saveAppointment}>
              <div className="form-group">
                <label>Hasta</label>
                <select required value={apptForm.patient_id} onChange={e => setApptForm({...apptForm, patient_id: e.target.value})}>
                  <option value="" disabled>Hasta Seçiniz</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Hekim ID (Opsiyonel)</label>
                <input type="number" value={apptForm.doctor_id} onChange={e => setApptForm({...apptForm, doctor_id: e.target.value})} placeholder="Hekim ID'si" />
              </div>
              <div className="form-group">
                <label>Tarih / Saat</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="date" required value={apptForm.date} onChange={e => setApptForm({...apptForm, date: e.target.value})} />
                  <input type="time" required value={apptForm.time} onChange={e => setApptForm({...apptForm, time: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Durum</label>
                <select value={apptForm.status} onChange={e => setApptForm({...apptForm, status: e.target.value})}>
                  <option value="Beklemede">Beklemede</option>
                  <option value="Planlandı">Planlandı</option>
                  <option value="Tamamlandı">Tamamlandı</option>
                  <option value="İptal">İptal Edildi</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeApptModal}>İptal</button>
                <button type="submit" className="btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading && <div style={{position: 'fixed', bottom: '20px', right: '20px', background: '#3b82f6', color: 'white', padding: '10px 20px', borderRadius: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', fontSize: '12px'}}>Veriler Güncelleniyor...</div>}
    </div>
  );
}

export default App;
