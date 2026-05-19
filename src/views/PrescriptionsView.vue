<script setup>
import { computed, ref } from 'vue'
import { useClinicStore } from '@/stores/clinic'
import { useUiStore } from '@/stores/ui'
import Modal from '@/components/Modal.vue'

const clinic = useClinicStore()
const ui = useUiStore()

const prescriptions = computed(() => clinic.prescriptions)
const patients = computed(() => clinic.patients)
const doctors = computed(() => clinic.doctors)

const showAddModal = ref(false)
const newPrescription = ref({
  patientId: '',
  patientName: '',
  doctorName: '',
  diagnosis: '',
  medicines: [{ name: '', dosage: '', duration: '' }],
  notes: '',
  status: 'Active'
})

const addMedicineRow = () => {
  newPrescription.value.medicines.push({ name: '', dosage: '', duration: '' })
}

const removeMedicineRow = (index) => {
  newPrescription.value.medicines.splice(index, 1)
}

const handleAddPrescription = () => {
  const p = patients.value.find(x => x.id === newPrescription.value.patientId)
  if (p) newPrescription.value.patientName = p.name
  
  clinic.addPrescription({ ...newPrescription.value })
  ui.addToast('Prescription written successfully', 'success')
  showAddModal.value = false
  newPrescription.value = {
    patientId: '',
    patientName: '',
    doctorName: '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '', duration: '' }],
    notes: '',
    status: 'Active'
  }
}
</script>

<template>
  <div class="cc-page">
    <div class="cc-page-header">
      <div>
        <h1 class="cc-page-title">Prescriptions</h1>
        <p class="cc-page-subtitle">Manage patient prescriptions and medications</p>
      </div>
      <div class="header-actions">
        <button class="cc-btn cc-btn-primary cc-shadow-glow" @click="showAddModal = true">
          <i class="ri-capsule-line"></i> Write Prescription
        </button>
      </div>
    </div>

    <div class="prescriptions-grid" v-if="prescriptions.length > 0">
      <div class="cc-card p-card" v-for="rx in prescriptions" :key="rx.id">
        <div class="p-header cc-gradient-secondary">
          <div class="p-id">#{{ rx.id }}</div>
          <div class="p-date">{{ rx.date }}</div>
        </div>
        <div class="p-body">
          <div class="p-row">
            <span class="p-label">Patient:</span>
            <span class="p-value font-bold">{{ rx.patientName }}</span>
          </div>
          <div class="p-row">
            <span class="p-label">Doctor:</span>
            <span class="p-value">{{ rx.doctorName }}</span>
          </div>
          <div class="p-row">
            <span class="p-label">Diagnosis:</span>
            <span class="p-value">{{ rx.diagnosis }}</span>
          </div>
          
          <div class="meds-list">
            <h4 class="meds-title">Medicines</h4>
            <ul>
              <li v-for="(med, idx) in rx.medicines" :key="idx">
                <i class="ri-medicine-bottle-line text-accent"></i>
                <span>{{ med.name }} - {{ med.dosage }} ({{ med.duration }})</span>
              </li>
            </ul>
          </div>
          
          <div class="p-notes" v-if="rx.notes">
            <i class="ri-sticky-note-line"></i> {{ rx.notes }}
          </div>
        </div>
        <div class="p-footer">
          <span class="cc-badge" :class="rx.status === 'Active' ? 'cc-badge-success' : 'cc-badge-neutral'">
            {{ rx.status }}
          </span>
          <button class="cc-btn-icon cc-btn-ghost"><i class="ri-printer-line"></i></button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state cc-card">
      <i class="ri-capsule-line"></i>
      <p>No prescriptions found.</p>
    </div>

    <!-- Write Prescription Modal -->
    <Modal :show="showAddModal" title="Write New Prescription" @close="showAddModal = false" width="600px">
      <form id="addRxForm" @submit.prevent="handleAddPrescription" class="form-grid">
        <div class="form-group">
          <label>Select Patient</label>
          <select v-model="newPrescription.patientId" required>
            <option value="" disabled>Choose a patient...</option>
            <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Doctor Name</label>
          <select v-model="newPrescription.doctorName" required>
            <option value="" disabled>Choose a doctor...</option>
            <option v-for="d in doctors" :key="d.id" :value="d.name">{{ d.name }}</option>
          </select>
        </div>
        <div class="form-group full-width">
          <label>Diagnosis</label>
          <input type="text" v-model="newPrescription.diagnosis" required placeholder="Fever, Cold, etc." />
        </div>
        
        <div class="form-group full-width">
          <label style="display: flex; justify-content: space-between;">
            Medicines
            <button type="button" class="cc-btn cc-btn-sm cc-btn-ghost" @click="addMedicineRow">+ Add</button>
          </label>
          <div v-for="(med, index) in newPrescription.medicines" :key="index" class="med-input-row">
            <input type="text" v-model="med.name" placeholder="Name" required style="flex: 2;" />
            <input type="text" v-model="med.dosage" placeholder="Dosage" required style="flex: 1;" />
            <input type="text" v-model="med.duration" placeholder="Duration" required style="flex: 1;" />
            <button type="button" v-if="newPrescription.medicines.length > 1" @click="removeMedicineRow(index)" class="cc-btn-icon cc-btn-ghost" style="color: var(--cc-danger);">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </div>

        <div class="form-group full-width">
          <label>Clinical Notes</label>
          <textarea v-model="newPrescription.notes" rows="3" placeholder="Additional advice..."></textarea>
        </div>
      </form>
      <template #footer>
        <button class="cc-btn cc-btn-ghost" @click="showAddModal = false">Cancel</button>
        <button type="submit" form="addRxForm" class="cc-btn cc-btn-primary">Save Prescription</button>
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
.med-input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.prescriptions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.p-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.p-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--cc-surface);
}

.p-id {
  font-weight: 800;
  font-size: 18px;
}

.p-date {
  font-size: 13px;
  opacity: 0.9;
}

.p-body {
  padding: 20px;
  flex: 1;
}

.p-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.p-label {
  width: 80px;
  color: var(--cc-text-muted);
}

.p-value {
  flex: 1;
  color: var(--cc-text);
}

.font-bold {
  font-weight: 700;
}

.meds-list {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--cc-border);
}

.meds-title {
  font-size: 13px;
  text-transform: uppercase;
  color: var(--cc-text-muted);
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.meds-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.meds-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-bottom: 6px;
  color: var(--cc-text);
}

.text-accent {
  color: var(--cc-accent);
}

.p-notes {
  margin-top: 16px;
  padding: 12px;
  background: var(--cc-surface-2);
  border-radius: 8px;
  font-size: 13px;
  color: var(--cc-text-muted);
  display: flex;
  gap: 8px;
  align-items: flex-start;
}
.p-notes i {
  color: var(--cc-primary);
  font-size: 16px;
}

.p-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--cc-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--cc-bg);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--cc-text-muted);
}
.empty-state i {
  font-size: 56px;
  color: var(--cc-border);
  margin-bottom: 16px;
  display: inline-block;
}
</style>
