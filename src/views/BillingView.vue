<script setup>
import { computed, ref } from 'vue'
import { useClinicStore } from '@/stores/clinic'
import { useUiStore } from '@/stores/ui'
import Modal from '@/components/Modal.vue'

const clinic = useClinicStore()
const ui = useUiStore()

const bills = computed(() => clinic.bills)
const patients = computed(() => clinic.patients)

const showAddModal = ref(false)
const newBill = ref({
  patientId: '',
  patientName: '',
  service: 'Consultation',
  amount: 0,
  tax: 0,
  status: 'Pending'
})

const handleAddBill = () => {
  const p = patients.value.find(x => x.id === newBill.value.patientId)
  if (p) newBill.value.patientName = p.name
  
  clinic.addBill({ ...newBill.value })
  ui.addToast('Invoice created successfully', 'success')
  showAddModal.value = false
  newBill.value = { patientId: '', patientName: '', service: 'Consultation', amount: 0, tax: 0, status: 'Pending' }
}

const markPaid = (id) => {
  clinic.markBillPaid(id)
  ui.addToast(`Bill marked as paid`, 'success')
}

const formatMoney = (amount) => `$${Number(amount).toFixed(2)}`
</script>

<template>
  <div class="cc-page">
    <div class="cc-page-header">
      <div>
        <h1 class="cc-page-title">Billing & Payments</h1>
        <p class="cc-page-subtitle">Manage patient invoices and payments</p>
      </div>
      <div class="header-actions">
        <button class="cc-btn cc-btn-primary cc-shadow-glow" @click="showAddModal = true">
          <i class="ri-add-line"></i> Create Invoice
        </button>
      </div>
    </div>

    <div class="cc-card table-card">
      <div class="table-responsive" v-if="bills.length > 0">
        <table class="cc-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bill in bills" :key="bill.id">
              <td class="font-bold text-primary">#{{ bill.id }}</td>
              <td class="font-bold">{{ bill.patientName }}</td>
              <td>{{ bill.date }}</td>
              <td>{{ bill.service }}</td>
              <td class="font-bold">{{ formatMoney(bill.total) }}</td>
              <td>
                <span class="cc-badge" :class="{
                  'cc-badge-success': bill.status === 'Paid',
                  'cc-badge-warning': bill.status === 'Pending',
                  'cc-badge-danger': bill.status === 'Overdue'
                }">{{ bill.status }}</span>
              </td>
              <td>
                <button v-if="bill.status !== 'Paid'" class="cc-btn cc-btn-sm cc-btn-ghost" @click="markPaid(bill.id)">
                  Mark Paid
                </button>
                <button v-else class="cc-btn-icon cc-btn-ghost" title="Download Receipt">
                  <i class="ri-download-2-line"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <i class="ri-file-list-3-line"></i>
        <p>No billing records found.</p>
      </div>
    </div>

    <!-- Create Invoice Modal -->
    <Modal :show="showAddModal" title="Create New Invoice" @close="showAddModal = false" width="500px">
      <form id="addBillForm" @submit.prevent="handleAddBill" class="form-grid">
        <div class="form-group full-width">
          <label>Select Patient</label>
          <select v-model="newBill.patientId" required>
            <option value="" disabled>Choose a patient...</option>
            <option v-for="p in patients" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div class="form-group full-width">
          <label>Service</label>
          <input type="text" v-model="newBill.service" required placeholder="Consultation, Lab Test, etc." />
        </div>
        <div class="form-group">
          <label>Base Amount ($)</label>
          <input type="number" v-model="newBill.amount" required />
        </div>
        <div class="form-group">
          <label>Tax ($)</label>
          <input type="number" v-model="newBill.tax" required />
        </div>
      </form>
      <template #footer>
        <button class="cc-btn cc-btn-ghost" @click="showAddModal = false">Cancel</button>
        <button type="submit" form="addBillForm" class="cc-btn cc-btn-primary">Create Invoice</button>
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
.font-bold { font-weight: 700; }
.text-primary { color: var(--cc-primary); }

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
