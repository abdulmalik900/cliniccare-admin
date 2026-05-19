<script setup>
import { computed, ref } from 'vue'
import { useClinicStore } from '@/stores/clinic'
import { useUiStore } from '@/stores/ui'
import Modal from '@/components/Modal.vue'

const clinic = useClinicStore()
const ui = useUiStore()

const departments = computed(() => clinic.departments)

const showAddModal = ref(false)
const newDept = ref({
  name: '',
  icon: 'ri-hospital-line',
  description: '',
  head: '',
  doctors: 0,
  patients: 0
})

const handleAddDept = () => {
  clinic.departments.unshift({ ...newDept.value, id: Date.now() })
  ui.addToast('Department added successfully', 'success')
  showAddModal.value = false
  newDept.value = { name: '', icon: 'ri-hospital-line', description: '', head: '', doctors: 0, patients: 0 }
}

</script>

<template>
  <div class="cc-page">
    <div class="cc-page-header">
      <div>
        <h1 class="cc-page-title">Departments</h1>
        <p class="cc-page-subtitle">Manage hospital departments and their metrics</p>
      </div>
      <div class="header-actions">
        <button class="cc-btn cc-btn-primary cc-shadow-glow" @click="showAddModal = true">
          <i class="ri-hospital-line"></i> Add Department
        </button>
      </div>
    </div>

    <div class="dept-grid" v-if="departments.length > 0">
      <div class="cc-card dept-card" v-for="dept in departments" :key="dept.id">
        <div class="dept-icon cc-gradient-secondary">
          <i :class="dept.icon"></i>
        </div>
        
        <h3 class="dept-name">{{ dept.name }}</h3>
        <p class="dept-desc">{{ dept.description }}</p>
        
        <div class="dept-stats">
          <div class="d-stat">
            <span class="label">Head:</span>
            <span class="val font-bold">{{ dept.head }}</span>
          </div>
          <div class="d-stat">
            <span class="label">Doctors:</span>
            <span class="val">{{ dept.doctors }}</span>
          </div>
          <div class="d-stat">
            <span class="label">Patients:</span>
            <span class="val">{{ dept.patients }}</span>
          </div>
        </div>
        
        <div class="dept-actions">
          <button class="cc-btn cc-btn-ghost cc-btn-sm w-full">Manage Department</button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state cc-card">
        <i class="ri-hospital-line"></i>
        <p>No departments configured.</p>
      </div>

    <!-- Add Department Modal -->
    <Modal :show="showAddModal" title="Add New Department" @close="showAddModal = false" width="500px">
      <form id="addDeptForm" @submit.prevent="handleAddDept" class="form-grid">
        <div class="form-group full-width">
          <label>Department Name</label>
          <input type="text" v-model="newDept.name" required placeholder="E.g. Cardiology" />
        </div>
        <div class="form-group full-width">
          <label>Description</label>
          <textarea v-model="newDept.description" rows="2" required placeholder="Brief description..."></textarea>
        </div>
        <div class="form-group">
          <label>Department Head</label>
          <input type="text" v-model="newDept.head" required placeholder="Dr. Name" />
        </div>
        <div class="form-group">
          <label>Icon Class (RemixIcon)</label>
          <input type="text" v-model="newDept.icon" required placeholder="ri-hospital-line" />
        </div>
      </form>
      <template #footer>
        <button class="cc-btn cc-btn-ghost" @click="showAddModal = false">Cancel</button>
        <button type="submit" form="addDeptForm" class="cc-btn cc-btn-primary">Create Department</button>
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

.dept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.dept-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.dept-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;
  margin-bottom: 16px;
  box-shadow: var(--cc-shadow-sm);
}

.dept-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--cc-text);
  margin-bottom: 6px;
}

.dept-desc {
  font-size: 13px;
  color: var(--cc-text-muted);
  line-height: 1.5;
  margin-bottom: 20px;
  flex: 1;
}

.dept-stats {
  background: var(--cc-surface-2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.d-stat {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}
.d-stat:last-child {
  margin-bottom: 0;
}

.d-stat .label {
  color: var(--cc-text-muted);
}
.d-stat .val {
  color: var(--cc-text);
}
.font-bold {
  font-weight: 700;
}

.w-full {
  width: 100%;
  justify-content: center;
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
