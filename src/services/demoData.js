/**
 * Demo data service — simulates a backend by returning pre-seeded data.
 * Every consumer goes through this service so that swapping to a real API
 * later is a one-file change.
 */

import {
  createPatient,
  createDoctor,
  createAppointment,
  createBill,
  createPrescription,
  createDepartment,
  createInventoryItem,
  createStaff,
  createMessage,
} from '@/models'

/* -------- helpers -------- */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}
const daysAhead = (n) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

const firstNames = [
  'Aarav', 'Sara', 'Liam', 'Olivia', 'Noah', 'Emma', 'Ethan', 'Sophia',
  'Mason', 'Isabella', 'Lucas', 'Mia', 'James', 'Charlotte', 'Benjamin',
  'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn', 'Yusuf', 'Layla',
  'Omar', 'Fatima', 'Ali', 'Zara', 'Ibrahim', 'Aisha',
]
const lastNames = [
  'Khan', 'Smith', 'Patel', 'Johnson', 'Williams', 'Brown', 'Davis', 'Garcia',
  'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore',
  'Ahmed', 'Hussain', 'Malik', 'Iqbal',
]
const specializations = [
  'Cardiology', 'Pediatrics', 'Orthopedics', 'Dermatology',
  'Neurology', 'Gynecology', 'General Medicine', 'Dentistry',
  'ENT', 'Ophthalmology',
]
const conditions = [
  'Hypertension', 'Diabetes', 'Common Cold', 'Migraine',
  'Back Pain', 'Allergy', 'Asthma', 'General Checkup',
  'Skin Rash', 'Fever',
]
const services = [
  'Consultation', 'Lab Test', 'X-Ray', 'MRI Scan',
  'Surgery', 'Vaccination', 'Dental Cleaning', 'Therapy Session',
]

const randomName = () => `${pick(firstNames)} ${pick(lastNames)}`
const randomPhone = () => `+1 ${rand(200, 999)}-${rand(100, 999)}-${rand(1000, 9999)}`
const randomEmail = (name) =>
  `${name.toLowerCase().replace(/\s+/g, '.')}@cliniccare.demo`

/* -------- Doctors -------- */
const seedDoctors = () => {
  const list = []
  for (let i = 0; i < 14; i++) {
    const name = `Dr. ${randomName()}`
    const spec = pick(specializations)
    list.push(
      createDoctor({
        name,
        specialization: spec,
        department: spec,
        phone: randomPhone(),
        email: randomEmail(name.replace('Dr. ', '')),
        experience: rand(2, 25),
        rating: (rand(38, 50) / 10),
        patients: rand(40, 320),
        status: pick(['Available', 'Available', 'Available', 'Busy', 'On Leave']),
        fee: rand(40, 200),
      }),
    )
  }
  return list
}

