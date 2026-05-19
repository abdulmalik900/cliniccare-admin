<script setup>
import { computed, ref } from 'vue'
import { useClinicStore } from '@/stores/clinic'
import { useUiStore } from '@/stores/ui'
import Modal from '@/components/Modal.vue'

const clinic = useClinicStore()
const ui = useUiStore()

const staff = computed(() => clinic.staff)

const showAddModal = ref(false)
const newStaff = ref({
  name: '',
  role: 'Nurse',
  department: 'General Medicine',
  phone: '',
  email: '',
  shift: 'Morning',
  status: 'Active'
})

const handleAddStaff = () => {
  clinic.addStaff({ ...newStaff.value })
  ui.addToast('Staff member added successfully', 'success')
  showAddModal.value = false
  newStaff.value = { name: '', role: 'Nurse', department: 'General Medicine', phone: '', email: '', shift: 'Morning', status: 'Active' }
}

</script>

<template>
  <div class="cc-page">
    <div class="cc-page-header">
      <div>
        <h1 class="cc-page-title">Staff Directory</h1>
        <p class="cc-page-subtitle">Manage non-medical clinic personnel</p>
      </div>
      <div class="header-actions">
        <button class="cc-btn cc-btn-primary cc-shadow-glow" @click="showAddModal = true">
          <i class="ri-user-add-line"></i> Add Staff
        </button>
      </div>
    </div>

    <div class="cc-card table-card">
      <div class="table-responsive" v-if="staff.length > 0">
        <table class="cc-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Contact</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in staff" :key="member.id">
              <td>
                <div class="staff-cell">
                  <div class="avatar-sm cc-gradient-primary">{{ member.name.charAt(0) }}</div>
                  <span class="font-bold">{{ member.name }}</span>
                </div>
              </td>
              <td><span class="cc-badge cc-badge-neutral">{{ member.role }}</span></td>
              <td>{{ member.department }}</td>
              <td>
                <div>{{ member.phone }}</div>
                <div class="text-muted">{{ member.email }}</div>
              </td>
              <td>{{ member.shift }}</td>
              <td>
                <span class="cc-badge" :class="member.status === 'Active' ? 'cc-badge-success' : 'cc-badge-warning'">
                  {{ member.status }}
                </span>
              </td>
              <td>
                <button class="cc-btn-icon cc-btn-ghost"><i class="ri-edit-line"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <i class="ri-team-line"></i>
        <p>No staff records found.</p>
      </div>
    </div>

    <!-- Add Staff Modal -->
    <Modal :show="showAddModal" title="Add New Staff Member" @close="showAddModal = false" width="500px">
      <form id="addStaffForm" @submit.prevent="handleAddStaff" class="form-grid">
        <div class="form-group full-width">
          <label>Full Name</label>
          <input type="text" v-model="newStaff.name" required placeholder="E.g. Sarah Connor" />
        </div>
        <div class="form-group">
          <label>Role</label>
          <select v-model="newStaff.role">
            <option>Nurse</option>
            <option>Receptionist</option>
            <option>Lab Technician</option>
            <option>Pharmacist</option>
            <option>Cleaner</option>
          </select>
        </div>
        <div class="form-group">
          <label>Shift</label>
          <select v-model="newStaff.shift">
            <option>Morning</option>
            <option>Evening</option>
            <option>Night</option>
          </select>
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="text" v-model="newStaff.phone" required placeholder="+1..." />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="newStaff.email" required placeholder="staff@clinic.com" />
        </div>
      </form>
      <template #footer>
        <button class="cc-btn cc-btn-ghost" @click="showAddModal = false">Cancel</button>
        <button type="submit" form="addStaffForm" class="cc-btn cc-btn-primary">Add Staff</button>
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

.table-card {
  padding-bottom: 0;
  overflow: hidden;
}

.staff-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar-sm {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.font-bold {
  font-weight: 700;
  color: var(--cc-text);
}
.text-muted {
  font-size: 12px;
  color: var(--cc-text-muted);
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
