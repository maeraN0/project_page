class Patient {
  final int id;
  final String name;
  final String phone;
  final String tcNo;
  final String lastVisit;

  Patient({
    required this.id,
    required this.name,
    required this.phone,
    required this.tcNo,
    required this.lastVisit,
  });

  factory Patient.fromJson(Map<String, dynamic> json) {
    return Patient(
      id: json['id'],
      name: json['name'],
      phone: json['phone'] ?? '',
      tcNo: json['tc_no'] ?? '',
      lastVisit: json['last_visit'] ?? '',
    );
  }
}
