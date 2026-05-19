<script setup>
import { computed, ref } from 'vue'
import { useClinicStore } from '@/stores/clinic'
import { useUiStore } from '@/stores/ui'
import Modal from '@/components/Modal.vue'

const clinic = useClinicStore()
const ui = useUiStore()

const searchQuery = ref('')
const categoryFilter = ref('All')

const inventory = computed(() => {
  return clinic.inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCat = categoryFilter.value === 'All' || item.category === categoryFilter.value
    return matchesSearch && matchesCat
  })
})

const showAddModal = ref(false)
const newItem = ref({
  name: '',
  category: 'Medicine',
  stock: 0,
  unit: 'pcs',
  price: 0,
  supplier: '',
  expiry: '',
  status: 'In Stock'
})

const handleAddItem = () => {
  const status = newItem.value.stock === 0 ? 'Out' : newItem.value.stock < 50 ? 'Low' : 'In Stock'
  clinic.addInventory({ ...newItem.value, status })
  ui.addToast('Item added to inventory', 'success')
  showAddModal.value = false
  newItem.value = { name: '', category: 'Medicine', stock: 0, unit: 'pcs', price: 0, supplier: '', expiry: '', status: 'In Stock' }
}

</script>

<template>
  <div class="cc-page">
    <div class="cc-page-header">
      <div>
        <h1 class="cc-page-title">Pharmacy & Inventory</h1>
        <p class="cc-page-subtitle">Track medical supplies and stock levels</p>
      </div>
      <div class="header-actions">
        <button class="cc-btn cc-btn-primary cc-shadow-glow" @click="showAddModal = true">
          <i class="ri-add-line"></i> Add Item
        </button>
      </div>
    </div>

    <div class="cc-card table-card">
      <div class="table-toolbar">
        <div class="search-box">
          <i class="ri-search-line"></i>
          <input type="text" v-model="searchQuery" placeholder="Search items..." />
        </div>
        <select v-model="categoryFilter" class="status-filter">
          <option value="All">All Categories</option>
          <option value="Medicine">Medicine</option>
          <option value="Equipment">Equipment</option>
          <option value="Consumable">Consumable</option>
        </select>
      </div>

      <div class="table-responsive" v-if="inventory.length > 0">
        <table class="cc-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Stock Level</th>
              <th>Price/Unit</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in inventory" :key="item.id">
              <td class="font-bold">{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>
                <div class="stock-cell">
                  <span class="font-bold">{{ item.stock }}</span>
                  <span class="text-muted">{{ item.unit }}</span>
                </div>
              </td>
              <td>${{ item.price.toFixed(2) }}</td>
              <td>{{ item.supplier }}</td>
              <td>
                <span class="cc-badge" :class="{
                  'cc-badge-success': item.status === 'In Stock',
                  'cc-badge-warning': item.status === 'Low',
                  'cc-badge-danger': item.status === 'Out'
                }">{{ item.status }}</span>
              </td>
              <td>
                <button class="cc-btn-icon cc-btn-ghost" title="Edit"><i class="ri-edit-line"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="empty-state">
        <i class="ri-archive-stack-line"></i>
        <p>No inventory items found.</p>
      </div>
    </div>

    <!-- Add Inventory Item Modal -->
    <Modal :show="showAddModal" title="Add New Inventory Item" @close="showAddModal = false" width="500px">
      <form id="addItemForm" @submit.prevent="handleAddItem" class="form-grid">
        <div class="form-group full-width">
          <label>Item Name</label>
          <input type="text" v-model="newItem.name" required placeholder="E.g. Paracetamol 500mg" />
        </div>
        <div class="form-group">
          <label>Category</label>
          <select v-model="newItem.category">
            <option>Medicine</option>
            <option>Equipment</option>
            <option>Consumable</option>
          </select>
        </div>
        <div class="form-group">
          <label>Stock Quantity</label>
          <input type="number" v-model="newItem.stock" required />
        </div>
        <div class="form-group">
          <label>Unit</label>
          <input type="text" v-model="newItem.unit" required placeholder="pcs, box, bottle" />
        </div>
        <div class="form-group">
          <label>Price per Unit ($)</label>
          <input type="number" v-model="newItem.price" step="0.01" required />
        </div>
        <div class="form-group">
          <label>Supplier</label>
          <input type="text" v-model="newItem.supplier" required placeholder="Supplier Name" />
        </div>
        <div class="form-group">
          <label>Expiry Date</label>
          <input type="date" v-model="newItem.expiry" required />
        </div>
      </form>
      <template #footer>
        <button class="cc-btn cc-btn-ghost" @click="showAddModal = false">Cancel</button>
        <button type="submit" form="addItemForm" class="cc-btn cc-btn-primary">Add to Stock</button>
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

.font-bold {
  font-weight: 700;
  color: var(--cc-text);
}
.text-muted {
  font-size: 13px;
  color: var(--cc-text-muted);
}

.stock-cell {
  display: flex;
  align-items: baseline;
  gap: 4px;
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
