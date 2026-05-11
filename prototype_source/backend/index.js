const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3001;

// "PrismaClient" requires either adapter or datasourceUrl based on recent versions if not auto-inferred
const prisma = new PrismaClient();

const JWT_SECRET = 'super-secret-key-123'; // Gerçek uygulamada .env'de olmalıdır

app.use(cors());
app.use(bodyParser.json());

// --- SEED DATABASE ---
// Veritabanı boşsa varsayılan Admin/Hekim oluşturur
async function seedDatabase() {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
        const hashedPassword = await bcrypt.hash('123456', 10);
        await prisma.user.createMany({
            data: [
                { name: 'Admin', email: 'admin@dhtakip.com', password: hashedPassword, role: 'Admin' },
                { name: 'Dr. Ahmet', email: 'doktor@dhtakip.com', password: hashedPassword, role: 'Hekim' },
                { name: 'Sekreter Ayşe', email: 'sekreter@dhtakip.com', password: hashedPassword, role: 'Sekreter' }
            ]
        });
        console.log('Örnek kullanıcılar (Admin, Hekim, Sekreter) oluşturuldu. Şifre: 123456');
    }
}
seedDatabase();

// --- MIDDLEWARE ---
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'Token gerekli.' });

    try {
        const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET); // "Bearer TOKEN" formatı
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Geçersiz token.' });
    }
};

// Sadece belirli rollere izin veren middleware
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Yetkisiz erişim.' });
        }
        next();
    };
};

// --- AUTH API ---
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Hatalı şifre.' });

        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '12h' });
        res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PATIENTS API ---
// Hem Sekreter hem Hekim görebilir
app.get('/api/patients', verifyToken, async (req, res) => {
    try {
        const patients = await prisma.patient.findMany();
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/patients', verifyToken, authorizeRole(['Sekreter', 'Admin']), async (req, res) => {
    const { name, phone, tc_no } = req.body;
    try {
        const newPatient = await prisma.patient.create({
            data: {
                name,
                phone,
                tc_no,
                last_visit: new Date().toISOString().split('T')[0]
            }
        });
        res.json(newPatient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/patients/:id', verifyToken, authorizeRole(['Sekreter', 'Admin']), async (req, res) => {
    try {
        const updated = await prisma.patient.update({
            where: { id: Number(req.params.id) },
            data: req.body
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/patients/:id', verifyToken, authorizeRole(['Sekreter', 'Admin']), async (req, res) => {
    try {
        await prisma.patient.delete({ where: { id: Number(req.params.id) } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- APPOINTMENTS API ---
app.get('/api/appointments', verifyToken, async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            include: { patient: true, doctor: true }
        });
        const formatted = appointments.map(app => ({
            ...app,
            patient_name: app.patient.name,
            doctor_name: app.doctor ? app.doctor.name : 'Belirtilmedi'
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/appointments', verifyToken, authorizeRole(['Sekreter', 'Admin']), async (req, res) => {
    const { patient_id, doctor_id, date, time, status } = req.body;
    try {
        const newAppt = await prisma.appointment.create({
            data: {
                patient_id: Number(patient_id),
                doctor_id: doctor_id ? Number(doctor_id) : null,
                date,
                time,
                status: status || 'Beklemede'
            }
        });
        res.json(newAppt);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/appointments/:id', verifyToken, authorizeRole(['Sekreter', 'Admin', 'Hekim']), async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.patient_id) data.patient_id = Number(data.patient_id);
        if (data.doctor_id) data.doctor_id = Number(data.doctor_id);
        
        const updated = await prisma.appointment.update({
            where: { id: Number(req.params.id) },
            data
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/appointments/:id', verifyToken, authorizeRole(['Sekreter', 'Admin']), async (req, res) => {
    try {
        await prisma.appointment.delete({ where: { id: Number(req.params.id) } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- TREATMENTS API (UC-03) ---
app.get('/api/treatments', verifyToken, async (req, res) => {
    try {
        const treatments = await prisma.treatment.findMany({ include: { patient: true, doctor: true } });
        res.json(treatments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/treatments', verifyToken, authorizeRole(['Hekim', 'Admin']), async (req, res) => {
    const { patient_id, tooth_number, description, cost } = req.body;
    try {
        const treatment = await prisma.treatment.create({
            data: {
                patient_id: Number(patient_id),
                doctor_id: req.user.id, // Hekimin kendi ID'si
                tooth_number,
                description,
                cost: Number(cost || 0),
                date: new Date().toISOString().split('T')[0]
            }
        });
        res.json(treatment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PRESCRIPTIONS API (UC-04) ---
app.get('/api/prescriptions', verifyToken, async (req, res) => {
    try {
        const pres = await prisma.prescription.findMany({ include: { patient: true, doctor: true } });
        res.json(pres);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/prescriptions', verifyToken, authorizeRole(['Hekim', 'Admin']), async (req, res) => {
    const { patient_id, details } = req.body;
    try {
        const prescription = await prisma.prescription.create({
            data: {
                patient_id: Number(patient_id),
                doctor_id: req.user.id,
                details,
                date: new Date().toISOString().split('T')[0]
            }
        });
        res.json(prescription);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PAYMENTS API (UC-05) ---
app.get('/api/payments', verifyToken, authorizeRole(['Sekreter', 'Admin', 'Hekim']), async (req, res) => {
    try {
        const payments = await prisma.payment.findMany({ include: { patient: true } });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/payments', verifyToken, authorizeRole(['Sekreter', 'Admin']), async (req, res) => {
    const { patient_id, treatment_id, amount, method } = req.body;
    try {
        const payment = await prisma.payment.create({
            data: {
                patient_id: Number(patient_id),
                treatment_id: treatment_id ? Number(treatment_id) : null,
                amount: Number(amount),
                method: method || 'Nakit',
                date: new Date().toISOString().split('T')[0]
            }
        });
        res.json(payment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend sunucusu http://localhost:${PORT} adresinde Prisma ORM ile çalışıyor.`);
});
