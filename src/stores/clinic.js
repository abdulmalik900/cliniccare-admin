/**
 * Central Pinia store — single source of truth for ClinicCare.
 * ViewModels (composables in /viewmodels) consume this store.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadDemoData, buildAnalytics } from '@/services/demoData'
import {
  createPatient,
  createDoctor,
  createAppointment,
  createBill,
  createPrescription,
  createInventoryItem,
  createStaff,
  createMessage,
} from '@/models'

export const useClinicStore = defineStore('clinic', () => {
  const data = ref(loadDemoData())

  const patients = computed(() => data.value.patients)
  const doctors = computed(() => data.value.doctors)
  const appointments = computed(() => data.value.appointments)
  const bills = computed(() => data.value.bills)
  const prescriptions = computed(() => data.value.prescriptions)
  const departments = computed(() => data.value.departments)
  const inventory = computed(() => data.value.inventory)
  const staff = computed(() => data.value.staff)
  const messages = computed(() => data.value.messages)

  const analytics = computed(() => buildAnalytics(data.value))

  /* -------- Patients CRUD -------- */
  const addPatient = (p) => data.value.patients.unshift(createPatient(p))
  const updatePatient = (id, patch) => {
    const i = data.value.patients.findIndex((p) => p.id === id)
    if (i !== -1) data.value.patients[i] = { ...data.value.patients[i], ...patch }
  }
  const deletePatient = (id) => {
    data.value.patients = data.value.patients.filter((p) => p.id !== id)
  }

  /* -------- Doctors CRUD -------- */
  const addDoctor = (d) => data.value.doctors.unshift(createDoctor(d))
  const updateDoctor = (id, patch) => {
    const i = data.value.doctors.findIndex((d) => d.id === id)
    if (i !== -1) data.value.doctors[i] = { ...data.value.doctors[i], ...patch }
  }
  const deleteDoctor = (id) => {
    data.value.doctors = data.value.doctors.filter((d) => d.id !== id)
  }

  /* -------- Appointments CRUD -------- */
  const addAppointment = (a) => data.value.appointments.unshift(createAppointment(a))
  const updateAppointment = (id, patch) => {
    const i = data.value.appointments.findIndex((a) => a.id === id)
    if (i !== -1) data.value.appointments[i] = { ...data.value.appointments[i], ...patch }
  }
  const deleteAppointment = (id) => {
    data.value.appointments = data.value.appointments.filter((a) => a.id !== id)
  }

  /* -------- Bills CRUD -------- */
  const addBill = (b) => {
    const total = (Number(b.amount) || 0) + (Number(b.tax) || 0)
    data.value.bills.unshift(createBill({ ...b, total }))
  }
  const updateBill = (id, patch) => {
    const i = data.value.bills.findIndex((b) => b.id === id)
    if (i !== -1) data.value.bills[i] = { ...data.value.bills[i], ...patch }
  }
  const deleteBill = (id) => {
    data.value.bills = data.value.bills.filter((b) => b.id !== id)
  }
  const markBillPaid = (id) => updateBill(id, { status: 'Paid' })

  /* -------- Prescriptions -------- */
  const addPrescription = (p) => data.value.prescriptions.unshift(createPrescription(p))
  const deletePrescription = (id) => {
    data.value.prescriptions = data.value.prescriptions.filter((p) => p.id !== id)
  }

  /* -------- Inventory -------- */
  const addInventory = (i) => data.value.inventory.unshift(createInventoryItem(i))
  const updateInventory = (id, patch) => {
    const i = data.value.inventory.findIndex((x) => x.id === id)
    if (i !== -1) data.value.inventory[i] = { ...data.value.inventory[i], ...patch }
  }
  const deleteInventory = (id) => {
    data.value.inventory = data.value.inventory.filter((x) => x.id !== id)
  }

  /* -------- Staff -------- */
  const addStaff = (s) => data.value.staff.unshift(createStaff(s))
  const updateStaff = (id, patch) => {
    const i = data.value.staff.findIndex((x) => x.id === id)
    if (i !== -1) data.value.staff[i] = { ...data.value.staff[i], ...patch }
  }
  const deleteStaff = (id) => {
    data.value.staff = data.value.staff.filter((x) => x.id !== id)
  }

  /* -------- Messages -------- */
  const addMessage = (m) => data.value.messages.unshift(createMessage(m))
  const markMessageRead = (id) => {
    const m = data.value.messages.find((x) => x.id === id)
    if (m) m.read = true
  }
  const deleteMessage = (id) => {
    data.value.messages = data.value.messages.filter((m) => m.id !== id)
  }

  return {
    // state
    patients, doctors, appointments, bills, prescriptions,
    departments, inventory, staff, messages, analytics,
    // actions
    addPatient, updatePatient, deletePatient,
    addDoctor, updateDoctor, deleteDoctor,
    addAppointment, updateAppointment, deleteAppointment,
    addBill, updateBill, deleteBill, markBillPaid,
    addPrescription, deletePrescription,
    addInventory, updateInventory, deleteInventory,
    addStaff, updateStaff, deleteStaff,
    addMessage, markMessageRead, deleteMessage,
  }
})
