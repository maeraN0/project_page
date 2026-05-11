import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'services/api_service.dart';
import 'models/patient.dart';

void main() {
  runApp(const DentalApp());
}

class DentalApp extends StatelessWidget {
  const DentalApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DH-TAKİP',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF3B82F6),
          primary: const Color(0xFF3B82F6),
          surface: Colors.white,
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        textTheme: GoogleFonts.interTextTheme(),
        cardTheme: CardTheme(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(color: Colors.grey.shade200),
          ),
          color: Colors.white,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.grey.shade50,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide(color: Colors.grey.shade300),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide(color: Colors.grey.shade200),
          ),
        ),
      ),
      home: const AuthWrapper(),
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  bool _isLoggedIn = false;
  Map<String, dynamic>? _user;

  void _onLogin(Map<String, dynamic> data) {
    setState(() {
      _isLoggedIn = true;
      _user = data['user'];
    });
  }

  void _onLogout() {
    setState(() {
      _isLoggedIn = false;
      _user = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return _isLoggedIn 
        ? MainScreen(user: _user!, onLogout: _onLogout)
        : LoginScreen(onLogin: _onLogin);
  }
}

class LoginScreen extends StatefulWidget {
  final Function(Map<String, dynamic>) onLogin;
  const LoginScreen({super.key, required this.onLogin});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(text: 'admin@dhtakip.com');
  final _passwordController = TextEditingController(text: '123456');
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          width: 400,
          padding: const EdgeInsets.all(40),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 10))],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(LucideIcons.activity, size: 48, color: Color(0xFF3B82F6)),
              const SizedBox(height: 16),
              Text('DH-TAKİP', style: GoogleFonts.inter(fontSize: 28, fontWeight: FontWeight.w800, letterSpacing: -1, color: const Color(0xFF1E3A8A))),
              const SizedBox(height: 8),
              Text('Yönetim Paneline Giriş Yapın', style: TextStyle(color: Colors.grey.shade500)),
              const SizedBox(height: 40),
              TextField(controller: _emailController, decoration: const InputDecoration(labelText: 'E-posta')),
              const SizedBox(height: 16),
              TextField(controller: _passwordController, obscureText: true, decoration: const InputDecoration(labelText: 'Şifre')),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : () async {
                    setState(() => _isLoading = true);
                    try {
                      final data = await ApiService.login(_emailController.text, _passwordController.text);
                      widget.onLogin(data);
                    } catch (e) {
                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
                    } finally {
                      setState(() => _isLoading = false);
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF3B82F6),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    elevation: 0,
                  ),
                  child: _isLoading ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Text('Giriş Yap', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class MainScreen extends StatefulWidget {
  final Map<String, dynamic> user;
  final VoidCallback onLogout;
  const MainScreen({super.key, required this.user, required this.onLogout});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;
  
  @override
  Widget build(BuildContext context) {
    bool isDesktop = MediaQuery.of(context).size.width > 900;

    return Scaffold(
      body: Row(
        children: [
          if (isDesktop)
            Container(
              width: 260,
              color: Colors.white,
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Row(
                      children: [
                        const Icon(LucideIcons.activity, color: Color(0xFF3B82F6), size: 28),
                        const SizedBox(width: 12),
                        Text('DH-TAKİP', style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 20, color: const Color(0xFF1E3A8A))),
                      ],
                    ),
                  ),
                  Expanded(
                    child: ListView(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      children: [
                        _buildNavTile(0, LucideIcons.layoutDashboard, 'Panel'),
                        _buildNavTile(1, LucideIcons.users, 'Hastalar'),
                        _buildNavTile(2, LucideIcons.calendar, 'Randevular'),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(12)),
                      child: Row(
                        children: [
                          CircleAvatar(backgroundColor: Colors.blue.shade100, child: Text(widget.user['name'][0])),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(widget.user['name'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                Text(widget.user['role'], style: TextStyle(color: Colors.grey.shade600, fontSize: 11)),
                              ],
                            ),
                          ),
                          IconButton(icon: const Icon(LucideIcons.logOut, size: 18), onPressed: widget.onLogout),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          const VerticalDivider(width: 1, thickness: 1, color: Color(0xFFE2E8F0)),
          Expanded(
            child: Column(
              children: [
                AppBar(
                  backgroundColor: Colors.white,
                  elevation: 0,
                  title: Text(_selectedIndex == 0 ? 'Panel' : _selectedIndex == 1 ? 'Hastalar' : 'Randevular', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  centerTitle: false,
                ),
                Expanded(
                  child: IndexedStack(
                    index: _selectedIndex,
                    children: [
                      DashboardScreen(user: widget.user),
                      const PatientsScreen(),
                      const AppointmentsScreen(),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: isDesktop ? null : BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(LucideIcons.layoutDashboard), label: 'Panel'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.users), label: 'Hastalar'),
          BottomNavigationBarItem(icon: Icon(LucideIcons.calendar), label: 'Randevular'),
        ],
      ),
    );
  }

  Widget _buildNavTile(int index, IconData icon, String title) {
    bool isSelected = _selectedIndex == index;
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: ListTile(
        onTap: () => setState(() => _selectedIndex = index),
        leading: Icon(icon, color: isSelected ? const Color(0xFF3B82F6) : Colors.grey.shade600, size: 20),
        title: Text(title, style: TextStyle(color: isSelected ? const Color(0xFF3B82F6) : Colors.grey.shade700, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal, fontSize: 14)),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        selected: isSelected,
        selectedTileColor: const Color(0xFFEFF6FF),
      ),
    );
  }
}

class DashboardScreen extends StatelessWidget {
  final Map<String, dynamic> user;
  const DashboardScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Hoş Geldiniz, ${user['name']} 👋', style: GoogleFonts.inter(fontSize: 24, fontWeight: FontWeight.bold, color: const Color(0xFF1E3A8A))),
          const SizedBox(height: 24),
          Row(
            children: [
              _buildStatCard('Sistem Durumu', 'Aktif', const Color(0xFF3B82F6), LucideIcons.activity),
              const SizedBox(width: 16),
              _buildStatCard('Yetki Seviyesi', user['role'], const Color(0xFF10B981), LucideIcons.shieldCheck),
            ],
          ),
          const SizedBox(height: 40),
          const Card(
            child: Padding(
              padding: EdgeInsets.all(40.0),
              child: Center(
                child: Column(
                  children: [
                    Icon(LucideIcons.heartPulse, size: 48, color: Color(0xFFE2E8F0)),
                    SizedBox(height: 16),
                    Text('Klinik verileri yükleniyor...', style: TextStyle(color: Color(0xFF94A3B8))),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, String value, Color color, IconData icon) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(padding: const EdgeInsets.all(8), decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(8)), child: Icon(icon, color: color, size: 20)),
              const SizedBox(height: 16),
              Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              Text(title, style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
            ],
          ),
        ),
      ),
    );
  }
}

class PatientsScreen extends StatefulWidget {
  const PatientsScreen({super.key});

  @override
  State<PatientsScreen> createState() => _PatientsScreenState();
}

class _PatientsScreenState extends State<PatientsScreen> {
  late Future<List<Patient>> _patientsFuture;

  @override
  void initState() {
    super.initState();
    _refresh();
  }

  void _refresh() => setState(() {
    _patientsFuture = ApiService.fetchPatients();
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddPatientDialog(context),
        icon: const Icon(LucideIcons.plus),
        label: const Text('Yeni Hasta'),
        elevation: 2,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Card(
          child: FutureBuilder<List<Patient>>(
            future: _patientsFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
              if (snapshot.hasError) return Center(child: Text('Hata: ${snapshot.error}'));
              final patients = snapshot.data ?? [];
              return ListView.separated(
                itemCount: patients.length,
                separatorBuilder: (context, index) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final p = patients[index];
                  return ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                    leading: CircleAvatar(backgroundColor: Colors.grey.shade100, child: Text(p.name[0], style: const TextStyle(color: Color(0xFF3B82F6), fontWeight: FontWeight.bold))),
                    title: Text(p.name, style: const TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: Text('TC: ${p.tcNo}'),
                    trailing: Text(p.lastVisit, style: TextStyle(color: Colors.grey.shade500, fontSize: 12)),
                  );
                },
              );
            },
          ),
        ),
      ),
    );
  }

  void _showAddPatientDialog(BuildContext context) {
    final nameC = TextEditingController();
    final phoneC = TextEditingController();
    final tcC = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Yeni Hasta Kaydı'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nameC, decoration: const InputDecoration(labelText: 'Ad Soyad')),
            const SizedBox(height: 12),
            TextField(controller: phoneC, decoration: const InputDecoration(labelText: 'Telefon')),
            const SizedBox(height: 12),
            TextField(controller: tcC, decoration: const InputDecoration(labelText: 'TC No')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('İptal')),
          ElevatedButton(
            onPressed: () async {
              await ApiService.addPatient({'name': nameC.text, 'phone': phoneC.text, 'tc_no': tcC.text});
              Navigator.pop(context);
              _refresh();
            },
            child: const Text('Kaydet'),
          ),
        ],
      ),
    );
  }
}

