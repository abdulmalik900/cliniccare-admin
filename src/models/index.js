/**
 * MVVM Models — pure data structures with factory helpers.
 * These define the shape of every domain entity used in ClinicCare.
 */

let _id = 1
export const nextId = (prefix = '') => `${prefix}${(_id++).toString().padStart(4, '0')}`

export const createPatient = (p = {}) => ({
  id: p.id ?? nextId('PT-'),
  name: p.name ?? '',
  age: p.age ?? 0,
  gender: p.gender ?? 'Male',
  phone: p.phone ?? '',
  email: p.email ?? '',
  bloodGroup: p.bloodGroup ?? 'O+',
  address: p.address ?? '',
  registeredOn: p.registeredOn ?? new Date().toISOString(),
  lastVisit: p.lastVisit ?? null,
  status: p.status ?? 'Active', // Active | Inactive
  avatar: p.avatar ?? null,
  condition: p.condition ?? 'General Checkup',
})

export const createDoctor = (d = {}) => ({
  id: d.id ?? nextId('DR-'),
  name: d.name ?? '',
  specialization: d.specialization ?? '',
  department: d.department ?? '',
  phone: d.phone ?? '',
  email: d.email ?? '',
  experience: d.experience ?? 0,
  rating: d.rating ?? 4.5,
  patients: d.patients ?? 0,
  status: d.status ?? 'Available', // Available | On Leave | Busy
  avatar: d.avatar ?? null,
  fee: d.fee ?? 0,
})

export const createAppointment = (a = {}) => ({
  id: a.id ?? nextId('AP-'),
  patientId: a.patientId ?? '',
  patientName: a.patientName ?? '',
  doctorId: a.doctorId ?? '',
  doctorName: a.doctorName ?? '',
  date: a.date ?? new Date().toISOString().slice(0, 10),
  time: a.time ?? '09:00',
  type: a.type ?? 'Consultation',
  status: a.status ?? 'Scheduled', // Scheduled | Completed | Cancelled | In Progress
  notes: a.notes ?? '',
})

export const createBill = (b = {}) => ({
  id: b.id ?? nextId('INV-'),
  patientId: b.patientId ?? '',
  patientName: b.patientName ?? '',
  date: b.date ?? new Date().toISOString().slice(0, 10),
  service: b.service ?? '',
  amount: b.amount ?? 0,
  tax: b.tax ?? 0,
  total: b.total ?? 0,
  status: b.status ?? 'Pending', // Paid | Pending | Overdue
  method: b.method ?? 'Card',
})

export const createPrescription = (p = {}) => ({
  id: p.id ?? nextId('RX-'),
  patientId: p.patientId ?? '',
  patientName: p.patientName ?? '',
  doctorName: p.doctorName ?? '',
  date: p.date ?? new Date().toISOString().slice(0, 10),
  diagnosis: p.diagnosis ?? '',
  medicines: p.medicines ?? [], // [{name, dosage, duration}]
  notes: p.notes ?? '',
  status: p.status ?? 'Active',
})

export const createDepartment = (d = {}) => ({
  id: d.id ?? nextId('DP-'),
  name: d.name ?? '',
  head: d.head ?? '',
  doctors: d.doctors ?? 0,
  patients: d.patients ?? 0,
  icon: d.icon ?? 'ri-hospital-line',
  description: d.description ?? '',
})

export const createInventoryItem = (i = {}) => ({
  id: i.id ?? nextId('ITM-'),
  name: i.name ?? '',
  category: i.category ?? 'Medicine',
  stock: i.stock ?? 0,
  unit: i.unit ?? 'pcs',
  price: i.price ?? 0,
  supplier: i.supplier ?? '',
  expiry: i.expiry ?? '',
  status: i.status ?? 'In Stock', // In Stock | Low | Out
})

export const createStaff = (s = {}) => ({
  id: s.id ?? nextId('ST-'),
  name: s.name ?? '',
  role: s.role ?? 'Nurse',
  department: s.department ?? '',
  phone: s.phone ?? '',
  email: s.email ?? '',
  shift: s.shift ?? 'Morning',
  status: s.status ?? 'Active',
})

export const createMessage = (m = {}) => ({
  id: m.id ?? nextId('MSG-'),
  from: m.from ?? '',
  role: m.role ?? '',
  subject: m.subject ?? '',
  preview: m.preview ?? '',
  time: m.time ?? new Date().toISOString(),
  read: m.read ?? false,
  avatar: m.avatar ?? null,
})