/* -------- Patients -------- */
const seedPatients = () => {
  const list = []
  for (let i = 0; i < 36; i++) {
    const name = randomName()
    list.push(
      createPatient({
        name,
        age: rand(2, 85),
        gender: pick(['Male', 'Female']),
        phone: randomPhone(),
        email: randomEmail(name),
        bloodGroup: pick(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
        address: `${rand(10, 999)} ${pick(['Maple', 'Oak', 'Pine', 'Cedar'])} St`,
        registeredOn: daysAgo(rand(1, 500)),
        lastVisit: daysAgo(rand(0, 90)),
        status: pick(['Active', 'Active', 'Active', 'Inactive']),
        condition: pick(conditions),
      }),
    )
  }
  return list
}

/* -------- Appointments -------- */
const seedAppointments = (patients, doctors) => {
  const list = []
  for (let i = 0; i < 28; i++) {
    const p = pick(patients)
    const d = pick(doctors)
    const isPast = Math.random() < 0.45
    list.push(
      createAppointment({
        patientId: p.id,
        patientName: p.name,
        doctorId: d.id,
        doctorName: d.name,
        date: isPast ? daysAgo(rand(1, 30)) : daysAhead(rand(0, 14)),
        time: `${rand(8, 18).toString().padStart(2, '0')}:${pick(['00', '15', '30', '45'])}`,
        type: pick(services),
        status: isPast
          ? pick(['Completed', 'Completed', 'Cancelled'])
          : pick(['Scheduled', 'Scheduled', 'In Progress']),
        notes: pick(conditions),
      }),
    )
  }
  return list
}

/* -------- Bills -------- */
const seedBills = (patients) => {
  const list = []
  for (let i = 0; i < 24; i++) {
    const p = pick(patients)
    const amt = rand(40, 1200)
    const tax = Math.round(amt * 0.08)
    list.push(
      createBill({
        patientId: p.id,
        patientName: p.name,
        date: daysAgo(rand(0, 60)),
        service: pick(services),
        amount: amt,
        tax,
        total: amt + tax,
        status: pick(['Paid', 'Paid', 'Paid', 'Pending', 'Overdue']),
        method: pick(['Card', 'Cash', 'Insurance', 'UPI']),
      }),
    )
  }
  return list
}

/* -------- Prescriptions -------- */
const seedPrescriptions = (patients, doctors) => {
  const meds = [
    { name: 'Amoxicillin', dosage: '500mg', duration: '7 days' },
    { name: 'Paracetamol', dosage: '650mg', duration: '5 days' },
    { name: 'Metformin', dosage: '500mg', duration: '30 days' },
    { name: 'Ibuprofen', dosage: '400mg', duration: '3 days' },
    { name: 'Atorvastatin', dosage: '10mg', duration: '30 days' },
    { name: 'Omeprazole', dosage: '20mg', duration: '14 days' },
  ]
  const list = []
  for (let i = 0; i < 18; i++) {
    const p = pick(patients)
    const d = pick(doctors)
    const count = rand(1, 3)
    const selected = []
    for (let j = 0; j < count; j++) selected.push(pick(meds))
    list.push(
      createPrescription({
        patientId: p.id,
        patientName: p.name,
        doctorName: d.name,
        date: daysAgo(rand(0, 45)),
        diagnosis: pick(conditions),
        medicines: selected,
        notes: 'Take after meals. Plenty of fluids advised.',
        status: pick(['Active', 'Active', 'Completed']),
      }),
    )
  }
  return list
}

/* -------- Departments -------- */
const seedDepartments = () => {
  const data = [
    { name: 'Cardiology', icon: 'ri-heart-pulse-line', description: 'Heart & vascular care' },
    { name: 'Pediatrics', icon: 'ri-bear-smile-line', description: 'Child healthcare' },
    { name: 'Orthopedics', icon: 'ri-walk-line', description: 'Bone & joint care' },
    { name: 'Neurology', icon: 'ri-brain-line', description: 'Nervous system' },
    { name: 'Dermatology', icon: 'ri-hand-sanitizer-line', description: 'Skin & hair care' },
    { name: 'Dentistry', icon: 'ri-emotion-laugh-line', description: 'Oral healthcare' },
    { name: 'ENT', icon: 'ri-mic-line', description: 'Ear, nose & throat' },
    { name: 'Ophthalmology', icon: 'ri-eye-line', description: 'Eye care' },
  ]
  return data.map((d) =>
    createDepartment({
      ...d,
      head: `Dr. ${randomName()}`,
      doctors: rand(2, 8),
      patients: rand(40, 220),
    }),
  )
}

/* -------- Inventory -------- */
const seedInventory = () => {
  const items = [
    'Paracetamol', 'Amoxicillin', 'Surgical Mask', 'Syringe 5ml',
    'Bandage Roll', 'Insulin', 'Ibuprofen', 'Cotton Pad',
    'Glucose Strip', 'Oxygen Mask', 'IV Set', 'Antiseptic',
    'Gloves (Pair)', 'Thermometer', 'Stethoscope',
  ]
  return items.map((name) => {
    const stock = rand(0, 500)
    return createInventoryItem({
      name,
      category: pick(['Medicine', 'Equipment', 'Consumable']),
      stock,
      unit: pick(['pcs', 'box', 'bottle']),
      price: rand(2, 80),
      supplier: pick(['MedSupply Co', 'HealthPlus', 'PharmaCorp', 'CareLink']),
      expiry: daysAhead(rand(60, 720)),
      status: stock === 0 ? 'Out' : stock < 50 ? 'Low' : 'In Stock',
    })
  })
}

/* -------- Staff -------- */
const seedStaff = () => {
  const list = []
  for (let i = 0; i < 12; i++) {
    const name = randomName()
    list.push(
      createStaff({
        name,
        role: pick(['Nurse', 'Receptionist', 'Lab Technician', 'Pharmacist', 'Cleaner']),
        department: pick(specializations),
        phone: randomPhone(),
        email: randomEmail(name),
        shift: pick(['Morning', 'Evening', 'Night']),
        status: pick(['Active', 'Active', 'On Leave']),
      }),
    )
  }
  return list
}

/* -------- Messages -------- */
const seedMessages = () => {
  const subjects = [
    'Lab results ready',
    'Appointment reminder',
    'Prescription refill request',
    'Insurance update needed',
    'Patient feedback received',
    'New referral',
    'Schedule change',
  ]
  const list = []
  for (let i = 0; i < 9; i++) {
    list.push(
      createMessage({
        from: randomName(),
        role: pick(['Patient', 'Doctor', 'Staff', 'Pharmacy']),
        subject: pick(subjects),
        preview:
          'Hi, just following up on the discussion from earlier this week regarding the upcoming consultation…',
        time: new Date(Date.now() - rand(60_000, 86_400_000 * 5)).toISOString(),
        read: Math.random() > 0.6,
      }),
    )
  }
  return list
}

/* -------- Public API -------- */
let cache = null
export const loadDemoData = () => {
  if (cache) return cache
  const doctors = seedDoctors()
  const patients = seedPatients()
  cache = {
    doctors,
    patients,
    appointments: seedAppointments(patients, doctors),
    bills: seedBills(patients),
    prescriptions: seedPrescriptions(patients, doctors),
    departments: seedDepartments(),
    inventory: seedInventory(),
    staff: seedStaff(),
    messages: seedMessages(),
  }
  return cache
}

/* -------- Analytics for dashboard -------- */
export const buildAnalytics = (data) => {
  const today = new Date().toISOString().slice(0, 10)
  const appointmentsToday = data.appointments.filter((a) => a.date === today).length

  const revenue = data.bills
    .filter((b) => b.status === 'Paid')
    .reduce((s, b) => s + b.total, 0)

  const pendingRevenue = data.bills
    .filter((b) => b.status !== 'Paid')
    .reduce((s, b) => s + b.total, 0)

  // last 7 days appointments
  const last7 = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    last7.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      value: data.appointments.filter((a) => a.date === key).length || Math.floor(Math.random() * 10 + 4),
    })
  }

  // department patient distribution
  const deptDist = data.departments.map((d) => ({
    label: d.name,
    value: d.patients,
  }))

  // monthly revenue
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthly = months.slice(0, 8).map((m) => ({
    label: m,
    value: Math.floor(Math.random() * 8000 + 4000),
  }))

  return {
    appointmentsToday,
    totalPatients: data.patients.length,
    totalDoctors: data.doctors.length,
    revenue,
    pendingRevenue,
    appointmentsLast7: last7,
    departmentDistribution: deptDist,
    monthlyRevenue: monthly,
  }
}
