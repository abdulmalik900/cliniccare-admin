<script setup>
import { computed, ref } from 'vue'
import { useClinicStore } from '@/stores/clinic'
import { useUiStore } from '@/stores/ui'
import Modal from '@/components/Modal.vue'

const clinic = useClinicStore()
const ui = useUiStore()

const doctors = computed(() => clinic.doctors)

const showAddModal = ref(false)
const newDoctor = ref({
  name: '',
  specialization: 'General Medicine',
  department: 'General Medicine',
  phone: '',
  email: '',
  fee: 100,
  status: 'Available'
})

const handleAddDoctor = () => {
  clinic.addDoctor({ ...newDoctor.value })
  ui.addToast('Doctor added successfully', 'success')
  showAddModal.value = false
  newDoctor.value = {
    name: '',
    specialization: 'General Medicine',
    department: 'General Medicine',
    phone: '',
    email: '',
    fee: 100,
    status: 'Available'
  }
}
</script>

<template>
  <div class="cc-page">
    <div class="cc-page-header">
      <div>
        <h1 class="cc-page-title">Our Doctors</h1>
        <p class="cc-page-subtitle">Manage medical staff and specialists</p>
      </div>
      <div class="header-actions">
        <button class="cc-btn cc-btn-primary cc-shadow-glow" @click="showAddModal = true">
          <i class="ri-user-add-line"></i> Add Doctor
        </button>
      </div>
    </div>

    <div v-if="doctors.length === 0" class="cc-card empty-state">
      <i class="ri-stethoscope-line"></i>
      <p>No doctors available.</p>
    </div>

    <div class="doctors-grid" v-else>
      <div class="cc-card doctor-card" v-for="doc in doctors" :key="doc.id">
        <div class="doc-header">
          <div class="doc-avatar cc-gradient-secondary">
            {{ doc.name.replace('Dr. ', '').charAt(0) }}
          </div>
          <span class="cc-badge" :class="doc.status === 'Available' ? 'cc-badge-success' : 'cc-badge-warning'">
            {{ doc.status }}
          </span>
        </div>
        
        <div class="doc-body">
          <h3 class="doc-name">{{ doc.name }}</h3>
          <p class="doc-spec">{{ doc.specialization }}</p>
          
          <div class="doc-stats">
            <div class="stat">
              <i class="ri-star-fill text-warning"></i>
              <span>{{ doc.rating }}</span>
            </div>
            <div class="stat">
              <i class="ri-user-heart-line text-primary"></i>
              <span>{{ doc.patients }}+</span>
            </div>
            <div class="stat">
              <i class="ri-briefcase-4-line text-accent"></i>
              <span>{{ doc.experience }} Yrs</span>
            </div>
          </div>
        </div>
        
        <div class="doc-footer">
          <div class="doc-fee">Fee: <strong>${{ doc.fee }}</strong></div>
          <button class="cc-btn cc-btn-ghost cc-btn-sm">Profile</button>
        </div>
      </div>
    </div>

    <!-- Add Doctor Modal -->
    <Modal :show="showAddModal" title="Add New Doctor" @close="showAddModal = false" width="500px">
      <form id="addDoctorForm" @submit.prevent="handleAddDoctor" class="form-grid">
        <div class="form-group full-width">
          <label>Doctor Name</label>
          <input type="text" v-model="newDoctor.name" required placeholder="E.g. Dr. John Doe" />
        </div>
        <div class="form-group">
          <label>Specialization</label>
          <input type="text" v-model="newDoctor.specialization" required placeholder="Cardiology" />
        </div>
        <div class="form-group">
          <label>Fee ($)</label>
          <input type="number" v-model="newDoctor.fee" required />
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input type="text" v-model="newDoctor.phone" required placeholder="+1..." />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="newDoctor.email" required placeholder="doctor@clinic.com" />
        </div>
      </form>
      <template #footer>
        <button class="cc-btn cc-btn-ghost" @click="showAddModal = false">Cancel</button>
        <button type="submit" form="addDoctorForm" class="cc-btn cc-btn-primary">Save Doctor</button>
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

.header-actions {
  display: flex;
  gap: 12px;
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

.doctors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.doctor-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.doc-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: var(--cc-surface-2);
  border-bottom: 1px solid var(--cc-border);
}

.doc-avatar {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  box-shadow: var(--cc-shadow-sm);
  transform: translateY(10px);
}

.doc-body {
  padding: 30px 20px 20px;
  flex: 1;
}

.doc-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--cc-text);
  margin-bottom: 4px;
}

.doc-spec {
  font-size: 14px;
  color: var(--cc-secondary);
  font-weight: 600;
  margin-bottom: 16px;
}

.doc-stats {
  display: flex;
  gap: 16px;
  border-top: 1px dashed var(--cc-border);
  padding-top: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--cc-text-muted);
}

.text-warning { color: var(--cc-warning); }
.text-primary { color: var(--cc-primary); }
.text-accent { color: var(--cc-accent); }

.doc-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--cc-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--cc-bg);
}

.doc-fee {
  font-size: 13px;
  color: var(--cc-text-muted);
}
.doc-fee strong {
  font-size: 16px;
  color: var(--cc-text);
}
</style>
