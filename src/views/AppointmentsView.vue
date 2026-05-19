<script setup>
import { computed, ref } from 'vue'
import { useClinicStore } from '@/stores/clinic'
import { useUiStore } from '@/stores/ui'
import Modal from '@/components/Modal.vue'

const clinic = useClinicStore()
const ui = useUiStore()

const currentTab = ref('All')
const selectedAppointment = ref(null)
const showViewModal = ref(false)
const showAddModal = ref(false)

const patients = computed(() => clinic.patients)
const doctors = computed(() => clinic.doctors)

const newAppointment = ref({
  patientId: '',
  patientName: '',
  doctorId: '',
  doctorName: '',
  date: '',
  time: '',
  type: 'Consultation',
  notes: '',
  status: 'Scheduled'
})

const appointments = computed(() => {
  if (currentTab.value === 'All') return clinic.appointments
  return clinic.appointments.filter(a => a.status === currentTab.value)
})

const updateStatus = (id, newStatus) => {
  clinic.updateAppointment(id, { status: newStatus })
  ui.addToast(`Appointment marked as ${newStatus}`, 'success')
}

const openViewModal = (appt) => {
  selectedAppointment.value = appt
  showViewModal.value = true
}

const handleAddAppointment = () => {
  const p = patients.value.find(x => x.id === newAppointment.value.patientId)
  const d = doctors.value.find(x => x.id === newAppointment.value.doctorId)
  
  if (p) newAppointment.value.patientName = p.name
  if (d) newAppointment.value.doctorName = d.name
  
  clinic.addAppointment({ ...newAppointment.value })
  ui.addToast('Appointment booked successfully', 'success')
  showAddModal.value = false
  newAppointment.value = {
    patientId: '',
    patientName: '',
    doctorId: '',
    doctorName: '',
    date: '',
    time: '',
    type: 'Consultation',
    notes: '',
    status: 'Scheduled'
  }
}
</script>

