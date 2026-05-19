<script setup>
import { ref, computed } from 'vue'
import { useClinicStore } from '@/stores/clinic'
import { useUiStore } from '@/stores/ui'
import Modal from '@/components/Modal.vue'

const clinic = useClinicStore()
const ui = useUiStore()

const searchQuery = ref('')
const filterStatus = ref('All')

// Modal State
const showAddModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const selectedPatient = ref(null)

const newPatient = ref({ name: '', phone: '', age: '', gender: 'Male', bloodGroup: 'O+', status: 'Active' })
const editPatientData = ref({ id: null, name: '', phone: '', age: '', gender: 'Male', bloodGroup: 'O+', status: 'Active' })

const filteredPatients = computed(() => {
  return clinic.patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || p.phone.includes(searchQuery.value)
    const matchesStatus = filterStatus.value === 'All' || p.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const deletePatient = (id) => {
  if (confirm('Are you sure you want to remove this patient?')) {
    clinic.deletePatient(id)
    ui.addToast('Patient removed', 'success')
  }
}

const openViewModal = (patient) => {
  selectedPatient.value = patient
  showViewModal.value = true
}

const openEditModal = (patient) => {
  editPatientData.value = { ...patient }
  showEditModal.value = true
}

const handleAddPatient = () => {
  clinic.addPatient({ ...newPatient.value })
  ui.addToast('Patient added successfully', 'success')
  showAddModal.value = false
  // reset
  newPatient.value = { name: '', phone: '', age: '', gender: 'Male', bloodGroup: 'O+', status: 'Active' }
}

const handleEditPatient = () => {
  clinic.updatePatient(editPatientData.value.id, { ...editPatientData.value })
  ui.addToast('Patient details updated', 'success')
  showEditModal.value = false
}
</script>

<template>
  <div class="cc-page">
    <div class="cc-page-header">
      <div>
        <h1 class="cc-page-title">Patients Management</h1>
        <p class="cc-page-subtitle">View and manage patient records</p>
      </div>
      <div class="header-actions">
        <button class="cc-btn cc-btn-primary cc-shadow-glow" @click="showAddModal = true">
          <i class="ri-add-line"></i> Add Patient
        </button>
      </div>
    </div>

    <div class="cc-card table-card">
      <div class="table-toolbar">
        <div class="search-box">
          <i class="ri-search-line"></i>
          <input type="text" v-model="searchQuery" placeholder="Search by name or phone..." />
        </div>
        <select v-model="filterStatus" class="status-filter">
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div class="table-responsive">
        <table class="cc-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Contact Info</th>
              <th>Blood Group</th>
              <th>Last Visit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="patient in filteredPatients" :key="patient.id">
              <td class="patient-cell">
                <div class="avatar-sm cc-gradient-primary">{{ patient.name.charAt(0) }}</div>
                <div>
                  <div class="name">{{ patient.name }}</div>
                  <div class="sub-text">{{ patient.age }} yrs • {{ patient.gender }}</div>
                </div>
              </td>
              <td>
                <div>{{ patient.phone }}</div>
                <div class="sub-text">{{ patient.email }}</div>
              </td>
              <td><span class="cc-badge cc-badge-neutral">{{ patient.bloodGroup }}</span></td>
              <td>{{ patient.lastVisit }}</td>
              <td>
                <span class="cc-badge" :class="patient.status === 'Active' ? 'cc-badge-success' : 'cc-badge-neutral'">
                  {{ patient.status }}
                </span>
              </td>
              <td>
                <div class="action-btns">
                  <button class="cc-btn-icon cc-btn-ghost" title="View Details" @click="openViewModal(patient)"><i class="ri-eye-line"></i></button>
                  <button class="cc-btn-icon cc-btn-ghost" title="Edit Patient" @click="openEditModal(patient)"><i class="ri-edit-line"></i></button>
                  <button class="cc-btn-icon cc-btn-ghost text-danger" title="Delete" @click="deletePatient(patient.id)"><i class="ri-delete-bin-line"></i></button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredPatients.length === 0">
              <td colspan="6" class="empty-state">
                <i class="ri-user-unfollow-line"></i>
                <p>No patients found.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View Patient Modal -->
    <Modal :show="showViewModal" title="Patient Details" @close="showViewModal = false" width="600px">
      <div v-if="selectedPatient" class="patient-details">
        <div class="detail-header">
          <div class="avatar-lg cc-gradient-primary">{{ selectedPatient.name.charAt(0) }}</div>
          <div>
            <h2>{{ selectedPatient.name }}</h2>
            <p class="text-muted">{{ selectedPatient.age }} yrs • {{ selectedPatient.gender }} • {{ selectedPatient.bloodGroup }}</p>
          </div>
        </div>
        <div class="detail-grid">
          <div class="detail-item">
            <label>Phone</label>
            <div>{{ selectedPatient.phone }}</div>
          </div>
          <div class="detail-item">
            <label>Email</label>
            <div>{{ selectedPatient.email }}</div>
          </div>
          <div class="detail-item">
            <label>Condition</label>
            <div>{{ selectedPatient.condition }}</div>
          </div>
          <div class="detail-item">
            <label>Address</label>
            <div>{{ selectedPatient.address }}</div>
          </div>
          <div class="detail-item">
            <label>Last Visit</label>
            <div>{{ selectedPatient.lastVisit }}</div>
          </div>
          <div class="detail-item">
            <label>Status</label>
            <div>
              <span class="cc-badge" :class="selectedPatient.status === 'Active' ? 'cc-badge-success' : 'cc-badge-neutral'">
                {{ selectedPatient.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="cc-btn cc-btn-ghost" @click="showViewModal = false">Close</button>
      </template>
    </Modal>

    <!-- Add Patient Modal -->
    <Modal :show="showAddModal" title="Add New Patient" @close="showAddModal = false" width="500px">
      <form id="addPatientForm" @submit.prevent="handleAddPatient" class="form-grid">
        <div class="form-group full-width">
          <label>Full Name</label>
          <input type="text" v-model="newPatient.name" required placeholder="E.g. John Doe" />
        </div>
        <div class="form-group">
          <label>Age</label>
          <input type="number" v-model="newPatient.age" required placeholder="Age" />
        </div>
        <div class="form-group">
          <label>Gender</label>
          <select v-model="newPatient.gender">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="text" v-model="newPatient.phone" required placeholder="+1..." />
        </div>
        <div class="form-group">
          <label>Blood Group</label>
          <select v-model="newPatient.bloodGroup">
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
            <option>O+</option><option>O-</option>
          </select>
        </div>
      </form>
      <template #footer>
        <button class="cc-btn cc-btn-ghost" @click="showAddModal = false">Cancel</button>
        <button type="submit" form="addPatientForm" class="cc-btn cc-btn-primary">Save Patient</button>
      </template>
    </Modal>

    <!-- Edit Patient Modal -->
    <Modal :show="showEditModal" title="Edit Patient Details" @close="showEditModal = false" width="500px">
      <form id="editPatientForm" @submit.prevent="handleEditPatient" class="form-grid">
        <div class="form-group full-width">
          <label>Full Name</label>
          <input type="text" v-model="editPatientData.name" required />
        </div>
        <div class="form-group">
          <label>Age</label>
          <input type="number" v-model="editPatientData.age" required />
        </div>
        <div class="form-group">
          <label>Gender</label>
          <select v-model="editPatientData.gender">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="text" v-model="editPatientData.phone" required />
        </div>
        <div class="form-group">
          <label>Blood Group</label>
          <select v-model="editPatientData.bloodGroup">
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
            <option>O+</option><option>O-</option>
          </select>
        </div>
        <div class="form-group full-width">
          <label>Status</label>
          <select v-model="editPatientData.status">
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </form>
      <template #footer>
        <button class="cc-btn cc-btn-ghost" @click="showEditModal = false">Cancel</button>
        <button type="submit" form="editPatientForm" class="cc-btn cc-btn-primary">Update Patient</button>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.header-actions {
  display: flex;
  gap: 12px;
}

.table-card {
  padding-bottom: 0;
  overflow: hidden;
}

.table-toolbar {
  padding: 20px;
  display: flex;
  gap: 16px;
  border-bottom: 1px solid var(--cc-border);
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 320px;
}
.search-box i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--cc-text-muted);
}
.search-box input {
  padding-left: 40px;
}

.status-filter {
  width: 160px;
}

.patient-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar-sm {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.name {
  font-weight: 700;
  color: var(--cc-text);
}
.sub-text {
  font-size: 12px;
  color: var(--cc-text-muted);
  margin-top: 2px;
}

.action-btns {
  display: flex;
  gap: 8px;
}

.text-danger {
  color: var(--cc-danger);
}
.text-danger:hover {
  background: rgba(185, 74, 58, 0.1);
}

.empty-state {
  text-align: center;
  padding: 60px !important;
  color: var(--cc-text-muted);
}
.empty-state i {
  font-size: 48px;
  color: var(--cc-border);
  margin-bottom: 12px;
  display: inline-block;
}

/* Modal specific styles */
.patient-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--cc-border);
}
.avatar-lg {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  color: #fff;
}
.detail-header h2 {
  font-size: 20px;
  font-weight: 800;
  color: var(--cc-text);
  margin-bottom: 4px;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.detail-item label {
  font-size: 13px;
  font-weight: 600;
  color: var(--cc-text-muted);
}
.detail-item div {
  font-size: 15px;
  color: var(--cc-text);
  font-weight: 500;
}

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
</style>