class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({super.key});

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> {
  late Future<List<dynamic>> _apptFuture;

  @override
  void initState() {
    super.initState();
    _refresh();
  }

  void _refresh() => setState(() {
    _apptFuture = ApiService.fetchAppointments();
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddApptDialog(context),
        icon: const Icon(LucideIcons.calendarPlus),
        label: const Text('Randevu Planla'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Card(
          child: FutureBuilder<List<dynamic>>(
            future: _apptFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
              if (snapshot.hasError) return Center(child: Text('Hata: ${snapshot.error}'));
              final appts = snapshot.data ?? [];
              return ListView.separated(
                itemCount: appts.length,
                separatorBuilder: (context, index) => const Divider(height: 1),
                itemBuilder: (context, index) {
                  final a = appts[index];
                  return ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                    leading: const Icon(LucideIcons.clock, color: Color(0xFF64748B), size: 20),
                    title: Text(a['patient_name'], style: const TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: Text('${a['date']} @ ${a['time']}'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(20)),
                          child: Text(a['status'], style: const TextStyle(color: Color(0xFF3B82F6), fontSize: 11, fontWeight: FontWeight.bold)),
                        ),
                        const SizedBox(width: 8),
                        IconButton(icon: const Icon(LucideIcons.trash2, size: 18, color: Colors.redAccent), onPressed: () async {
                          if (await _confirm(context)) {
                            await ApiService.deleteAppointment(a['id']);
                            _refresh();
                          }
                        }),
                      ],
                    ),
                  );
                },
              );
            },
          ),
        ),
      ),
    );
  }

  Future<bool> _confirm(BuildContext context) async {
    return await showDialog(context: context, builder: (c) => AlertDialog(
      title: const Text('Emin misiniz?'),
      actions: [
        TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Hayır')),
        TextButton(onPressed: () => Navigator.pop(c, true), child: const Text('Evet')),
      ]
    )) ?? false;
  }

  void _showAddApptDialog(BuildContext context) async {
    final patients = await ApiService.fetchPatients();
    if (patients.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Önce hasta eklemelisiniz.')));
      return;
    }

    int? selectedId = patients.first.id;
    final dateC = TextEditingController(text: DateTime.now().toString().split(' ').first);
    final timeC = TextEditingController(text: '10:00');

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Yeni Randevu Planla'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<int>(
                value: selectedId,
                items: patients.map((p) => DropdownMenuItem(value: p.id, child: Text(p.name))).toList(),
                onChanged: (v) => setDialogState(() => selectedId = v),
                decoration: const InputDecoration(labelText: 'Hasta Seçin'),
              ),
              const SizedBox(height: 12),
              TextField(controller: dateC, decoration: const InputDecoration(labelText: 'Tarih (YYYY-MM-DD)')),
              const SizedBox(height: 12),
              TextField(controller: timeC, decoration: const InputDecoration(labelText: 'Saat (HH:MM)')),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('İptal')),
            ElevatedButton(
              onPressed: () async {
                await ApiService.addAppointment({
                  'patient_id': selectedId,
                  'date': dateC.text,
                  'time': timeC.text,
                  'status': 'Planlandı'
                });
                Navigator.pop(context);
                _refresh();
              },
              child: const Text('Planla'),
            ),
          ],
        ),
      ),
    );
  }
}