<template>
  <div class="cc-page">
    <div class="cc-page-header">
      <div>
        <h1 class="cc-page-title">Appointments</h1>
        <p class="cc-page-subtitle">Schedule and manage patient bookings</p>
      </div>
      <div class="header-actions">
        <button class="cc-btn cc-btn-primary cc-shadow-glow" @click="showAddModal = true">
          <i class="ri-calendar-check-line"></i> Book Appointment
        </button>
      </div>
    </div>

    <div class="cc-card table-card">
      <div class="tabs">
        <button 
          v-for="tab in ['All', 'Scheduled', 'Completed', 'Cancelled']" 
          :key="tab"
          class="tab-btn"
          :class="{ active: currentTab === tab }"
          @click="currentTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <div class="table-responsive" v-if="appointments.length > 0">
        <table class="cc-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Service</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appt in appointments" :key="appt.id">
              <td>
                <div class="font-bold">{{ appt.date }}</div>
                <div class="text-muted">{{ appt.time }}</div>
              </td>
              <td>{{ appt.patientName }}</td>
              <td>{{ appt.doctorName }}</td>
              <td>{{ appt.type }}</td>
              <td>
                <span class="cc-badge" :class="{
                  'cc-badge-success': appt.status === 'Completed',
                  'cc-badge-warning': appt.status === 'Scheduled',
                  'cc-badge-danger': appt.status === 'Cancelled',
                  'cc-badge-info': appt.status === 'In Progress'
                }">{{ appt.status }}</span>
              </td>
              <td>
                <div class="dropdown-mock">
                  <button class="cc-btn-icon cc-btn-ghost cc-btn-sm" title="View Details" @click="openViewModal(appt)">
                    <i class="ri-eye-line"></i>
                  </button>
                  <template v-if="appt.status === 'Scheduled' || appt.status === 'In Progress'">
                    <button class="cc-btn-icon cc-btn-ghost cc-btn-sm" title="Mark Completed" @click="updateStatus(appt.id, 'Completed')">
                      <i class="ri-check-line text-success"></i>
                    </button>
                    <button class="cc-btn-icon cc-btn-ghost cc-btn-sm" title="Cancel" @click="updateStatus(appt.id, 'Cancelled')">
                      <i class="ri-close-line text-danger"></i>
                    </button>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <i class="ri-calendar-event-line"></i>
        <p>No appointments found in this view.</p>
      </div>
    </div>

    <!-- Appointment Details Modal -->
    <Modal :show="showViewModal" title="Appointment Details" @close="showViewModal = false" width="550px">
      <div v-if="selectedAppointment" class="appt-details">
        <div class="detail-grid">
          <div class="detail-item">
            <label>Patient Name</label>
            <div>{{ selectedAppointment.patientName }}</div>
          </div>
          <div class="detail-item">
            <label>Doctor Name</label>
            <div>{{ selectedAppointment.doctorName }}</div>
          </div>
          <div class="detail-item">
            <label>Date</label>
            <div>{{ selectedAppointment.date }}</div>
          </div>
          <div class="detail-item">
            <label>Time</label>
            <div>{{ selectedAppointment.time }}</div>
          </div>
          <div class="detail-item">
            <label>Service Type</label>
            <div>{{ selectedAppointment.type }}</div>
          </div>
          <div class="detail-item">
            <label>Status</label>
            <div>
              <span class="cc-badge" :class="{
                'cc-badge-success': selectedAppointment.status === 'Completed',
                'cc-badge-warning': selectedAppointment.status === 'Scheduled',
                'cc-badge-danger': selectedAppointment.status === 'Cancelled',
                'cc-badge-info': selectedAppointment.status === 'In Progress'
              }">{{ selectedAppointment.status }}</span>
            </div>
          </div>
          <div class="detail-item full-width" v-if="selectedAppointment.notes">
            <label>Clinical Notes</label>
            <div class="notes-box">{{ selectedAppointment.notes }}</div>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="cc-btn cc-btn-ghost" @click="showViewModal = false">Close</button>
      </template>
    </Modal>

    <!-- Book Appointment Modal -->
    <Modal :show="showAddModal" title="Book New Appointment" @close="showAddModal = false" width="550px">
      <form id="addApptForm" @submit.prevent="handleAddAppointment" class="form-grid">
        <div class="form-group">
          <label>Select Patient</label>
          <select v-model="newAppointment.patientId" required>
            <option value="" disabled>Choose a patient...</option>
            <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Select Doctor</label>
          <select v-model="newAppointment.doctorId" required>
            <option value="" disabled>Choose a doctor...</option>
            <option v-for="d in doctors" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" v-model="newAppointment.date" required />
        </div>
        <div class="form-group">
          <label>Time</label>
          <input type="time" v-model="newAppointment.time" required />
        </div>
        <div class="form-group full-width">
          <label>Service Type</label>
          <input type="text" v-model="newAppointment.type" required placeholder="Consultation, Checkup, etc." />
        </div>
        <div class="form-group full-width">
          <label>Notes (Optional)</label>
          <textarea v-model="newAppointment.notes" rows="3" placeholder="Additional details..."></textarea>
        </div>
      </form>
      <template #footer>
        <button class="cc-btn cc-btn-ghost" @click="showAddModal = false">Cancel</button>
        <button type="submit" form="addApptForm" class="cc-btn cc-btn-primary">Confirm Booking</button>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.full-width {
  grid-column: 1 / -1;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-size: 13px;
  font-weight: 700;
  color: var(--cc-text);
}

.appt-details {
  padding: 10px 0;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.full-width {
  grid-column: 1 / -1;
}
.detail-item label {
  font-size: 12px;
  font-weight: 600;
  color: var(--cc-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  display: block;
}
.detail-item div {
  font-size: 15px;
  font-weight: 700;
  color: var(--cc-text);
}
.notes-box {
  background: var(--cc-surface-2);
  padding: 12px;
  border-radius: 8px;
  font-weight: 400 !important;
  font-style: italic;
  color: var(--cc-text-muted) !important;
  margin-top: 4px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.table-card {
  padding-bottom: 0;
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--cc-border);
  padding: 0 20px;
}

.tab-btn {
  padding: 16px 20px;
  font-weight: 600;
  color: var(--cc-text-muted);
  border-bottom: 3px solid transparent;
  transition: all var(--cc-trans);
}
.tab-btn:hover {
  color: var(--cc-text);
}
.tab-btn.active {
  color: var(--cc-primary);
  border-bottom-color: var(--cc-primary);
}

.font-bold {
  font-weight: 700;
  color: var(--cc-text);
}
.text-muted {
  font-size: 13px;
  color: var(--cc-text-muted);
}

.dropdown-mock {
  display: flex;
  gap: 8px;
}
.text-success { color: var(--cc-success); }
.text-danger { color: var(--cc-danger); }

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--cc-text-muted);
}
.empty-state i {
  font-size: 48px;
  color: var(--cc-border);
  margin-bottom: 12px;
  display: inline-block;
}
</style>
