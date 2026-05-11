import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/patient.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3001/api';
  static String? _token;

  static void setToken(String token) {
    _token = token;
  }

  static Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_token != null) 'Authorization': 'Bearer $_token',
  };

  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      _token = data['token'];
      return data;
    } else {
      throw Exception(data['error'] ?? 'Giriş başarısız');
    }
  }

  static Future<List<Patient>> fetchPatients() async {
    final response = await http.get(Uri.parse('$baseUrl/patients'), headers: _headers);
    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body.map((dynamic item) => Patient.fromJson(item)).toList();
    } else {
      throw Exception('Hastalar yüklenemedi');
    }
  }

  static Future<void> addPatient(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/patients'),
      headers: _headers,
      body: jsonEncode(data),
    );
    if (response.statusCode != 200) throw Exception('Hasta eklenemedi');
  }

  static Future<List<dynamic>> fetchAppointments() async {
    final response = await http.get(Uri.parse('$baseUrl/appointments'), headers: _headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Randevular yüklenemedi');
    }
  }

  static Future<void> addAppointment(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/appointments'),
      headers: _headers,
      body: jsonEncode(data),
    );
    if (response.statusCode != 200) throw Exception('Randevu eklenemedi');
  }

  static Future<void> deleteAppointment(int id) async {
    final response = await http.delete(Uri.parse('$baseUrl/appointments/$id'), headers: _headers);
    if (response.statusCode != 200) throw Exception('Randevu silinemedi');
  }
}
